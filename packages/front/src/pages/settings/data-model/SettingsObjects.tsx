import { isDDLLockedState } from '@/client-config/states/isDDLLockedState';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';

import { SettingsObjectCoverImage } from '@/settings/data-model/objects/components/SettingsObjectCoverImage';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconPlus } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';
import { SettingsObjectTable } from '~/pages/settings/data-model/SettingsObjectTable';

export const SettingsObjects = () => {
  const { t } = useLingui();

  const { objectMetadataItems } = useFilteredObjectMetadataItems();
  const isDDLLocked = useAtomStateValue(isDDLLockedState);

  return (
    <SubMenuTopBarContainer
      title={t`Data model`}
      actionButton={
        isDDLLocked ? (
          <Button
            Icon={IconPlus}
            title={t`Add object`}
            accent="blue"
            size="small"
            disabled
          />
        ) : (
          <UndecoratedLink to={getSettingsPath(SettingsPath.NewObject)}>
            <Button
              Icon={IconPlus}
              title={t`Add object`}
              accent="blue"
              size="small"
            />
          </UndecoratedLink>
        )
      }
      links={[
        {
          children: <Trans>Workspace</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: <Trans>Objects</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <>
          <SettingsObjectCoverImage />
          <Section>
            <H2Title title={t`Existing objects`} />

            <SettingsObjectTable objectMetadataItems={objectMetadataItems} />
          </Section>
        </>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
