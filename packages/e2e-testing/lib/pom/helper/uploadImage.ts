import { Locator, Page } from '@playwright/test';

export class UploadImage {
  private readonly imagePreview: Locator;
  private readonly uploadButton: Locator;
  private readonly removeButton: Locator;

  constructor(private readonly page: Page) {
    this.imagePreview = page.locator('.css-6eut39'); //TODO: add attribute to make it independent of theme
    this.uploadButton = page.getByRole('button', { name: 'Unggah' });
    this.removeButton = page.getByRole('button', { name: 'Hapus' });
  }

  async clickImagePreview() {
    await this.imagePreview.click();
  }

  async clickUploadButton() {
    await this.uploadButton.click();
  }

  async clickRemoveButton() {
    await this.removeButton.click();
  }
}
