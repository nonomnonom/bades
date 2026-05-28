import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ComponentDecorator } from 'ui/testing';

import { TerminalOutput } from '@/ai/components/TerminalOutput';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';

const meta: Meta<typeof TerminalOutput> = {
  title: 'Modules/AI/TerminalOutput',
  component: TerminalOutput,
  decorators: [SnackBarDecorator, ComponentDecorator],
  parameters: {
    container: { width: 500 },
  },
  args: {
    stdout: '',
    stderr: '',
    isRunning: false,
  },
};

export default meta;
type Story = StoryObj<typeof TerminalOutput>;

export const StdoutOnly: Story = {
  args: {
    stdout: `Memuat data dari database...
Memproses 1.234 rekaman...
Menerapkan transformasi...
Total pendapatan: Rp542.890.000
Rata-rata nilai pesanan: Rp127.500
Ekpor selesai!`,
    stderr: '',
    isRunning: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText(/Total pendapat an/)).toBeVisible();
    expect(await canvas.findByText('stdout')).toBeVisible();
  },
};

export const WithStderr: Story = {
  args: {
    stdout: 'Memulai proses...\nLangkah 1 selesai.',
    stderr:
      'Warning: Deprecated function used at line 15\nError: Waktu tunggu koneksi habis setelah 30 d',
    isRunning: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Should show stdout by default
    expect(await canvas.findByText(/Starting process/)).toBeVisible();

    // Click stderr tab to switch
    const stderrTab = await canvas.findByText('stderr');
    await userEvent.click(stderrTab);

    // Should now show stderr content
    expect(await canvas.findByText(/Waktu tunggu koneksi habis/)).toBeVisible();
  },
};

export const StderrOnlyAutoSwitch: Story = {
  args: {
    stdout: '',
    stderr:
      'FileNotFoundError: [Errno 2] No such file or directory: \'data.csv\'\nTraceback (most recent call last):\n  File "script.py", line 5, in <module>',
    isRunning: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // When only stderr exists and no stdout, should auto-switch to stderr
    expect(await canvas.findByText(/FileNotFoundError/)).toBeVisible();
  },
};

export const Running: Story = {
  args: {
    stdout: 'Initializing...\nConnecting to server...',
    stderr: '',
    isRunning: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText(/Connecting to server/)).toBeVisible();
  },
};

export const RunningEmpty: Story = {
  args: {
    stdout: '',
    stderr: '',
    isRunning: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText('Waiting for output...')).toBeVisible();
  },
};

export const Empty: Story = {
  args: {
    stdout: '',
    stderr: '',
    isRunning: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText('Tidak ada output')).toBeVisible();
  },
};

export const LongOutput: Story = {
  args: {
    stdout: Array.from(
      { length: 100 },
      (_, i) =>
        `[${new Date().toISOString()}] Processing batch ${i + 1}/100...`,
    ).join('\n'),
    stderr: '',
    isRunning: false,
  },
};

export const MultilineFormatted: Story = {
  args: {
    stdout: `╔════════════════════════════════════╗
║       SALES REPORT - Q4 2024       ║
╠════════════════════════════════════╣
║ Region     │ Revenue    │ Growth   ║
╠════════════════════════════════════╣
║ North      │ $125,000   │ +12.5%   ║
║ South      │ $98,500    │ +8.2%    ║
║ East       │ $142,300   │ +15.1%   ║
║ West       │ $89,200    │ +5.7%    ║
╚════════════════════════════════════╝

Total Pendapatan: Rp455.000.000
YoY Growth: +10,4%`,
    stderr: '',
    isRunning: false,
  },
};
