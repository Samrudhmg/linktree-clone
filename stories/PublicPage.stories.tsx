import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LivePreview from '@/components/LivePreview';
import { MOCK_PAGE, MOCK_LINKS, MOCK_THEMES } from './mocks';

const meta = {
  title: 'Product/PublicPage',
  component: LivePreview,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    page: { control: 'object' },
    links: { control: 'object' },
    theme: { control: 'object' },
  },
} satisfies Meta<typeof LivePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Page Variations ---

export const Default: Story = {
  args: {
    page: MOCK_PAGE,
    links: MOCK_LINKS,
    theme: MOCK_THEMES.dark,
  },
};

export const LightTheme: Story = {
  args: {
    page: MOCK_PAGE,
    links: MOCK_LINKS,
    theme: MOCK_THEMES.default,
  },
};

export const PastelTheme: Story = {
  args: {
    page: {
        ...MOCK_PAGE,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pastel",
        display_name: "Pastel Vibes",
        bio: "Soft colors for a soft profile. Minimal and clean."
    },
    links: MOCK_LINKS,
    theme: MOCK_THEMES.pastel,
  },
};

export const HighContrast: Story = {
  args: {
    page: MOCK_PAGE,
    links: MOCK_LINKS,
    theme: MOCK_THEMES.highContrast,
  },
};

export const EmptyState: Story = {
    args: {
        page: null,
        links: [],
        theme: null,
    },
};
