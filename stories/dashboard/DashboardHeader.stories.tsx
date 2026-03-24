import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import type { LinkPage } from '@/lib/types';

const mockPage: LinkPage = {
  id: '1',
  user_id: 'user-1',
  title: 'My Linktree',
  slug: 'my-linktree',
  bio: 'Welcome to my links!',
  avatar_url: null,
  theme_id: null,
};

const meta = {
  title: 'Dashboard/DashboardHeader',
  component: DashboardHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    showCreatePage: { control: 'boolean' },
    activePage: { control: 'object' },
  },
  args: {
    onShowSidebar: fn(),
    onShowPreview: fn(),
  },
} satisfies Meta<typeof DashboardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state: no page selected, shows "My Pages" */
export const NoActivePage: Story = {
  args: {
    showCreatePage: false,
    activePage: null,
  },
};

/** Active page selected: shows slug and external link */
export const WithActivePage: Story = {
  args: {
    showCreatePage: false,
    activePage: mockPage,
  },
};

/** Create new page mode: header title shows "Create New Page" */
export const CreatePageMode: Story = {
  args: {
    showCreatePage: true,
    activePage: null,
  },
};
