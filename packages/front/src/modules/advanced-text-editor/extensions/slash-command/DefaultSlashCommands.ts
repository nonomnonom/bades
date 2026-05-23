import { msg } from '~/utils/i18n/badesI18n';
import { type Editor, type Range } from '@tiptap/core';
import {
  type IconComponent,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconPilcrow,
} from 'ui/display';

export type SlashCommandConfig = {
  id: string;
  title: string;
  description: string;
  icon: IconComponent;
  keywords: string[];
  getIsActive: (editor: Editor) => boolean;
  getIsVisible: (editor: Editor) => boolean;
  getOnSelect: (editor: Editor, range: Range) => () => void;
};

export const DEFAULT_SLASH_COMMANDS: SlashCommandConfig[] = [
  {
    id: 'paragraph',
    title: msg`Teks`,
    description: msg`Paragraf teks biasa`,
    icon: IconPilcrow,
    keywords: [msg`paragraf`, msg`teks`, msg`p`],
    getIsActive: (editor) => editor.isActive('paragraph'),
    getIsVisible: (editor) => editor.can().setParagraph?.() ?? false,
    getOnSelect: (editor, range) => () => {
      return editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    id: 'h1',
    title: msg`Judul 1`,
    description: msg`Judul bagian besar`,
    icon: IconH1,
    keywords: [msg`judul`, msg`h1`, msg`title`],
    getIsActive: (editor) => editor.isActive('heading', { level: 1 }),
    getIsVisible: (editor) => editor.can().setHeading?.({ level: 1 }) ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run(),
  },
  {
    id: 'h2',
    title: msg`Judul 2`,
    description: msg`Judul bagian sedang`,
    icon: IconH2,
    keywords: [msg`judul`, msg`h2`, msg`subjudul`],
    getIsActive: (editor) => editor.isActive('heading', { level: 2 }),
    getIsVisible: (editor) => editor.can().setHeading?.({ level: 2 }) ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    id: 'h3',
    title: msg`Judul 3`,
    description: msg`Judul bagian kecil`,
    icon: IconH3,
    keywords: [msg`judul`, msg`h3`, msg`subjudul`],
    getIsActive: (editor) => editor.isActive('heading', { level: 3 }),
    getIsVisible: (editor) => editor.can().setHeading?.({ level: 3 }) ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    id: 'bulletList',
    title: msg`Daftar Poin`,
    description: msg`Daftar tak berurutan dengan poin`,
    icon: IconList,
    keywords: [msg`poin`, msg`daftar`, msg`ul`, msg`tak berurutan`],
    getIsActive: (editor) => editor.isActive('bulletList'),
    getIsVisible: (editor) => editor.can().toggleBulletList?.() ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    id: 'orderedList',
    title: msg`Daftar Bernomor`,
    description: msg`Daftar berurutan dengan nomor`,
    icon: IconListNumbers,
    keywords: [msg`bernomor`, msg`daftar`, msg`ol`, msg`nomor`, msg`urutan`],
    getIsActive: (editor) => editor.isActive('orderedList'),
    getIsVisible: (editor) => editor.can().toggleOrderedList?.() ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
];
