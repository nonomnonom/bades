import { expect, test } from '../lib/fixtures/screenshot';
test.describe.serial('Create Kanban View', () => {
test('Create Kategori Select Field', async ({ page }) => {
    await page.getByRole('button', { name: 'Pengaturan' }).click();
    await page.getByRole('link', { name: 'Model data' }).click();
    await page.getByRole('link', { name: 'Program Bantuan' }).click();
    await expect(page.getByRole('button', { name: 'Field Baru' })).toBeVisible();
    await page.getByRole('button', { name: 'Field Baru' }).click();
    await page.getByRole('link', { name: 'Select', exact: true }).click();
    await page.getByRole('textbox', { name: 'Nama field' }).click();
    await page.getByRole('textbox', { name: 'Nama field' }).fill('Kategori');
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).press('ControlOrMeta+a');
    await page.getByRole('textbox').nth(1).fill('Pangan');
    await page.getByRole('button', { name: 'Add option' }).click();
    await page.getByRole('button', { name: 'Option 2' }).getByRole('textbox').fill('Pendidikan');
    await page.getByRole('button', { name: 'Add option' }).click();
    await page.getByRole('button', { name: 'Option 3' }).getByRole('textbox').fill('Kesehatan');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL('**/objects/programBantuans');
    await page.waitForSelector('text=Kategori');
    await expect(page.getByText('Kategori')).toBeVisible();
});

test('Create Kanban View from Kategori Select Field', async ({ page }) => {
  await page.getByRole('link', { name: 'Program Bantuan' }).click();
  await page.getByRole('button', { name: /Semua Program Bantuan/ }).click();
  await page.getByText('Tambah tampilan').click();
  await page.getByRole('textbox').press('ControlOrMeta+a');
  await page.getByRole('textbox').fill('Per kategori');
  await page.getByRole('button', { name: 'Tabel', exact: true }).click();
  await page.getByText('Kanban').click();
  await page.locator('[aria-controls="view-picker-kanban-field-options"]').click();
  await page.getByRole('option', { name: 'Kategori' }).click();
  await page.getByRole('button', { name: 'Buat tampilan baru' }).click();
  await expect(page.getByText('Pangan')).toBeVisible({ timeout: 30000 });
  await expect(page.getByText('Pendidikan')).toBeVisible();
  await expect(page.getByText('Kesehatan')).toBeVisible();
  await expect(page.getByText('Belum ada nilai')).toBeVisible();
  const perKategoriElements = await page.locator('text=Per kategori').all();
  expect(perKategoriElements.length).toBeGreaterThanOrEqual(1);
  for (const element of perKategoriElements) {
    await expect(element).toBeVisible();
  }
  await page.getByText('Opsi').click();
  await page.getByText('Grup', { exact: true }).click();
  await Promise.all([page.getByTestId('hide-group-').click(),
    page.waitForRequest((req) => {
    return req.url().includes('/metadata') &&
           req.method() === 'POST';
  })]);
  await expect(page.getByText('Belum ada nilai')).not.toBeVisible();
});
})
