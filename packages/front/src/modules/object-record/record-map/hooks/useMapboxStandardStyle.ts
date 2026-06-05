import { MAPBOX_STANDARD_STYLES } from '@/object-record/record-map/constants/recordMapboxStyle.constant';
import { useSystemColorScheme } from '@/ui/theme/hooks/useSystemColorScheme';
import { persistedColorSchemeState } from '@/ui/theme/states/persistedColorSchemeState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useMapboxStandardStyle = (): string => {
  const persistedColorScheme = useAtomStateValue(persistedColorSchemeState);
  const systemColorScheme = useSystemColorScheme();
  const effectiveColorScheme =
    persistedColorScheme === 'System'
      ? systemColorScheme
      : persistedColorScheme;

  return effectiveColorScheme === 'Dark'
    ? MAPBOX_STANDARD_STYLES.dark
    : MAPBOX_STANDARD_STYLES.light;
};
