// Bades: workflow "quick lead" spesifik CRM (lead → opportunity), tidak ada padanan
// operasional desa — test di-rewrite menjadi "Pendaftaran Warga Baru" yang merupakan
// alur pendaftaran warga (formulir → buat keluarga/instansi → buat penduduk).
// Workflow IDs tetap sama karena diambil dari prefill-workflows.util.ts.

import request from 'supertest';
import {
  destroyWorkflowRun,
  getWorkflowRun,
  runWorkflowVersion,
} from 'test/integration/graphql/suites/workflow/utils/workflow-run-test.util';
import { v4 as uuidv4 } from 'uuid';

const client = request(`http://localhost:${APP_PORT}`);

// ID workflow Pendaftaran Warga Baru dari prefill-workflows.util.ts
const PENDAFTARAN_WARGA_WORKFLOW_ID = '8b213cac-a68b-4ffe-817a-3ec994e9932d';
const PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID =
  'ac67974f-c524-4288-9d88-af8515400b68';
const FORM_STEP_ID = '6e089bc9-aabd-435f-865f-f31c01c8f4a7';
const BUAT_INSTANSI_STEP_ID = '0715b6cd-7cc1-4b98-971b-00f54dfe643b';
const BUAT_PENDUDUK_STEP_ID = '6f553ea7-b00e-4371-9d88-d8298568a246';

describe('Workflow Pendaftaran Warga Baru (e2e)', () => {
  let createdWorkflowRunId: string | null = null;

  afterAll(async () => {
    if (createdWorkflowRunId) {
      await destroyWorkflowRun(createdWorkflowRunId);
    }
  });

  describe('Pemicu workflow', () => {
    it('harus memverifikasi workflow Pendaftaran Warga Baru ada dan aktif', async () => {
      const response = await client
        .post('/graphql')
        .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
        .send({
          query: `
            query FindWorkflow {
              workflow(filter: { id: { eq: "${PENDAFTARAN_WARGA_WORKFLOW_ID}" } }) {
                id
                name
                lastPublishedVersionId
                statuses
              }
            }
          `,
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.workflow).toBeDefined();
      expect(response.body.data.workflow.id).toBe(PENDAFTARAN_WARGA_WORKFLOW_ID);
      expect(response.body.data.workflow.name).toBe('Pendaftaran Warga Baru');
      expect(response.body.data.workflow.lastPublishedVersionId).toBe(
        PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
      );
      expect(response.body.data.workflow.statuses).toContain('ACTIVE');
    });

    it('harus memverifikasi versi workflow Pendaftaran Warga Baru memiliki struktur yang benar', async () => {
      const response = await client
        .post('/graphql')
        .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
        .send({
          query: `
            query FindWorkflowVersion {
              workflowVersion(filter: { id: { eq: "${PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID}" } }) {
                id
                name
                status
                trigger
                steps
              }
            }
          `,
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();

      const workflowVersion = response.body.data.workflowVersion;

      expect(workflowVersion).toBeDefined();
      expect(workflowVersion.status).toBe('ACTIVE');

      // Verifikasi struktur trigger
      const trigger = workflowVersion.trigger;

      expect(trigger.type).toBe('MANUAL');
      expect(trigger.nextStepIds).toContain(FORM_STEP_ID);

      // Verifikasi struktur steps
      const steps = workflowVersion.steps;

      expect(steps).toHaveLength(3);

      // Step formulir
      const formStep = steps.find(
        (step: { id: string }) => step.id === FORM_STEP_ID,
      );

      expect(formStep).toBeDefined();
      expect(formStep.type).toBe('FORM');
      expect(formStep.name).toBe('Formulir Pendaftaran');

      // Step buat lembaga/instansi
      const buatInstansiStep = steps.find(
        (step: { id: string }) => step.id === BUAT_INSTANSI_STEP_ID,
      );

      expect(buatInstansiStep).toBeDefined();
      expect(buatInstansiStep.type).toBe('CREATE_RECORD');
      expect(buatInstansiStep.name).toBe('Buat Lembaga/Instansi');

      // Step buat penduduk
      const buatPendudukStep = steps.find(
        (step: { id: string }) => step.id === BUAT_PENDUDUK_STEP_ID,
      );

      expect(buatPendudukStep).toBeDefined();
      expect(buatPendudukStep.type).toBe('CREATE_RECORD');
      expect(buatPendudukStep.name).toBe('Buat Penduduk');
    });

    it('harus memicu workflow Pendaftaran Warga Baru dan membuat workflow run', async () => {
      const workflowRunId = await runWorkflowVersion({
        workflowVersionId: PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
      });

      createdWorkflowRunId = workflowRunId;

      const workflowRun = await getWorkflowRun(workflowRunId);

      expect(workflowRun).toBeDefined();
      expect(workflowRun?.workflowVersionId).toBe(
        PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
      );
      expect(workflowRun?.status).toBe('RUNNING');
      expect(workflowRun?.state).toBeDefined();
      expect(workflowRun?.state?.stepInfos).toBeDefined();
      expect(workflowRun?.state?.stepInfos?.trigger).toBeDefined();
      expect(workflowRun?.state?.stepInfos?.[FORM_STEP_ID]).toBeDefined();
      expect(
        workflowRun?.state?.stepInfos?.[BUAT_INSTANSI_STEP_ID],
      ).toBeDefined();
      expect(
        workflowRun?.state?.stepInfos?.[BUAT_PENDUDUK_STEP_ID],
      ).toBeDefined();

      expect(workflowRun?.state?.stepInfos?.trigger?.status).toBe('SUCCESS');
      expect(workflowRun?.state?.stepInfos?.[FORM_STEP_ID]?.status).toBe(
        'PENDING',
      );
      expect(
        workflowRun?.state?.stepInfos?.[BUAT_INSTANSI_STEP_ID]?.status,
      ).toBe('NOT_STARTED');
      expect(
        workflowRun?.state?.stepInfos?.[BUAT_PENDUDUK_STEP_ID]?.status,
      ).toBe('NOT_STARTED');
    });

    it('harus bisa menghentikan workflow run yang sedang berjalan', async () => {
      const workflowRunId = await runWorkflowVersion({
        workflowVersionId: PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
      });

      const stopResponse = await client
        .post('/graphql')
        .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
        .send({
          query: `
            mutation StopWorkflowRun($workflowRunId: UUID!) {
              stopWorkflowRun(workflowRunId: $workflowRunId) {
                id
                status
              }
            }
          `,
          variables: { workflowRunId },
        });

      expect(stopResponse.body.errors).toBeUndefined();
      expect(stopResponse.body.data.stopWorkflowRun.status).toBe('STOPPED');

      const workflowRun = await getWorkflowRun(workflowRunId);

      expect(workflowRun?.status).toBe('STOPPED');
      await destroyWorkflowRun(workflowRunId);
    });
  });

  describe('Eksekusi workflow lengkap dengan pengisian formulir', () => {
    let testWorkflowRunId: string | null = null;
    let createdInstansiId: string | null = null;
    let createdPendudukId: string | null = null;

    afterAll(async () => {
      // Bersihkan record yang dibuat (urutan terbalik dari pembuatan)
      if (createdPendudukId) {
        await client
          .post('/graphql')
          .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
          .send({
            query: `
              mutation DestroyPenduduk($id: ID!) {
                destroyPenduduk(id: $id) {
                  id
                }
              }
            `,
            variables: { id: createdPendudukId },
          });
      }

      if (createdInstansiId) {
        await client
          .post('/graphql')
          .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
          .send({
            query: `
              mutation DestroyKeluarga($id: ID!) {
                destroyKeluarga(id: $id) {
                  id
                }
              }
            `,
            variables: { id: createdInstansiId },
          });
      }

      if (testWorkflowRunId) {
        await destroyWorkflowRun(testWorkflowRunId);
      }
    });

    it('harus menyelesaikan workflow lengkap: pemicu → isi formulir → buat Instansi dan Penduduk', async () => {
      testWorkflowRunId = await runWorkflowVersion({
        workflowVersionId: PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
      });

      expect(testWorkflowRunId).toBeDefined();

      let workflowRun = await getWorkflowRun(testWorkflowRunId as string);

      expect(workflowRun?.status).toBe('RUNNING');
      expect(workflowRun?.state?.stepInfos?.[FORM_STEP_ID]?.status).toBe(
        'PENDING',
      );

      const testId = uuidv4().slice(0, 8);
      const testFormData = {
        firstName: 'Budi',
        lastName: `Santoso-${testId}`,
        email: `budi-${testId}@desa.go.id`,
        jobTitle: 'Petani',
        companyName: `Kelompok Tani ${testId}`,
        companyDomain: `https://kt-${testId}.desa.go.id`,
      };

      const submitFormResponse = await client
        .post('/graphql')
        .set('Authorization', `Bearer ${APPLE_JANE_ADMIN_ACCESS_TOKEN}`)
        .send({
          query: `
            mutation SubmitFormStep($input: SubmitFormStepInput!) {
              submitFormStep(input: $input)
            }
          `,
          variables: {
            input: {
              stepId: FORM_STEP_ID,
              workflowRunId: testWorkflowRunId,
              response: testFormData,
            },
          },
        });

      expect(submitFormResponse.body.errors).toBeUndefined();
      expect(submitFormResponse.body.data.submitFormStep).toBe(true);

      workflowRun = await getWorkflowRun(testWorkflowRunId as string);
      expect(workflowRun?.status).toBe('COMPLETED');
      expect(workflowRun?.state?.stepInfos?.trigger?.status).toBe('SUCCESS');
      expect(workflowRun?.state?.stepInfos?.[FORM_STEP_ID]?.status).toBe(
        'SUCCESS',
      );
      expect(
        workflowRun?.state?.stepInfos?.[BUAT_INSTANSI_STEP_ID]?.status,
      ).toBe('SUCCESS');
      expect(
        workflowRun?.state?.stepInfos?.[BUAT_PENDUDUK_STEP_ID]?.status,
      ).toBe('SUCCESS');

      const instansiStepResult = workflowRun?.state?.stepInfos?.[
        BUAT_INSTANSI_STEP_ID
      ]?.result as { id?: string } | undefined;

      createdInstansiId = instansiStepResult?.id ?? null;
      expect(createdInstansiId).toBeDefined();

      const pendudukStepResult = workflowRun?.state?.stepInfos?.[
        BUAT_PENDUDUK_STEP_ID
      ]?.result as { id?: string } | undefined;

      createdPendudukId = pendudukStepResult?.id ?? null;
      expect(createdPendudukId).toBeDefined();
    });
  });
});
