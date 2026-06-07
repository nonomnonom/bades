import { type BLOCK_SCHEMA } from '@/blocknote-editor/blocks/Schema';
import { CustomAddBlockItem } from '@/blocknote-editor/components/CustomAddBlockItem';
import { CustomSideMenuOptions } from '@/blocknote-editor/components/CustomSideMenuOptions';
import {
  BlockColorsItem,
  DragHandleButton,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
} from '@blocknote/react';
import { styled } from '@linaria/react';
import { IconColorSwatch, IconPlus, IconTrash } from 'ui/display';
import { themeCssVariables } from 'ui/theme-constants';

type CustomSideMenuProps = {
  editor: typeof BLOCK_SCHEMA.BlockNoteEditor;
};

const StyledDivToCreateGap = styled.div`
  width: ${themeCssVariables.spacing[2]};
`;

export const CustomSideMenu = ({ editor }: CustomSideMenuProps) => {
  return (
    <SideMenuController
      sideMenu={() => (
        <SideMenu>
          <DragHandleButton
            dragHandleMenu={() => (
              <DragHandleMenu>
                <CustomAddBlockItem editor={editor}>
                  <CustomSideMenuOptions
                    LeftIcon={IconPlus}
                    text={`Tambah Blok`}
                    Variant="normal"
                  />
                </CustomAddBlockItem>
                <BlockColorsItem>
                  <CustomSideMenuOptions
                    LeftIcon={IconColorSwatch}
                    text={`Ubah Warna`}
                    Variant="normal"
                  />
                </BlockColorsItem>
                <RemoveBlockItem>
                  <CustomSideMenuOptions
                    LeftIcon={IconTrash}
                    text={`Hapus`}
                    Variant="danger"
                  />
                </RemoveBlockItem>
              </DragHandleMenu>
            )}
          />
          <StyledDivToCreateGap />
        </SideMenu>
      )}
    />
  );
};
