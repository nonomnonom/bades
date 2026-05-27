import { test as base, expect, Locator, Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { createWorkflow } from '../requests/create-workflow';
import { deleteWorkflow } from '../requests/delete-workflow';
import { destroyWorkflow } from '../requests/destroy-workflow';
import { WorkflowActionType, WorkflowTriggerType } from '../types/workflows';

export class WorkflowVisualizerPage {
  #page: Page;

  workflowId: string;
  workflowName: string;

  readonly addStepButton: Locator;
  readonly workflowStatus: Locator;
  readonly activateWorkflowButton: Locator;
  readonly deactivateWorkflowButton: Locator;
  readonly addTriggerButton: Locator;
  readonly commandMenu: Locator;
  readonly stepHeaderInCommandMenu: Locator;
  readonly workflowNameLabel: Locator;
  readonly triggerNode: Locator;
  readonly background: Locator;
  readonly useAsDraftButton: Locator;
  readonly overrideDraftButton: Locator;
  readonly discardDraftButton: Locator;
  readonly seeRunsButton: Locator;
  readonly goBackInCommandMenu: Locator;

  #actionNames: Record<WorkflowActionType, string> = {
    'create-record': 'Buat Record',
    'update-record': 'Perbarui Record',
    'delete-record': 'Hapus Record',
    code: 'Kode',
    'send-email': 'Kirim Email',
    form: 'Formulir',
  };

  #createdActionNames: Record<WorkflowActionType, string> = {
    'create-record': 'Buat Record',
    'update-record': 'Perbarui Record',
    'delete-record': 'Hapus Record',
    code: 'Kode - Serverless Function',
    'send-email': 'Kirim Email',
    form: 'Formulir',
  };

  #triggerNames: Record<WorkflowTriggerType, string> = {
    'record-created': 'Record dibuat',
    'record-updated': 'Record diperbarui',
    'record-deleted': 'Record dihapus',
    manual: 'Jalankan manual',
  };

  #createdTriggerNames: Record<WorkflowTriggerType, string> = {
    'record-created': 'Record dibuat',
    'record-updated': 'Record diperbarui',
    'record-deleted': 'Record dihapus',
    manual: 'Jalankan manual',
  };

  constructor({ page, workflowName }: { page: Page; workflowName: string }) {
    this.#page = page;
    this.workflowName = workflowName;

    this.addStepButton = page.getByLabel('Add a step');
    this.workflowStatus = page.getByTestId('workflow-visualizer-status');
    this.activateWorkflowButton = page.getByLabel('Aktifkan Workflow', {
      exact: true,
    });
    this.deactivateWorkflowButton = page.getByLabel('Nonaktifkan Workflow', {
      exact: true,
    });
    this.addTriggerButton = page.getByText('Tambah Pemicu');
    this.commandMenu = page.getByTestId('command-menu');
    this.stepHeaderInCommandMenu = this.commandMenu.getByTestId(
      'workflow-step-header',
    );
    this.workflowNameLabel = page
      .getByTestId('top-bar-title')
      .getByText(this.workflowName);
    this.triggerNode = this.#page.getByTestId('rf__node-trigger');
    this.background = page.locator('.react-flow__pane');
    this.useAsDraftButton = page.getByRole('button', { name: 'Gunakan sebagai konsep' });
    this.overrideDraftButton = page.getByRole('button', {
      name: 'Timpa Konsep',
    });
    this.discardDraftButton = page.getByRole('button', {
      name: 'Buang Konsep',
    });
    this.seeRunsButton = page.getByRole('link', { name: 'Lihat riwayat' });
    this.goBackInCommandMenu = this.commandMenu
      .getByRole('button')
      .and(this.commandMenu.getByTestId('command-menu-go-back-button'));
  }

  async createOneWorkflow() {
    const id = randomUUID();

    const response = await createWorkflow({
      page: this.#page,
      workflowId: id,
      workflowName: this.workflowName,
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.data.createWorkflow.id).toBe(id);

    this.workflowId = id;
  }

  async waitForWorkflowVisualizerLoad() {
    await expect(this.workflowNameLabel).toBeVisible();
  }

  async goToWorkflowVisualizerPage() {
    await this.#page.goto(`/`);

    const workflowsLink = this.#page.getByRole('link', { name: 'Workflow' });

    await workflowsLink.click();

    const workflowLink = this.#page
      .getByTestId(`row-id-${this.workflowId}`)
      .getByRole('link', { name: this.workflowName });

    await workflowLink.click({ force: true });

    await this.waitForWorkflowVisualizerLoad();
  }

  async createInitialTrigger(trigger: WorkflowTriggerType) {
    await this.addTriggerButton.click();

    const triggerName = this.#triggerNames[trigger];
    const createdTriggerName = this.#createdTriggerNames[trigger];

    const triggerOption = this.#page.getByText(triggerName);
    await triggerOption.click();

    await expect(this.triggerNode).toHaveClass(/selected/);
    await expect(this.triggerNode).toContainText(createdTriggerName);
  }

  async createStep(action: WorkflowActionType) {
    await this.addStepButton.click();

    const actionName = this.#actionNames[action];
    const createdActionName = this.#createdActionNames[action];

    const actionToCreateOption = this.commandMenu.getByText(actionName);

    await actionToCreateOption.click();

    const createWorkflowStepResponse = await this.#page.waitForResponse(
      (response) => {
        if (!response.url().endsWith('/graphql')) {
          return false;
        }

        const requestBody = response.request().postDataJSON();

        return requestBody.operationName === 'CreateWorkflowVersionStep';
      },
    );

    const createWorkflowStepResponseBody =
      await createWorkflowStepResponse.json();
    const createdStepId =
      createWorkflowStepResponseBody.data.createWorkflowVersionStep.id;

    const createdActionNode = this.#page
      .locator('.react-flow__node.selected')
      .getByText(createdActionName);

    await expect(createdActionNode).toBeVisible();

    const selectedNodes = this.#page.locator('.react-flow__node.selected');

    await expect(selectedNodes).toHaveCount(1);

    return {
      createdStepId,
    };
  }

  getStepNode(stepId: string) {
    return this.#page.getByTestId(`rf__node-${stepId}`);
  }

  getDeleteNodeButton(nodeLocator: Locator) {
    return nodeLocator.getByRole('button');
  }

  getAllStepNodes() {
    return this.#page
      .getByTestId(/^rf__node-.+$/)
      .and(this.#page.getByTestId(/^((?!rf__node-trigger).)*$/))
      .and(
        this.#page.getByTestId(/^((?!rf__node-branch-\d+__create-step).)*$/),
      );
  }

  async deleteStep(stepId: string) {
    const stepNode = this.getStepNode(stepId);

    await stepNode.click();

    await Promise.all([
      expect(stepNode).not.toBeVisible(),
      this.#page.waitForResponse((response) => {
        if (!response.url().endsWith('/graphql')) {
          return false;
        }

        const requestBody = response.request().postDataJSON();

        return (
          requestBody.operationName === 'DeleteWorkflowVersionStep' &&
          requestBody.variables.input.stepId === stepId
        );
      }),

      this.getDeleteNodeButton(stepNode).click(),
    ]);
  }

  async deleteTrigger() {
    await this.triggerNode.click();

    await Promise.all([
      expect(this.triggerNode).toContainText('Tambah Pemicu'),
      this.#page.waitForResponse((response) => {
        if (!response.url().endsWith('/graphql')) {
          return false;
        }

        const requestBody = response.request().postDataJSON();

        return (
          requestBody.operationName === 'UpdateOneWorkflowVersion' &&
          requestBody.variables.input.trigger === null
        );
      }),

      this.getDeleteNodeButton(this.triggerNode).click(),
    ]);
  }

  async closeSidePanel() {
    const closeButton = this.#page.getByRole('button', {
      name: 'Tutup menu perintah',
    });

    await closeButton.click();

    await expect(this.#page.getByTestId('command-menu')).not.toBeVisible();
  }

  async goToWorkflowsIndexPage() {
    await this.#page.goto('/objects/workflows');
  }

  async setWorkflowsOpenInMode(mode: 'side-panel' | 'record-page') {
    const recordTableOptionsButton = this.#page.getByText('Opsi');
    await recordTableOptionsButton.click();

    const layoutButton = this.#page.getByText('Tata letak');
    await layoutButton.click();

    const openInButton = this.#page.getByText('Buka di');
    await openInButton.click();

    if (mode === 'side-panel') {
      const openInSidePanelOption = this.#page.getByRole('option', {
        name: 'Panel Samping',
      });

      await openInSidePanelOption.click();
    } else {
      const openInRecordPageOption = this.#page.getByRole('option', {
        name: 'Halaman Record',
      });

      await openInRecordPageOption.click();
    }

    // Close the dropdown
    await recordTableOptionsButton.click();
  }
}

export const test = base.extend<{
  workflowVisualizer: WorkflowVisualizerPage;
}>({
  workflowVisualizer: async ({ page }, use) => {
    const workflowVisualizer = new WorkflowVisualizerPage({
      page,
      workflowName: 'Workflow Uji',
    });

    await workflowVisualizer.createOneWorkflow();
    await workflowVisualizer.goToWorkflowVisualizerPage();

    await use(workflowVisualizer);

    await deleteWorkflow({
      page,
      workflowId: workflowVisualizer.workflowId,
    });
    await destroyWorkflow({
      page,
      workflowId: workflowVisualizer.workflowId,
    });

    await workflowVisualizer.goToWorkflowsIndexPage();
    await workflowVisualizer.setWorkflowsOpenInMode('record-page');
  },
});
