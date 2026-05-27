import { Locator, Page } from '@playwright/test';

export class ConfirmationModal {
  private readonly input: Locator;
  private readonly cancelButton: Locator;
  private readonly confirmButton: Locator;

  constructor(private readonly page: Page) {
    this.input = page.getByTestId('confirmation-modal-input');
    this.cancelButton = page.getByRole('button', { name: 'Batal' });
    this.confirmButton = page.getByTestId('confirmation-modal-confirm-button');
  }

  async typePlaceholderToInput() {
    await this.page
      .getByTestId('confirmation-modal-input')
      .fill(
        await this.page
          .getByTestId('confirmation-modal-input')
          .getAttribute('placeholder'),
      );
  }

  async typePhraseToInput(value: string) {
    await this.page.getByTestId('confirmation-modal-input').fill(value);
  }

  async clickCancelButton() {
    await this.page.getByRole('button', { name: 'Batal' }).click();
  }

  async clickConfirmButton() {
    await this.page.getByTestId('confirmation-modal-confirm-button').click();
  }
}
