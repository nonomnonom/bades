import { Locator, Page } from '@playwright/test';

export class GeneralSection {
  private readonly workspaceNameField: Locator;
  private readonly supportSwitch: Locator;
  private readonly deleteWorkspaceButton: Locator;
  private readonly customizeDomainButton: Locator;
  private readonly subdomainInput: Locator;

  constructor(private readonly page: Page) {
    this.workspaceNameField = page.getByPlaceholder('Desa Sukamaju');
    this.supportSwitch = page.getByRole('checkbox').nth(1);
    this.deleteWorkspaceButton = page.getByRole('button', {
      name: 'Hapus workspace',
    });
    this.customizeDomainButton = page.getByRole('button', {
      name: 'Atur domain',
    });
    this.subdomainInput = page.locator(
      '//div[contains(.,".bades.id")]/../input',
    );
  }

  async changeWorkspaceName(workspaceName: string) {
    await this.workspaceNameField.clear();
    await this.workspaceNameField.fill(workspaceName);
  }

  async changeSupportSwitchState() {
    await this.supportSwitch.click();
  }

  async clickDeleteWorkSpaceButton() {
    await this.deleteWorkspaceButton.click();
  }

  async changeSubdomain(subdomain: string) {
    await this.customizeDomainButton.click();
    await this.subdomainInput.fill(subdomain);
    await this.page.getByRole('button', { name: 'Simpan' }).click();
  }
}
