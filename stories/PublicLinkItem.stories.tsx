import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PublicLinkItem from '@/components/PublicLinkItem';
import { MOCK_LINKS, MOCK_THEMES } from './mocks';

const meta = {
  title: 'Product/PublicLinkItem',
  component: PublicLinkItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    link: { control: 'object' },
    theme: { control: 'object' },
  },
} satisfies Meta<typeof PublicLinkItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Content States ---

export const Default: Story = {
  args: {
    link: MOCK_LINKS[0],
    theme: MOCK_THEMES.dark,
  },
};

export const WithoutSubtext: Story = {
  args: {
    link: MOCK_LINKS[2],
    theme: MOCK_THEMES.dark,
  },
};

// --- Theme Styles ---

export const StyleFlat: Story = {
  args: {
    link: MOCK_LINKS[0],
    theme: MOCK_THEMES.dark,
  },
};

export const StyleOutline: Story = {
  args: {
    link: MOCK_LINKS[0],
    theme: MOCK_THEMES.highContrast,
  },
};

export const StyleGlass: Story = {
  args: {
    link: MOCK_LINKS[0],
    theme: {
      ...MOCK_THEMES.dark,
      config: {
        ...MOCK_THEMES.dark.config,
        links: { ...MOCK_THEMES.dark.config.links, style: 'glass' }
      }
    },
  },
  decorators: [
    (Story) => (
      <div className="p-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl">
        <Story />
      </div>
    ),
  ],
};

export const StyleWhite: Story = {
  args: {
    link: MOCK_LINKS[0],
    theme: MOCK_THEMES.pastel,
  },
};
