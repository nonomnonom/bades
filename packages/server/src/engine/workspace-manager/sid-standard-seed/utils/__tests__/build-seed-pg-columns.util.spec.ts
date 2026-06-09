import { FieldMetadataType } from 'shared/types';

import { PENDUDUK_CUSTOM_FIELD_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/constants/custom-fields/penduduk-custom-field-seeds.constant';
import {
  ACTOR_AUDIT_SEED_COLUMNS,
  buildSidStandardSeedColumns,
  expandFieldSeedToPgColumns,
} from 'src/engine/workspace-manager/sid-standard-seed/utils/build-seed-pg-columns.util';

describe('build-seed-pg-columns.util', () => {
  describe('expandFieldSeedToPgColumns', () => {
    it('should decompose FULL_NAME field ke firstName dan lastName columns', () => {
      const columns = expandFieldSeedToPgColumns({
        type: FieldMetadataType.FULL_NAME,
        name: 'namaLengkap',
        label: 'Nama Lengkap',
      });

      expect(columns).toEqual(['namaLengkapFirstName', 'namaLengkapLastName']);
    });

    it('should decompose ADDRESS field ke alamatAddress* columns', () => {
      const alamatField = PENDUDUK_CUSTOM_FIELD_SEEDS.find(
        (field) => field.name === 'alamat',
      );

      expect(alamatField).toBeDefined();

      const columns = expandFieldSeedToPgColumns(alamatField!);

      expect(columns).toEqual([
        'alamatAddressStreet1',
        'alamatAddressStreet2',
        'alamatAddressCity',
        'alamatAddressPostcode',
        'alamatAddressState',
        'alamatAddressCountry',
        'alamatAddressLat',
        'alamatAddressLng',
      ]);
    });

    it('should return flat column name for TEXT field', () => {
      const columns = expandFieldSeedToPgColumns({
        type: FieldMetadataType.TEXT,
        name: 'nik',
        label: 'NIK',
      });

      expect(columns).toEqual(['nik']);
    });
  });

  describe('buildSidStandardSeedColumns', () => {
    it('should build penduduk columns dengan urutan pendidikan sebelum pekerjaan', () => {
      const columns = buildSidStandardSeedColumns({
        fieldSeeds: PENDUDUK_CUSTOM_FIELD_SEEDS,
      });

      const pendidikanIndex = columns.indexOf('pendidikan');
      const pekerjaanIndex = columns.indexOf('pekerjaan');

      expect(pendidikanIndex).toBeGreaterThan(-1);
      expect(pekerjaanIndex).toBeGreaterThan(-1);
      expect(pendidikanIndex).toBeLessThan(pekerjaanIndex);
    });

    it('should include id, name, position, dan actor audit columns', () => {
      const columns = buildSidStandardSeedColumns({
        fieldSeeds: PENDUDUK_CUSTOM_FIELD_SEEDS,
      });

      expect(columns[0]).toBe('id');
      expect(columns[1]).toBe('name');
      expect(columns).toContain('position');
      for (const auditColumn of ACTOR_AUDIT_SEED_COLUMNS) {
        expect(columns).toContain(auditColumn);
      }
    });

    it('should append extra FK columns sebelum position', () => {
      const columns = buildSidStandardSeedColumns({
        fieldSeeds: PENDUDUK_CUSTOM_FIELD_SEEDS.slice(0, 2),
        extraColumns: ['kartuKeluargaId'],
      });

      const kkIndex = columns.indexOf('kartuKeluargaId');
      const positionIndex = columns.indexOf('position');

      expect(kkIndex).toBeGreaterThan(-1);
      expect(kkIndex).toBeLessThan(positionIndex);
    });
  });
});
