import {
  type Shortcut,
  ShortcutType,
} from '@/keyboard-shortcut-menu/types/Shortcut';

export const KEYBOARD_SHORTCUTS_TABLE: Shortcut[] = [
  {
    label: 'Geser kanan',
    type: ShortcutType.Table,
    firstHotKey: '→',
    areSimultaneous: true,
  },
  {
    label: 'Geser kiri',
    type: ShortcutType.Table,
    firstHotKey: '←',
    areSimultaneous: true,
  },
  {
    label: 'Bersihkan pilihan',
    type: ShortcutType.Table,
    firstHotKey: 'esc',
    areSimultaneous: true,
  },
];
