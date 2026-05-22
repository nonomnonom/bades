import { useLingui } from '~/utils/i18n/badesI18n';
import { Button, LightButton } from 'ui/input';

type CancelButtonProps = {
  onCancel?: () => void;
  disabled?: boolean;
  inverted?: boolean;
};

export const CancelButton = ({
  onCancel,
  disabled = false,
  inverted = false,
}: CancelButtonProps) => {
  const { t } = useLingui();

  if (inverted) {
    return (
      <Button
        title={t`Batal`}
        variant="tertiary"
        accent="default"
        inverted
        size="small"
        onClick={onCancel}
        disabled={disabled}
      />
    );
  }

  return (
    <LightButton
      title={t`Batal`}
      accent="tertiary"
      onClick={onCancel}
      disabled={disabled}
    />
  );
};
