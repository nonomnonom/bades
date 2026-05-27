import { Locator, Page } from '@playwright/test';

export class SecuritySection {
  private readonly googleToggle: Locator;
  private readonly microsoftToggle: Locator;
  private readonly passwordToggle: Locator;
  private readonly inviteByLinkToggle: Locator;

  constructor(public readonly page: Page) {
    this.googleToggle = page.getByLabel('Google');
    this.microsoftToggle = page.getByLabel('Microsoft');
    this.passwordToggle = page.getByLabel('Kata sandi');
    this.inviteByLinkToggle = page.getByLabel('Undang lewat Tautan');
  }

  async toggleGoogle() {
    await this.googleToggle.click();
  }

  async toggleMicrosoft() {
    await this.microsoftToggle.click();
  }

  async togglePassword() {
    await this.passwordToggle.click();
  }

  async toggleInviteByLink() {
    await this.inviteByLinkToggle.click();
  }
}
