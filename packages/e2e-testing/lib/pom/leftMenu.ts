import { Locator, Page } from '@playwright/test';

export class LeftMenu {
  private readonly workspaceDropdown: Locator;
  private readonly leftMenu: Locator;
  private readonly searchSubTab: Locator;
  private readonly settingsTab: Locator;
  private readonly pendudukTab: Locator;
  private readonly keluargaTab: Locator;
  private readonly programBantuanTab: Locator;
  private readonly programBantuanTabAll: Locator;
  private readonly programBantuanTabByStage: Locator;
  private readonly tugasTab: Locator;
  private readonly tugasTabAll: Locator;
  private readonly tugasTabByStatus: Locator;
  private readonly catatanTab: Locator;
  private readonly roketTab: Locator;
  private readonly workflowsTab: Locator;

  constructor(private readonly page: Page) {
    this.workspaceDropdown = page.getByTestId('workspace-dropdown');
    this.leftMenu = page.getByRole('button').first();
    this.searchSubTab = page.getByText('Cari');
    this.settingsTab = page.getByRole('button', { name: 'Pengaturan' });
    this.pendudukTab = page.getByRole('link', { name: 'Penduduk' });
    this.keluargaTab = page.getByRole('link', { name: 'Keluarga' });
    this.programBantuanTab = page.getByRole('link', {
      name: 'Program Bantuan',
    });
    this.programBantuanTabAll = page.getByRole('link', {
      name: 'Semua',
      exact: true,
    });
    this.programBantuanTabByStage = page.getByRole('link', {
      name: 'Per Tahap',
    });
    this.tugasTab = page.getByRole('link', { name: 'Tugas' });
    this.tugasTabAll = page.getByRole('link', { name: 'Semua Tugas' });
    this.tugasTabByStatus = page.getByRole('link', { name: 'Catatan' });
    this.catatanTab = page.getByRole('link', { name: 'Catatan' });
    this.roketTab = page.getByRole('link', { name: 'Roket' });
    this.workflowsTab = page.getByRole('link', { name: 'Workflow' });
  }

  async selectWorkspace(workspaceName: string) {
    await this.workspaceDropdown.click();
    await this.page
      .getByTestId('tooltip')
      .filter({ hasText: workspaceName })
      .click();
  }

  async changeLeftMenu() {
    await this.leftMenu.click();
  }

  async openSearchTab() {
    await this.searchSubTab.click();
  }

  async goToSettings() {
    await this.settingsTab.click();
  }

  async goToPendudukTab() {
    await this.pendudukTab.click();
  }

  async goToKeluargaTab() {
    await this.keluargaTab.click();
  }

  async goToProgramBantuanTab() {
    await this.programBantuanTab.click();
  }

  async goToProgramBantuanTableView() {
    await this.programBantuanTabAll.click();
  }

  async goToProgramBantuanKanbanView() {
    await this.programBantuanTabByStage.click();
  }

  async goToTugasTab() {
    await this.tugasTab.click();
  }

  async goToTugasTableView() {
    await this.tugasTabAll.click();
  }

  async goToTugasKanbanView() {
    await this.tugasTabByStatus.click();
  }

  async goToCatatanTab() {
    await this.catatanTab.click();
  }

  async goToRoketTab() {
    await this.roketTab.click();
  }

  async goToWorkflowsTab() {
    await this.workflowsTab.click();
  }

  async goToCustomObject(customObjectName: string) {
    await this.page.getByRole('link', { name: customObjectName }).click();
  }

  async goToCustomObjectView(name: string) {
    await this.page.getByRole('link', { name: name }).click();
  }
}

export default LeftMenu;
