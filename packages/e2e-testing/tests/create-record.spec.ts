import { expect, test } from '../lib/fixtures/screenshot';
import { backendGraphQLUrl } from '../lib/requests/backend';
import { getAccessAuthToken } from '../lib/utils/getAccessAuthToken';

const query = `query FindOnePenduduk($objectRecordId: UUID!) {
  penduduk(
    filter: {id: {eq: $objectRecordId}}
  ) {
    id
    nama
    nik
    noKk
    tempatLahir
    tanggalLahir
    jenisKelamin
    agama
    statusPerkawinan
    pendidikan
    pekerjaan
    golonganDarah
    kewarganegaraan
    alamat
    noHp
    email
    statusHubunganKeluarga
    tipeWarga
    statusHidup
    updatedAt
  }
}`

test('Buat dan perbarui record Penduduk', async ({ page }) => {
    await page.goto('/objects/penduduks');
    await page.getByRole('button', { name: 'Buat Penduduk baru' }).click();

    // Generate data testing
    const randomNik = `${Math.floor(Math.random() * 1000000000000000 + 9000000000000000)}`;

    // Fill nama lengkap
    const namaInput = page.getByRole('textbox', { name: 'Nama' });
    await expect(namaInput).toBeFocused();
    await namaInput.fill('Budi Santoso');

    // Fill NIK
    const nikInput = page.getByPlaceholder('NIK');
    await expect(nikInput).toBeVisible();
    await nikInput.fill(randomNik);
    await page.keyboard.press('Enter');

    // Focus on recordFieldList
    const recordFieldList = page.getByTestId('record-fields-widget');
    await expect(recordFieldList).toBeVisible();

    // Fill tempat lahir
    const tempatLahirField = recordFieldList.getByText('Tempat Lahir').first();
    await tempatLahirField.click();
    const tempatLahirInput = recordFieldList.getByText('Tempat Lahir').nth(1);
    await expect(tempatLahirInput).toBeVisible();
    await tempatLahirInput.click({ force: true });
    await page.getByPlaceholder('Tempat lahir').fill('Jakarta');
    await page.keyboard.press('Enter');

    // Fill pekerjaan
    const pekerjaanField = recordFieldList.getByText('Pekerjaan').first();
    await pekerjaanField.click();
    const pekerjaanInput = recordFieldList.getByText('Pekerjaan').nth(1);
    await expect(pekerjaanInput).toBeVisible();
    await pekerjaanInput.click({ force: true });
    await page.getByPlaceholder('Pekerjaan').fill('Petani');
    await page.keyboard.press('Enter');

    // Fill alamat
    const alamatField = recordFieldList.getByText('Alamat').first();
    await alamatField.click();
    const alamatInput = recordFieldList.getByText('Alamat').nth(1);
    await expect(alamatInput).toBeVisible();
    await alamatInput.click({ force: true });
    await page.getByPlaceholder('Alamat').fill('Jl. Desa No. 1');
    await page.keyboard.press('Enter');

    // Open full record page to get penduduk ID
    await page.getByRole('button', { name: /^Buka$/ }).click();
    await page.waitForURL(/\/object\/penduduk\//);
    const newPendudukId = page.url().match(/\/object\/penduduk\/([a-f0-9-]+)/)?.[1];

    // Check data was saved via GraphQL
    const { authToken } = await getAccessAuthToken(page);
    const findOnePendudukResponse = await page.request.post(backendGraphQLUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        operationName: 'FindOnePenduduk',
        query,
        variables: {
          objectRecordId: newPendudukId,
        }
      },
    });

    const responseBody = await findOnePendudukResponse.json();

    expect(responseBody.data.penduduk.nama).toBe('Budi Santoso');
    expect(responseBody.data.penduduk.nik).toBe(randomNik);
    expect(responseBody.data.penduduk.tempatLahir).toBe('Jakarta');
    expect(responseBody.data.penduduk.pekerjaan).toBe('Petani');
});
