import { Locator, Page } from '@playwright/test';

export class SettingsPage {
  private readonly exitSettingsLink: Locator;
  private readonly profileLink: Locator;
  private readonly experienceLink: Locator;
  private readonly accountsLink: Locator;
  private readonly emailsLink: Locator;
  private readonly calendarsLink: Locator;
  private readonly generalLink: Locator;
  private readonly membersLink: Locator;
  private readonly rolesLink: Locator;
  private readonly dataModelLink: Locator;
  private readonly integrationsLink: Locator;
  private readonly securityLink: Locator;
  private readonly apisLink: Locator;
  private readonly webhooksLink: Locator;
  private readonly adminPanelLink: Locator;
  private readonly labLink: Locator;
  private readonly releasesLink: Locator;
  private readonly advancedToggle: Locator;

  constructor(public readonly page: Page) {
    this.page = page;
    this.exitSettingsLink = page.getByRole('button', { name: 'Keluar Pengaturan' });
    this.profileLink = page.getByRole('link', { name: 'Profil' });
    this.experienceLink = page.getByRole('link', { name: 'Pengalaman' });
    this.accountsLink = page.getByRole('link', { name: 'Akun' });
    this.emailsLink = page.getByRole('link', { name: 'Email', exact: true });
    this.calendarsLink = page.getByRole('link', { name: 'Kalender' });
    this.generalLink = page.getByRole('link', { name: 'Umum' });
    this.membersLink = page.getByRole('link', { name: 'Anggota' });
    this.rolesLink = page.getByRole('link', { name: 'Peran' });
    this.dataModelLink = page.getByRole('link', { name: 'Model data' });
    this.integrationsLink = page.getByRole('link', { name: 'Integrasi' });
    this.securityLink = page.getByRole('link', { name: 'Keamanan' });
    this.apisLink = page.getByRole('link', { name: 'API' });
    this.webhooksLink = page.getByRole('link', { name: 'Webhook' });
    this.adminPanelLink = page.getByRole('link', { name: 'Panel Admin' });
    this.labLink = page.getByRole('link', { name: 'Lab' });
    this.releasesLink = page.getByRole('link', { name: 'Rilis' });
    this.advancedToggle = page.locator('input[type="checkbox"]').first();
  }

  async leaveSettingsPage() {
    await this.exitSettingsLink.click();
  }

  async goToProfileSection() {
    await this.profileLink.click();
  }

  async goToExperienceSection() {
    await this.experienceLink.click();
  }

  async goToAccountsSection() {
    await this.accountsLink.click();
  }

  async goToEmailsSection() {
    await this.emailsLink.click();
  }

  async goToCalendarsSection() {
    await this.calendarsLink.click();
  }

  async goToGeneralSection() {
    await this.generalLink.click();
  }

  async goToMembersSection() {
    await this.membersLink.click();
  }

  async goToRolesSection() {
    await this.rolesLink.click();
  }

  async goToDataModelSection() {
    await this.dataModelLink.click();
  }

  async goToIntegrationsSection() {
    await this.integrationsLink.click();
  }

  async goToSecuritySection() {
    await this.securityLink.click();
  }

  async goToAPIsSection() {
    await this.apisLink.click();
  }

  async goToWebhooksSection() {
    await this.webhooksLink.click();
  }

  async goToAdminPanelSection() {
    await this.adminPanelLink.click();
  }

  async goToLabSection() {
    await this.labLink.click();
  }

  async goToReleasesIntegration() {
    await this.releasesLink.click();
  }

  async logout() {
    await this.page.getByText('Keluar').click();
  }

  async toggleAdvancedSettings() {
    await this.advancedToggle.click();
  }
}
