import { NumberFormat } from '@/localization/constants/NumberFormat';
import { detectNumberFormat } from '@/localization/utils/detection/detectNumberFormat';
import { Select } from '@/ui/input/components/Select';
import { useLingui } from '@lingui/react/macro';
import { formatNumber as utilFormatNumber } from '~/utils/format/formatNumber';

type NumberFormatSelectProps = {
  value: NumberFormat;
  onChange: (nextValue: NumberFormat) => void;
};

export const NumberFormatSelect = ({
  onChange,
  value,
}: NumberFormatSelectProps) => {
  const { t } = useLingui();

  const systemNumberFormat = NumberFormat[detectNumberFormat()];

  const systemNumberFormatLabel = utilFormatNumber(1234.56, {
    format: systemNumberFormat,
    decimals: 2,
  });
  const commasAndDotExample = utilFormatNumber(1234.56, {
    format: NumberFormat.COMMAS_AND_DOT,
    decimals: 2,
  });
  const spacesAndCommaExample = utilFormatNumber(1234.56, {
    format: NumberFormat.SPACES_AND_COMMA,
    decimals: 2,
  });
  const dotsAndCommaExample = utilFormatNumber(1234.56, {
    format: NumberFormat.DOTS_AND_COMMA,
    decimals: 2,
  });
  const apostropheAndDotExample = utilFormatNumber(1234.56, {
    format: NumberFormat.APOSTROPHE_AND_DOT,
    decimals: 2,
  });

  return (
    <Select
      dropdownId="number-format-select"
      dropdownWidth={218}
      label={t`Format angka`}
      dropdownWidthAuto
      fullWidth
      value={value}
      pinnedOption={{
        label: t`Ikuti sistem`,
        value: NumberFormat.SYSTEM,
        contextualText: systemNumberFormatLabel,
      }}
      options={[
        {
          label: t`Koma dan titik`,
          value: NumberFormat.COMMAS_AND_DOT,
          contextualText: commasAndDotExample,
        },
        {
          label: t`Spasi dan koma`,
          value: NumberFormat.SPACES_AND_COMMA,
          contextualText: spacesAndCommaExample,
        },
        {
          label: t`Titik dan koma`,
          value: NumberFormat.DOTS_AND_COMMA,
          contextualText: dotsAndCommaExample,
        },
        {
          label: t`Apostrof dan titik`,
          value: NumberFormat.APOSTROPHE_AND_DOT,
          contextualText: apostropheAndDotExample,
        },
      ]}
      onChange={onChange}
    />
  );
};
