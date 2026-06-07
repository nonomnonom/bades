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
  if (inverted) {
    return (
      <Button
        title={`Batal`}
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
      title={`Batal`}
      accent="tertiary"
      onClick={onCancel}
      disabled={disabled}
    />
  );
};
