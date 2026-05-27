import { Locator, Page } from '@playwright/test';

export class ExperienceSection {
  private readonly lightThemeButton: Locator;
  private readonly darkThemeButton: Locator;
  private readonly timezoneDropdown: Locator;
  private readonly dateFormatDropdown: Locator;
  private readonly timeFormatDropdown: Locator;
  private readonly searchInput: Locator;
  private readonly languageDropdown: Locator;

  constructor(private readonly page: Page) {
    this.lightThemeButton = page.locator('div[variant="Light"]').first();
    this.darkThemeButton = page.locator('div[variant="Dark"]').first();
    this.timezoneDropdown = page.locator(
      '//span[contains(., "Zona waktu")]/../div/div/div',
    );
    this.dateFormatDropdown = page.locator(
      '//span[contains(., "Format tanggal")]/../div/div/div',
    );
    this.timeFormatDropdown = page.locator(
      '//span[contains(., "Format waktu")]/../div/div/div',
    );
    this.searchInput = page.getByPlaceholder('Cari');
    this.languageDropdown = page.locator(
      '//h2[contains(., "Bahasa")]/../../../div/div/div',
    );
  }

  async changeThemeToLight() {
    await this.lightThemeButton.click();
  }

  async changeThemeToDark() {
    await this.darkThemeButton.click();
  }

  async selectTimeZone(timezone: string) {
    await this.timezoneDropdown.click();
    await this.page.getByText(timezone, { exact: true }).click();
  }

  async selectTimeZoneWithSearch(timezone: string) {
    await this.timezoneDropdown.click();
    await this.searchInput.fill(timezone);
    await this.page.getByText(timezone, { exact: true }).click();
  }

  async selectDateFormat(dateFormat: string) {
    await this.dateFormatDropdown.click();
    await this.page.getByText(dateFormat, { exact: true }).click();
  }

  async selectTimeFormat(timeFormat: string) {
    await this.timeFormatDropdown.click();
    await this.page.getByText(timeFormat, { exact: true }).click();
  }

  async selectLanguage(language: string) {
    await this.languageDropdown.click();
    await this.page.getByText(language, { exact: true }).click();
  }
}
