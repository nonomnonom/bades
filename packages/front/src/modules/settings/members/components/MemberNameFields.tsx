import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { t } from '@lingui/core/macro';

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
        label={""First Name"}
        value={firstName}
        placeholder={""Tim"}
        onChange={(value) => {
          onChange('firstName', value);
        }}
        fullWidth
      />
      <SettingsTextInput
        instanceId={lastNameInstanceId}
        label={"Nama belakang"}
        value={lastName}
        placeholder={""Cook"}
        onChange={(value) => {
          onChange('lastName', value);
        }}
        fullWidth
      />
    </>
  );
};
