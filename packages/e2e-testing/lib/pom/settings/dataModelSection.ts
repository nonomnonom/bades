import { Locator, Page } from '@playwright/test';

export class DataModelSection {
  private readonly searchObjectInput: Locator;
  private readonly addObjectButton: Locator;
  private readonly objectSingularNameInput: Locator;
  private readonly objectPluralNameInput: Locator;
  private readonly objectDescription: Locator;
  private readonly synchronizeLabelAPIToggle: Locator;
  private readonly objectAPISingularNameInput: Locator;
  private readonly objectAPIPluralNameInput: Locator;
  private readonly objectMoreOptionsButton: Locator;
  private readonly editObjectButton: Locator;
  private readonly deleteObjectButton: Locator;
  private readonly activeSection: Locator;
  private readonly inactiveSection: Locator;
  private readonly searchFieldInput: Locator;
  private readonly addFieldButton: Locator;
  private readonly viewFieldDetailsMoreOptionsButton: Locator;
  private readonly nameFieldInput: Locator;
  private readonly descriptionFieldInput: Locator;
  private readonly deactivateMoreOptionsButton: Locator;
  private readonly activateMoreOptionsButton: Locator;
  private readonly deactivateButton: Locator; // TODO: add attribute to make it one button
  private readonly activateButton: Locator;
  private readonly cancelButton: Locator;
  private readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.searchObjectInput = page.getByPlaceholder('Cari objek...');
    this.addObjectButton = page.getByRole('button', { name: 'Tambah objek' });
    this.objectSingularNameInput = page.getByPlaceholder('Nama tunggal', {
      exact: true,
    });
    this.objectPluralNameInput = page.getByPlaceholder('Nama jamak', {
      exact: true,
    });
    this.objectDescription = page.getByPlaceholder('Tulis deskripsi');
    this.synchronizeLabelAPIToggle = page.getByRole('checkbox').nth(1);
    this.objectAPISingularNameInput = page.getByPlaceholder('namaSingular', {
      exact: true,
    });
    this.objectAPIPluralNameInput = page.getByPlaceholder('namaPlural', {
      exact: true,
    });
    this.objectMoreOptionsButton = page.getByLabel('Opsi Objek');
    this.editObjectButton = page.getByTestId('tooltip').getByText('Ubah');
    this.deactivateMoreOptionsButton = page
      .getByTestId('tooltip')
      .getByText('Nonaktifkan');
    this.activateMoreOptionsButton = page
      .getByTestId('tooltip')
      .getByText('Aktifkan');
    this.deleteObjectButton = page.getByTestId('tooltip').getByText('Hapus');
    this.activeSection = page.getByText('Aktif', { exact: true });
    this.inactiveSection = page.getByText('Tidak aktif');
    this.searchFieldInput = page.getByPlaceholder('Cari field...');
    this.addFieldButton = page.getByRole('button', { name: 'Tambah field' });
    this.viewFieldDetailsMoreOptionsButton = page
      .getByTestId('tooltip')
      .getByText('Lihat');
    this.nameFieldInput = page.getByPlaceholder('Nama field');
    this.descriptionFieldInput = page.getByPlaceholder('Tulis deskripsi');
    this.deactivateButton = page.getByRole('button', { name: 'Nonaktifkan' });
    this.activateButton = page.getByRole('button', { name: 'Aktifkan' });
    this.cancelButton = page.getByRole('button', { name: 'Batal' });
    this.saveButton = page.getByRole('button', { name: 'Simpan' });
  }

  async searchObject(name: string) {
    await this.searchObjectInput.fill(name);
  }

  async clickAddObjectButton() {
    await this.addObjectButton.click();
  }

  async typeObjectSingularName(name: string) {
    await this.objectSingularNameInput.fill(name);
  }

  async typeObjectPluralName(name: string) {
    await this.objectPluralNameInput.fill(name);
  }

  async typeObjectDescription(name: string) {
    await this.objectDescription.fill(name);
  }

  async toggleSynchronizeLabelAPI() {
    await this.synchronizeLabelAPIToggle.click();
  }

  async typeObjectSingularAPIName(name: string) {
    await this.objectAPISingularNameInput.fill(name);
  }

  async typeObjectPluralAPIName(name: string) {
    await this.objectAPIPluralNameInput.fill(name);
  }

  async checkObjectDetails(name: string) {
    await this.page.getByRole('link').filter({ hasText: name }).click();
  }

  async activateInactiveObject(name: string) {
    await this.page
      .locator(`//div[@title="${name}"]/../../div[last()]`)
      .click();
    await this.activateButton.click();
  }

  // object can be deleted only if is custom and inactive
  async deleteInactiveObject(name: string) {
    await this.page
      .locator(`//div[@title="${name}"]/../../div[last()]`)
      .click();
    await this.deleteObjectButton.click();
  }

  async editObjectDetails() {
    await this.objectMoreOptionsButton.click();
    await this.editObjectButton.click();
  }

  async deactivateObjectWithMoreOptions() {
    await this.objectMoreOptionsButton.click();
    await this.deactivateButton.click();
  }

  async searchField(name: string) {
    await this.searchFieldInput.fill(name);
  }

  async checkFieldDetails(name: string) {
    await this.page.locator(`//div[@title="${name}"]`).click();
  }

  async checkFieldDetailsWithButton(name: string) {
    await this.page
      .locator(`//div[@title="${name}"]/../../div[last()]`)
      .click();
    await this.viewFieldDetailsMoreOptionsButton.click();
  }

  async deactivateFieldWithButton(name: string) {
    await this.page
      .locator(`//div[@title="${name}"]/../../div[last()]`)
      .click();
    await this.deactivateMoreOptionsButton.click();
  }

  async activateFieldWithButton(name: string) {
    await this.page
      .locator(`//div[@title="${name}"]/../../div[last()]`)
      .click();
    await this.activateMoreOptionsButton.click();
  }

  async clickAddFieldButton() {
    await this.addFieldButton.click();
  }

  async typeFieldName(name: string) {
    await this.nameFieldInput.clear();
    await this.nameFieldInput.fill(name);
  }

  async typeFieldDescription(description: string) {
    await this.descriptionFieldInput.clear();
    await this.descriptionFieldInput.fill(description);
  }

  async clickInactiveSection() {
    await this.inactiveSection.click();
  }

  async clickActiveSection() {
    await this.activeSection.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }
}
