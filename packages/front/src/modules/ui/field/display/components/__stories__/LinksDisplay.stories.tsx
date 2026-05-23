import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { LinksDisplay } from '@/ui/field/display/components/LinksDisplay';
import { ComponentDecorator } from 'ui/testing';

const meta: Meta<typeof LinksDisplay> = {
  title: 'UI/Display/LinksDisplay',
  component: LinksDisplay,
  decorators: [ComponentDecorator],
  argTypes: {
    value: {
      control: 'object',
      description:
        'The value object containing primaryLinkUrl, primaryLinkLabel, and secondaryLinks',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LinksDisplay>;

export const NoLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: '',
      primaryLinkLabel: '',
      secondaryLinks: [],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.queryByRole('link')).toBeNull();
    });
  },
};

export const NullLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: null,
      primaryLinkLabel: 'Primary Link',
      secondaryLinks: [
        { url: null, label: 'Secondary Link' },
        { url: 'https://www.bades.id', label: 'Valid Link' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(1);
    });

    const validLink = await canvas.findByText('Valid Link');
    expect(validLink).toBeVisible();
    expect(validLink).toHaveAttribute('href', 'https://www.bades.id');

    expect(canvas.queryByText('Primary Link')).not.toBeInTheDocument();
    expect(canvas.queryByText('Secondary Link')).not.toBeInTheDocument();
  },
};

export const SingleLink: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.bades.id',
      primaryLinkLabel: 'Bades.id Website',
      secondaryLinks: null,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = await canvas.findByRole('link');
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', 'https://www.bades.id');
    expect(link).toHaveTextContent('Bades.id Website');

    await waitFor(() => {
      expect(canvas.getAllByRole('link')).toHaveLength(1);
    });
  },
};

export const MultipleLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.bades.id',
      primaryLinkLabel: 'Bades.id Website',
      secondaryLinks: [
        { url: 'https://docs.bades.id', label: 'Dokumentasi' },
        { url: 'https://bades.id/blog', label: 'Blog' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(3);
    });

    const primaryLink = await canvas.findByText('Bades.id Website');
    expect(primaryLink).toBeVisible();
    expect(primaryLink).toHaveAttribute('href', 'https://www.bades.id');

    const docsLink = await canvas.findByText('Dokumentasi');
    expect(docsLink).toBeVisible();
    expect(docsLink).toHaveAttribute('href', 'https://docs.bades.id');

    const blogLink = await canvas.findByText('Blog');
    expect(blogLink).toBeVisible();
    expect(blogLink).toHaveAttribute('href', 'https://bades.id/blog');
  },
};

export const SocialMediaLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.linkedin.com/company/bades',
      primaryLinkLabel: 'Bades.id di LinkedIn',
      secondaryLinks: [
        { url: 'https://twitter.com/badesid', label: 'Bades.id di Twitter' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(2);
    });

    const linkedinLink = await canvas.findByText('bades');
    expect(linkedinLink).toBeVisible();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/bades',
    );

    const twitterLink = await canvas.findByText('@badesid');
    expect(twitterLink).toBeVisible();
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/badesid');
  },
};

export const AutomaticLabelFromURL: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.example.com',
      primaryLinkLabel: '',
      secondaryLinks: [{ url: 'https://test.example.com', label: null }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(2);
    });

    const primaryLink = await canvas.findByText('www.example.com');
    expect(primaryLink).toBeVisible();
    expect(primaryLink).toHaveAttribute('href', 'https://www.example.com');

    const secondaryLink = await canvas.findByText('test.example.com');
    expect(secondaryLink).toBeVisible();
    expect(secondaryLink).toHaveAttribute('href', 'https://test.example.com');
  },
};

export const InvalidLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'wikipedia',
      primaryLinkLabel: 'Invalid URL',
      secondaryLinks: [{ url: 'lydia,com', label: 'Invalid URL with comma' }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.queryByRole('link')).toBeNull();
    });

    expect(canvas.queryByText('Invalid URL')).not.toBeInTheDocument();
    expect(
      canvas.queryByText('Invalid URL with comma'),
    ).not.toBeInTheDocument();
  },
};
