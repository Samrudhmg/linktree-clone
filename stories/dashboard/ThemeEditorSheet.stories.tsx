import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThemeEditorSheet from '@/components/dashboard/ThemeEditorSheet';
import { MOCK_USER_ID, MOCK_THEMES, MOCK_PAGE } from '../mocks';

const meta = {
  title: 'Dashboard/ThemeEditorSheet',
  component: ThemeEditorSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    editingTheme: { control: 'object' },
  },
  // Provide basic wrapper and suppress global next/navigation errors if any
} satisfies Meta<typeof ThemeEditorSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    userId: MOCK_USER_ID,
    editingTheme: null,
    pages: [MOCK_PAGE],
    onOpenChange: (open) => console.log('Open state:', open),
    onSuccess: (theme) => console.log('Theme saved:', theme),
    onPreviewChange: (theme) => console.log('Preview update:', theme),
  },
};

export const EditingTheme: Story = {
  args: {
    open: true,
    userId: MOCK_USER_ID,
    editingTheme: MOCK_THEMES.dark,
    pages: [MOCK_PAGE],
    onOpenChange: (open) => console.log('Open state:', open),
    onSuccess: (theme) => console.log('Theme saved:', theme),
    onPreviewChange: (theme) => console.log('Preview update:', theme),
  },
};

export const HighContrastEditing: Story = {
  args: {
    open: true,
    userId: MOCK_USER_ID,
    editingTheme: MOCK_THEMES.highContrast,
    pages: [MOCK_PAGE],
    onOpenChange: (open) => console.log('Open state:', open),
    onSuccess: (theme) => console.log('Theme saved:', theme),
    onPreviewChange: (theme) => console.log('Preview update:', theme),
  },
};
