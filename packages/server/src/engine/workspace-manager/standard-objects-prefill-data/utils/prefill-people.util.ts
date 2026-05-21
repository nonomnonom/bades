import { FieldActorSource } from 'shared/types';
import { type EntityManager } from 'typeorm';

import {
  PEMERINTAH_DESA_ID,
  BUMDES_ID,
  PKK_ID,
  POSYANDU_ID,
  KARANG_TARUNA_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-companies.util';

export const KEPALA_DESA_ID = 'a2e78a5e-338b-46df-8811-fa08c7d19d35';
export const SEKRETARIS_DESA_ID = '93c72d2e-e65c-44c4-99ad-f87f50349dcf';
export const KETUA_BUMDES_ID = 'edf6d445-13a7-4373-9a47-8f89e8c0a877';
export const KETUA_PKK_ID = 'b1e26fa6-c757-4c88-abfa-4b11f5cf3acf';
export const KADER_POSYANDU_ID = '7a93d1e5-3f74-4945-8a65-d7f996083f72';

export const prefillPeople = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.person`, [
      'id',
      'nameFirstName',
      'nameLastName',
      'city',
      'emailsPrimaryEmail',
      'avatarUrl',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'updatedBySource',
      'updatedByWorkspaceMemberId',
      'updatedByName',
      'phonesPrimaryPhoneNumber',
      'phonesPrimaryPhoneCallingCode',
      'companyId',
    ])
    .orIgnore()
    .values([
      {
        id: KEPALA_DESA_ID,
        nameFirstName: 'Ahmad',
        nameLastName: 'Supriyadi',
        city: 'Sukamaju',
        emailsPrimaryEmail: 'kades@sukamaju.desa.id',
        avatarUrl:
          'https://twentyhq.github.io/placeholder-images/founders/brian-chesky.jpg',
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '81234567890',
        phonesPrimaryPhoneCallingCode: '+62',
        companyId: PEMERINTAH_DESA_ID,
      },
      {
        id: SEKRETARIS_DESA_ID,
        nameFirstName: 'Siti',
        nameLastName: 'Nurhalimah',
        city: 'Sukamaju',
        emailsPrimaryEmail: 'sekdes@sukamaju.desa.id',
        avatarUrl:
          'https://twentyhq.github.io/placeholder-images/founders/dario-amodei.jpg',
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '81234567891',
        phonesPrimaryPhoneCallingCode: '+62',
        companyId: PEMERINTAH_DESA_ID,
      },
      {
        id: KETUA_BUMDES_ID,
        nameFirstName: 'Bambang',
        nameLastName: 'Wijaya',
        city: 'Sukamaju',
        emailsPrimaryEmail: 'bambang@bumdes-sukamaju.desa.id',
        avatarUrl:
          'https://twentyhq.github.io/placeholder-images/founders/patrick-collison.jpg',
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '81234567892',
        phonesPrimaryPhoneCallingCode: '+62',
        companyId: BUMDES_ID,
      },
      {
        id: KETUA_PKK_ID,
        nameFirstName: 'Dewi',
        nameLastName: 'Sartika',
        city: 'Sukamaju',
        emailsPrimaryEmail: 'pkk@sukamaju.desa.id',
        avatarUrl:
          'https://twentyhq.github.io/placeholder-images/founders/dylan-field.jpg',
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '81234567893',
        phonesPrimaryPhoneCallingCode: '+62',
        companyId: PKK_ID,
      },
      {
        id: KADER_POSYANDU_ID,
        nameFirstName: 'Fitriani',
        nameLastName: 'Kusuma',
        city: 'Sukamaju',
        emailsPrimaryEmail: 'posyandu@sukamaju.desa.id',
        avatarUrl:
          'https://twentyhq.github.io/placeholder-images/founders/ivan-zhao.jpg',
        position: 5,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '81234567894',
        phonesPrimaryPhoneCallingCode: '+62',
        companyId: POSYANDU_ID,
      },
    ])
    .returning('*')
    .execute();
};
