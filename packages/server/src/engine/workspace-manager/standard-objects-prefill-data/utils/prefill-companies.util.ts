import { type EntityManager } from 'typeorm';
import { FieldActorSource } from 'shared/types';

export const PEMERINTAH_DESA_ID = 'c776ee49-f608-4a77-8cc8-6fe96ae1e43f';
export const BUMDES_ID = 'f45ee421-8a3e-4aa5-a1cf-7207cc6754e1';
export const PKK_ID = '1f70157c-4ea5-4d81-bc49-e1401abfbb94';
export const POSYANDU_ID = '9d5bcf43-7d38-4e88-82cb-d6d4ce638bf0';
export const KARANG_TARUNA_ID = '06290608-8bf0-4806-99ae-a715a6a93fad';

export const prefillCompanies = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.company`, [
      'id',
      'name',
      'domainNamePrimaryLinkUrl',
      'addressAddressStreet1',
      'addressAddressStreet2',
      'addressAddressCity',
      'addressAddressState',
      'addressAddressPostcode',
      'addressAddressCountry',
      'employees',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'updatedBySource',
      'updatedByWorkspaceMemberId',
      'updatedByName',
    ])
    .orIgnore()
    .values([
      {
        id: PEMERINTAH_DESA_ID,
        name: 'Pemerintah Desa Sukamaju',
        domainNamePrimaryLinkUrl: 'https://sukamaju.desa.id',
        addressAddressStreet1: 'Jalan Raya Desa No. 1',
        addressAddressStreet2: 'RT 01 RW 01',
        addressAddressCity: 'Kecamatan Sukamaju',
        addressAddressState: 'Jawa Barat',
        addressAddressPostcode: '45171',
        addressAddressCountry: 'Indonesia',
        employees: 12,
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: BUMDES_ID,
        name: 'BUMDes Sukamaju Jaya',
        domainNamePrimaryLinkUrl: 'https://bumdes-sukamaju.desa.id',
        addressAddressStreet1: 'Jalan Pasar Desa No. 5',
        addressAddressStreet2: 'Dusun Melati',
        addressAddressCity: 'Kecamatan Sukamaju',
        addressAddressState: 'Jawa Barat',
        addressAddressPostcode: '45171',
        addressAddressCountry: 'Indonesia',
        employees: 8,
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: PKK_ID,
        name: 'PKK Desa Sukamaju',
        domainNamePrimaryLinkUrl: 'https://pkk-sukamaju.desa.id',
        addressAddressStreet1: 'Balai Desa Sukamaju',
        addressAddressStreet2: 'RT 02 RW 01',
        addressAddressCity: 'Kecamatan Sukamaju',
        addressAddressState: 'Jawa Barat',
        addressAddressPostcode: '45171',
        addressAddressCountry: 'Indonesia',
        employees: 15,
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: POSYANDU_ID,
        name: 'Posyandu Kenanga',
        domainNamePrimaryLinkUrl: null,
        addressAddressStreet1: 'Dusun Mawar',
        addressAddressStreet2: 'RT 03 RW 02',
        addressAddressCity: 'Kecamatan Sukamaju',
        addressAddressState: 'Jawa Barat',
        addressAddressPostcode: '45171',
        addressAddressCountry: 'Indonesia',
        employees: 5,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: KARANG_TARUNA_ID,
        name: 'Karang Taruna Sukamaju',
        domainNamePrimaryLinkUrl: 'https://karangtaruna-sukamaju.desa.id',
        addressAddressStreet1: 'Sekretariat RT 04 RW 02',
        addressAddressStreet2: 'Dusun Melati',
        addressAddressCity: 'Kecamatan Sukamaju',
        addressAddressState: 'Jawa Barat',
        addressAddressPostcode: '45171',
        addressAddressCountry: 'Indonesia',
        employees: 20,
        position: 5,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
    ])
    .returning('*')
    .execute();
};
