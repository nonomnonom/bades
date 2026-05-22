import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { t } from '~/utils/i18n/badesI18n';

type MemberNameFieldsProps = {
  memberId: string;
  firstName: string;
  lastName: string;
  onChange: (field: 'firstName' | 'lastName', value: string) => void;
};

export const MemberNameFields = ({
  memberId,
  firstName,
  lastName,
  onChange,
}: MemberNameFieldsProps) => {
  const firstNameInstanceId = `${memberId}-first-name`;
  const lastNameInstanceId = `${memberId}-last-name`;

  return (
    <>
      <SettingsTextInput
        instanceId={firstNameInstanceId}
        label={t`Nama Depan`}
        value={firstName}
        placeholder={t`Budi`}
        onChange={(value) => {
          onChange('firstName', value);
        }}
        fullWidth
      />
      <SettingsTextInput
        instanceId={lastNameInstanceId}
        label={t`Nama Belakang`}
        value={lastName}
        placeholder={t`Santoso`}
        onChange={(value) => {
          onChange('lastName', value);
        }}
        fullWidth
      />
    </>
  );
};
