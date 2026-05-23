import { t } from '~/utils/i18n/badesI18n';
import { CurrentApplicationContext } from '@/applications/contexts/CurrentApplicationContext';
import { useResolvedApplicationDescription } from '@/applications/hooks/useResolvedApplicationDescription';
import { isBadesStandardApplication } from '@/applications/utils/isBadesStandardApplication';
import { isWorkspaceCustomApplication } from '@/applications/utils/isWorkspaceCustomApplication';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useUpgradeApplication } from '@/marketplace/hooks/useUpgradeApplication';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useHasPermissionFlag } from '@/settings/roles/hooks/useHasPermissionFlag';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import type { SingleTabProps } from '@/ui/layout/tab-list/types/SingleTabProps';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useMutation, useQuery } from '@apollo/client/react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { type Manifest } from 'shared/application';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import {
  IconApps,
  IconBox,
  IconCommand,
  IconGraph,
  IconInfoCircle,
  IconLego,
  IconListDetails,
  IconLock,
  IconSettings,
} from 'ui/display';
import {
  ApplicationRegistrationSourceType,
  FindMarketplaceAppDetailDocument,
  FindOneApplicationDocument,
  PermissionFlagType,
  UninstallApplicationDocument,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { SettingsApplicationDetailTitle } from '~/pages/settings/applications/components/SettingsApplicationDetailTitle';
import { CUSTOM_APPLICATION_ILLUSTRATIONS } from '~/pages/settings/applications/constants/CustomApplicationIllustrations';
import { STANDARD_APPLICATION_ILLUSTRATIONS } from '~/pages/settings/applications/constants/StandardApplicationIllustrations';
import { useFindApplicationConnectionProviders } from '~/pages/settings/applications/hooks/useFindApplicationConnectionProviders';
import { SettingsApplicationCustomTab } from '~/pages/settings/applications/tabs/SettingsApplicationCustomTab';
import { SettingsApplicationDetailAboutTab } from '~/pages/settings/applications/tabs/SettingsApplicationDetailAboutTab';
import { SettingsApplicationDetailContentTab } from '~/pages/settings/applications/tabs/SettingsApplicationDetailContentTab';
import { SettingsApplicationDetailSettingsTab } from '~/pages/settings/applications/tabs/SettingsApplicationDetailSettingsTab';
import { SettingsApplicationPermissionsTab } from '~/pages/settings/applications/tabs/SettingsApplicationPermissionsTab';
import { isNewerSemver } from '~/pages/settings/applications/utils/isNewerSemver';

const APPLICATION_DETAIL_ID = 'application-detail-id';

export const SettingsApplicationDetails = () => {
  const { applicationId = '' } = useParams<{ applicationId: string }>();

  const activeTabId = useAtomComponentStateValue(
    activeTabIdComponentState,
    APPLICATION_DETAIL_ID,
  );

  const { data } = useQuery(FindOneApplicationDocument, {
    variables: { id: applicationId },
    skip: !applicationId,
  });

  const application = data?.findOneApplication;

  const { connectionProviders } =
    useFindApplicationConnectionProviders(applicationId);

  const { data: detailData } = useQuery(FindMarketplaceAppDetailDocument, {
    variables: { universalIdentifier: application?.universalIdentifier ?? '' },
    skip: !application?.universalIdentifier,
  });

  const detail = detailData?.findMarketplaceAppDetail;
  const manifest = detail?.manifest as Manifest | undefined;
  const app = manifest?.application;
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const isStandardApplication = isBadesStandardApplication(application);
  const isCustomApplication = isWorkspaceCustomApplication(
    application,
    currentWorkspace,
  );

  const resolvedDescription = useResolvedApplicationDescription(application);

  const displayName =
    app?.displayName ?? application?.name ?? t`Detail aplikasi`;
  const description = app?.description ?? resolvedDescription;

  const getScreenshots = () => {
    if (app?.screenshots?.length) return app.screenshots;
    if (isStandardApplication) return STANDARD_APPLICATION_ILLUSTRATIONS;
    if (isCustomApplication) return CUSTOM_APPLICATION_ILLUSTRATIONS;
    return undefined;
  };

  const screenshots = getScreenshots();

  const settingsCustomTabFrontComponentId =
    application?.settingsCustomTabFrontComponentId;

  const { upgrade, isUpgrading } = useUpgradeApplication();

  const canInstallMarketplaceApps = useHasPermissionFlag(
    PermissionFlagType.MARKETPLACE_APPS,
  );

  const sourceType = application?.applicationRegistration?.sourceType;
  const isNpmApp = sourceType === ApplicationRegistrationSourceType.NPM;
  const registrationId = detail?.id ?? application?.applicationRegistration?.id;
  const currentVersion = application?.version;
  const latestAvailableVersion =
    detail?.latestAvailableVersion ??
    application?.applicationRegistration?.latestAvailableVersion;

  const hasUpdate =
    isNpmApp &&
    isDefined(latestAvailableVersion) &&
    isDefined(currentVersion) &&
    isNewerSemver(latestAvailableVersion, currentVersion);

  const handleUpgrade = async () => {
    if (!isDefined(registrationId) || !isDefined(latestAvailableVersion)) {
      return;
    }

    await upgrade({
      appRegistrationId: registrationId,
      targetVersion: latestAvailableVersion,
    });
  };

  const [uninstallApplication] = useMutation(UninstallApplicationDocument);
  const [isUninstalling, setIsUninstalling] = useState(false);
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const navigate = useNavigateSettings();

  const handleUninstall = async () => {
    if (!isDefined(application)) return;

    setIsUninstalling(true);
    try {
      await uninstallApplication({
        variables: { universalIdentifier: application.universalIdentifier },
      });
      enqueueSuccessSnackBar({
        message: t`Aplikasi berhasil dihapus.`,
      });
      navigate(SettingsPath.Applications);
    } catch {
      enqueueErrorSnackBar({ message: t`Gagal menghapus aplikasi.` });
    } finally {
      setIsUninstalling(false);
    }
  };

  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);

  const applicationObjectIds = useMemo(
    () => new Set((application?.objects ?? []).map((obj) => obj.id)),
    [application?.objects],
  );

  const appFieldExtensionsCount = useMemo(() => {
    if (!isDefined(application)) return 0;

    return objectMetadataItems
      .filter((item) => !applicationObjectIds.has(item.id))
      .reduce(
        (total, item) =>
          total +
          item.fields.filter((field) => field.applicationId === application.id)
            .length,
        0,
      );
  }, [objectMetadataItems, applicationObjectIds, application]);

  const contentEntries = [
    {
      icon: IconBox,
      count: (application?.objects ?? []).length,
      one: t`objek`,
      many: t`objek`,
    },
    {
      icon: IconListDetails,
      count: appFieldExtensionsCount,
      one: t`field`,
      many: t`field`,
    },
    {
      icon: IconCommand,
      count: (application?.logicFunctions ?? []).length,
      one: t`fungsi logika`,
      many: t`fungsi logika`,
    },
    {
      icon: IconGraph,
      count: (application?.frontComponents ?? []).length,
      one: t`komponen tampilan`,
      many: t`komponen tampilan`,
    },
    {
      icon: IconLego,
      count: (application?.agents ?? []).length,
      one: t`agen`,
      many: t`agen`,
    },
  ];

  const tabs: SingleTabProps[] = [
    { id: 'about', title: t`Tentang`, Icon: IconInfoCircle },
    { id: 'content', title: t`Konten`, Icon: IconBox },
    {
      id: 'permissions',
      title: t`Izin`,
      Icon: IconLock,
      tooltipContent: !isDefined(application?.defaultRoleId)
        ? t`Tidak ada izin yang didefinisikan untuk aplikasi ini`
        : undefined,
      disabled: !isDefined(application?.defaultRoleId),
    },
    (() => {
      const hasVariables = (application?.applicationVariables ?? []).length > 0;
      const hasConnectionProviders = connectionProviders.length > 0;
      const hasNothingToConfigure = !hasVariables && !hasConnectionProviders;

      return {
        id: 'settings',
        title: t`Pengaturan`,
        Icon: IconSettings,
        tooltipContent: hasNothingToConfigure
          ? t`Tidak ada yang perlu dikonfigurasi untuk aplikasi ini`
          : undefined,
        disabled: hasNothingToConfigure,
      };
    })(),
    ...(isDefined(settingsCustomTabFrontComponentId)
      ? [{ id: 'custom', title: t`Kustom`, Icon: IconApps }]
      : []),
  ];

  const renderActiveTabContent = () => {
    if (!isDefined(application)) {
      return <SettingsSectionSkeletonLoader />;
    }

    switch (activeTabId) {
      case 'about':
        return (
          <SettingsApplicationDetailAboutTab
            displayName={displayName}
            description={description}
            aboutDescription={app?.aboutDescription}
            screenshots={screenshots}
            author={app?.author}
            category={app?.category}
            contentEntries={contentEntries}
            currentVersion={currentVersion ?? undefined}
            latestAvailableVersion={latestAvailableVersion ?? undefined}
            developerLinks={
              isDefined(app)
                ? {
                    websiteUrl: app.websiteUrl,
                    termsUrl: app.termsUrl,
                    emailSupport: app.emailSupport,
                    issueReportUrl: app.issueReportUrl,
                  }
                : undefined
            }
            isInstalled={true}
            canInstallMarketplaceApps={canInstallMarketplaceApps}
            hasUpdate={hasUpdate}
            onUpgrade={handleUpgrade}
            isUpgrading={isUpgrading}
            canBeUninstalled={application.canBeUninstalled}
            onUninstall={handleUninstall}
            isUninstalling={isUninstalling}
          />
        );
      case 'content':
        return (
          <SettingsApplicationDetailContentTab
            applicationId={application.id}
            installedApplication={application}
            manifestContent={manifest}
            applicationInfo={{
              id: application.id,
              name: displayName,
              logo: application.logo,
              universalIdentifier: application.universalIdentifier,
            }}
          />
        );
      case 'permissions':
        return (
          <SettingsApplicationPermissionsTab
            defaultRoleId={application.defaultRoleId}
          />
        );
      case 'settings':
        return (
          <SettingsApplicationDetailSettingsTab application={application} />
        );
      case 'custom':
        return isDefined(settingsCustomTabFrontComponentId) ? (
          <SettingsApplicationCustomTab
            settingsCustomTabFrontComponentId={
              settingsCustomTabFrontComponentId
            }
          />
        ) : (
          <></>
        );
      default:
        return <></>;
    }
  };

  return (
    <CurrentApplicationContext.Provider value={application?.id ?? null}>
      <SubMenuTopBarContainer
        title={
          <SettingsApplicationDetailTitle
            displayName={displayName}
            description={description}
            applicationId={application?.id}
          />
        }
        links={[
          {
            children: t`Ruang Kerja`,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          {
            children: t`Aplikasi`,
            href: getSettingsPath(SettingsPath.Applications),
          },
          { children: displayName },
        ]}
      >
        <SettingsPageContainer>
          <TabList tabs={tabs} componentInstanceId={APPLICATION_DETAIL_ID} />
          {renderActiveTabContent()}
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    </CurrentApplicationContext.Provider>
  );
};
