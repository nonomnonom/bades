import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { type FlatNavigationMenuItem } from 'src/engine/metadata-modules/flat-navigation-menu-item/types/flat-navigation-menu-item.type';

// Bades: navigation seed "Star History" warisan (link ke
// star-history GitHub repo) dihapus — Bades bukan produk open-source
// dengan star tracker publik. Workspace dev sekarang start dengan nav
// hanya isi standar (Tugas, Catatan, Dasbor) yang sudah ditangani layer
// bades-standard-application.
export const getNavigationMenuItemFlatEntitySeeds = ({
  workspaceId: _workspaceId,
  flatApplication: _flatApplication,
}: {
  workspaceId: string;
  flatApplication: FlatApplication;
}): FlatNavigationMenuItem[] => {
  return [];
};
