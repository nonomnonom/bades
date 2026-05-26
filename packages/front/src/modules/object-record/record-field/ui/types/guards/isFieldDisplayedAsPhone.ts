import { CoreObjectNameSingular } from 'shared/types';
import { FieldMetadataType } from '~/generated-metadata/graphql';

import { type FieldDefinition } from '@/object-record/record-field/ui/types/FieldDefinition';
import {
  type FieldMetadata,
  type FieldTextMetadata,
} from '@/object-record/record-field/ui/types/FieldMetadata';

// TODO: temporary - remove when phone field handling is migrated to Bades SID
// SID schema tidak memiliki field telepon dalam format khusus;
// logika lama hanya berlaku untuk objek Person CRM warisan.
export const isFieldDisplayedAsPhone = (
  field: Pick<FieldDefinition<FieldMetadata>, 'type' | 'metadata'>,
): field is FieldDefinition<FieldTextMetadata> => false;
