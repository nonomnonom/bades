import { StyledDropdownMenuSubheader } from '@/ui/layout/dropdown/components/StyledDropdownMenuSubheader';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useFilteredAvailableWorkspaces } from '@/ui/navigation/navigation-drawer/hooks/useFilteredAvailableWorkspaces';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { availableWorkspacesState } from '@/auth/states/availableWorkspacesState';
import { AvailableWorkspaceItem } from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/internal/components/AvailableWorkspaceItem';

export const WorkspacesForSignIn = ({
  searchValue,
}: {
  searchValue: string;
}) => {
  const availableWorkspaces = useAtomStateValue(availableWorkspacesState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const { searchAvailableWorkspaces } = useFilteredAvailableWorkspaces();

  return (
    <>
      <StyledDropdownMenuSubheader>{`Ruang kerja`}</StyledDropdownMenuSubheader>
      <DropdownMenuItemsContainer>
        {searchAvailableWorkspaces(
          searchValue,
          availableWorkspaces.availableWorkspacesForSignIn,
        ).map((availableWorkspace) => (
          <AvailableWorkspaceItem
            key={availableWorkspace.id}
            availableWorkspace={availableWorkspace}
            isSelected={currentWorkspace?.id === availableWorkspace.id}
          />
        ))}
      </DropdownMenuItemsContainer>
    </>
  );
};
