import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';
import {
  type CreateStandardPageLayoutWidgetArgs,
} from 'src/engine/workspace-manager/bades-standard-application/utils/page-layout-widget/create-standard-page-layout-widget-flat-metadata.util';

// Bades: dashboard contoh warisan Twenty CRM (opportunity/company widgets)
// dihapus. Seed dashboard akan diisi ulang oleh tim Bades dengan widget
// administrasi desa (Penduduk per Wilayah, Realisasi APBDes, dll) sebagai
// inisiatif terpisah pada layer dev-seeder/metadata/custom-objects.
export const computeMyFirstDashboardWidgets = (
  _args: Omit<CreateStandardPageLayoutWidgetArgs, 'context'>,
): FlatPageLayoutWidget[] => {
  return [];
};
