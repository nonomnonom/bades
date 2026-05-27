import { randomUUID } from 'crypto';
import { expect, test } from './fixture';

test('Sign up with invite link via email', async ({
  page,
  loginPage,
  leftMenu,
  membersSection,
  settingsPage,
  profileSection,
  confirmationModal,
}) => {
  const email = `test${randomUUID().replaceAll('-', '')}@bades.id`;
  const firstName = 'Budi';
  const lastName = 'Santoso';

  const inviteLink: string =
    await test.step('Go to Settings and copy invite link', async () => {
      await page.goto(process.env.LINK); // skip login page (and redirect) when running on environments with multi-workspace enabled
      await leftMenu.goToSettings();
      await settingsPage.goToMembersSection();
      await membersSection.copyInviteLink();
      return await page.evaluate('navigator.clipboard.readText()');
    });

  await test.step('Go to invite link', async () => {
    await settingsPage.logout();

    await Promise.all([
      expect(page.getByText(/Join .+ team/)).toBeVisible(),

      page.goto(inviteLink),
    ]);
  });

  await test.step('Create new account', async () => {
    await loginPage.clickLoginWithEmailIfVisible();
    await loginPage.typeEmail(email);
    await loginPage.clickContinueButton();
    await loginPage.typePassword(process.env.DEFAULT_PASSWORD);
    await loginPage.clickSignUpButton();
    await loginPage.typeFirstName(firstName);
    await loginPage.typeLastName(lastName);
    await loginPage.clickContinueButton();
  });

  await test.step('Delete account from workspace', async () => {
    await expect(page.getByRole('button', { name: 'Pengaturan' })).toBeVisible();
    await leftMenu.goToSettings();
    await settingsPage.goToProfileSection();
    await profileSection.deleteAccount();
    await expect(page.getByText('Hapus Akun')).toBeVisible();
    await confirmationModal.typePlaceholderToInput();
    await confirmationModal.clickConfirmButton();

    await page.waitForURL('**/welcome');
  });
});
