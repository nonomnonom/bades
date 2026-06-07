import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
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
        label={`Nama Depan`}
        value={firstName}
        placeholder={`Budi`}
        onChange={(value) => {
          onChange('firstName', value);
        }}
        fullWidth
      />
      <SettingsTextInput
        instanceId={lastNameInstanceId}
        label={`Nama Belakang`}
        value={lastName}
        placeholder={`Santoso`}
        onChange={(value) => {
          onChange('lastName', value);
        }}
        fullWidth
      />
    </>
  );
};
