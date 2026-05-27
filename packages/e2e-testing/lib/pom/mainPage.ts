import { Locator, Page } from '@playwright/test';

export class MainPage {
  // TODO: add missing elements (advanced filters, import/export popups)
  private readonly tableViews: Locator;
  private readonly addViewButton: Locator;
  private readonly viewIconSelect: Locator;
  private readonly viewNameInput: Locator;
  private readonly viewTypeSelect: Locator;
  private readonly createViewButton: Locator;
  private readonly deleteViewButton: Locator;
  private readonly filterButton: Locator;
  private readonly searchFieldInput: Locator;
  private readonly advancedFilterButton: Locator;
  private readonly addFilterButton: Locator;
  private readonly resetFilterButton: Locator;
  private readonly saveFilterAsViewButton: Locator;
  private readonly sortButton: Locator;
  private readonly sortOrderButton: Locator;
  private readonly optionsButton: Locator;
  private readonly fieldsButton: Locator;
  private readonly goBackButton: Locator;
  private readonly hiddenFieldsButton: Locator;
  private readonly editFieldsButton: Locator;
  private readonly importButton: Locator;
  private readonly deletedRecordsButton: Locator;
  private readonly createNewRecordButton: Locator;
  private readonly addToFavoritesButton: Locator;
  private readonly deleteFromFavoritesButton: Locator;
  private readonly exportBottomBarButton: Locator;
  private readonly deleteRecordsButton: Locator;

  constructor(private readonly page: Page) {
    this.tableViews = page.getByText('·');
    this.addViewButton = page
      .getByTestId('tooltip')
      .filter({ hasText: /^Tambah tampilan$/ });
    this.viewIconSelect = page.getByLabel('Click to select icon (');
    this.viewTypeSelect = page.locator(
      "//span[contains(., 'Tipe tampilan')]/../div",
    );
    this.createViewButton = page.getByRole('button', { name: 'Buat' });
    this.deleteViewButton = page.getByRole('button', { name: 'Hapus' });
    this.filterButton = page.getByText('Filter');
    this.searchFieldInput = page.getByPlaceholder('Cari field');
    this.advancedFilterButton = page
      .getByTestId('tooltip')
      .filter({ hasText: /^Filter lanjutan$/ });
    this.addFilterButton = page.getByRole('button', { name: 'Tambah Filter' });
    this.resetFilterButton = page.getByTestId('cancel-button');
    this.saveFilterAsViewButton = page.getByRole('button', {
      name: 'Simpan sebagai tampilan baru',
    });
    this.sortButton = page.getByText('Urutkan');
    this.sortOrderButton = page.locator('//li');
    this.optionsButton = page.getByText('Opsi');
    this.fieldsButton = page.getByText('Field');
    this.goBackButton = page.getByTestId('dropdown-menu-header-end-icon');
    this.hiddenFieldsButton = page
      .getByTestId('tooltip')
      .filter({ hasText: /^Field Tersembunyi$/ });
    this.editFieldsButton = page
      .getByTestId('tooltip')
      .filter({ hasText: /^Ubah Field$/ });
    this.importButton = page
      .getByTestId('tooltip')
      .filter({ hasText: /^Impor$/ });
    this.deletedRecordsButton = page
      .getByTestId('tooltip')
      .filter({ hasText: /^Terhapus */ });
    this.createNewRecordButton = page.getByTestId('add-button');
    this.addToFavoritesButton = page.getByText('Tambah ke favorit');
    this.deleteFromFavoritesButton = page.getByText('Hapus dari favorit');
    this.deleteRecordsButton = page.getByText('Hapus');
  }

  async clickTableViews() {
    await this.tableViews.click();
  }

  async clickAddViewButton() {
    await this.addViewButton.click();
  }

  async typeViewName(name: string) {
    await this.viewNameInput.clear();
    await this.viewNameInput.fill(name);
  }

  // name can be either be 'Table' or 'Kanban'
  async selectViewType(name: string) {
    await this.viewTypeSelect.click();
    await this.page.getByTestId('tooltip').filter({ hasText: name }).click();
  }

  async createView() {
    await this.createViewButton.click();
  }

  async deleteView() {
    await this.deleteViewButton.click();
  }

  async clickFilterButton() {
    await this.filterButton.click();
  }

  async searchFields(name: string) {
    await this.searchFieldInput.clear();
    await this.searchFieldInput.fill(name);
  }

  async clickAdvancedFilterButton() {
    await this.advancedFilterButton.click();
  }

  async addFilter() {
    await this.addFilterButton.click();
  }

  async resetFilter() {
    await this.resetFilterButton.click();
  }

  async saveFilterAsView() {
    await this.saveFilterAsViewButton.click();
  }

  async clickSortButton() {
    await this.sortButton.click();
  }

  //can be Ascending or Descending
  async setSortOrder(name: string) {
    await this.sortOrderButton.click();
    await this.page.getByTestId('tooltip').filter({ hasText: name }).click();
  }

  async clickOptionsButton() {
    await this.optionsButton.click();
  }

  async clickFieldsButton() {
    await this.fieldsButton.click();
  }

  async clickBackButton() {
    await this.goBackButton.click();
  }

  async clickHiddenFieldsButton() {
    await this.hiddenFieldsButton.click();
  }

  async clickEditFieldsButton() {
    await this.editFieldsButton.click();
  }

  async clickImportButton() {
    await this.importButton.click();
  }

  async clickDeletedRecordsButton() {
    await this.deletedRecordsButton.click();
  }

  async clickCreateNewRecordButton() {
    await this.createNewRecordButton.click();
  }

  async clickAddToFavoritesButton() {
    await this.addToFavoritesButton.click();
  }

  async clickDeleteFromFavoritesButton() {
    await this.deleteFromFavoritesButton.click();
  }

  async clickExportBottomBarButton() {
    await this.exportBottomBarButton.click();
  }

  async clickDeleteRecordsButton() {
    await this.deleteRecordsButton.click();
  }
}
