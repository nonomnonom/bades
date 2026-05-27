import { expect, test } from '../lib/fixtures/screenshot';
import { deleteWorkflow } from '../lib/requests/delete-workflow';
import { destroyWorkflow } from '../lib/requests/destroy-workflow';

test('Buat workflow', async ({ page }) => {
  const NEW_WORKFLOW_NAME = 'Workflow Uji';

  await page.goto(process.env.LINK);

  const workflowsFolder = page.getByRole('button', { name: 'Workflow' });
  await workflowsFolder.click();

  const workflowsLink = page.getByRole('link', { name: 'Workflow' });
  await workflowsLink.click();

  const createWorkflowButton = page.getByRole('button', {
    name: 'Buat workflow baru',
  });

  const [createWorkflowResponse] = await Promise.all([
    page.waitForResponse(async (response) => {
      if (!response.url().endsWith('/graphql')) {
        return false;
      }

      const requestBody = response.request().postDataJSON();

      return requestBody.operationName === 'CreateOneWorkflow';
    }),

    createWorkflowButton.click()
  ]);


  const recordName = page.getByTestId('top-bar-title').getByPlaceholder('Nama');
  await expect(recordName).toBeVisible();
  await recordName.fill(NEW_WORKFLOW_NAME);

  const workflowDiagramContainer = page.locator('.react-flow__renderer');
  await workflowDiagramContainer.click();

  const body = await createWorkflowResponse.json();
  const newWorkflowId = body.data.createWorkflow.id;

  try {
    const workflowName = page
      .getByTestId('top-bar-title')
      .getByText(NEW_WORKFLOW_NAME); // 'Workflow Uji'

    // Wait for the name to be visible and not hidden
    await workflowName.waitFor({ state: 'visible' });
    await expect(workflowName).toBeVisible();

    await expect(page).toHaveURL(`/object/workflow/${newWorkflowId}`);
  } finally {
    await deleteWorkflow({
      page,
      workflowId: newWorkflowId,
    });
    await destroyWorkflow({
      page,
      workflowId: newWorkflowId,
    });
  }
});
