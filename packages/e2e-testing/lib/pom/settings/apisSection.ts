import { Locator, Page } from '@playwright/test';

export class APIsSection {
  private readonly createAPIKeyButton: Locator;
  private readonly regenerateAPIKeyButton: Locator;
  private readonly nameOfAPIKeyInput: Locator;
  private readonly expirationDateAPIKeySelect: Locator;
  private readonly cancelButton: Locator;
  private readonly saveButton: Locator;
  private readonly deleteButton: Locator;

  constructor(public readonly page: Page) {
    this.page = page;
    this.createAPIKeyButton = page.getByRole('link', {
      name: 'Buat Kunci API',
    });
    this.nameOfAPIKeyInput = page
      .getByPlaceholder('Mis. integrasi backoffice')
      .first();
    this.expirationDateAPIKeySelect = page.locator(
      'div[aria-controls="object-field-type-select-options"]',
    );
    this.regenerateAPIKeyButton = page.getByRole('button', {
      name: 'Regenerasi Kunci',
    });
    this.cancelButton = page.getByRole('button', { name: 'Batal' });
    this.saveButton = page.getByRole('button', { name: 'Simpan' });
    this.deleteButton = page.getByRole('button', { name: 'Hapus' });
  }

  async createAPIKey() {
    await this.createAPIKeyButton.click();
  }

  async typeAPIKeyName(name: string) {
    await this.nameOfAPIKeyInput.clear();
    await this.nameOfAPIKeyInput.fill(name);
  }

  async selectAPIExpirationDate(date: string) {
    await this.expirationDateAPIKeySelect.click();
    await this.page.getByText(date, { exact: true }).click();
  }

  async regenerateAPIKey() {
    await this.regenerateAPIKeyButton.click();
  }

  async deleteAPIKey() {
    await this.deleteButton.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async checkAPIKeyDetails(name: string) {
    await this.page.locator(`//a/div[contains(.,'${name}')][first()]`).click();
  }
}
