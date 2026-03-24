import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';

// ThemeToggle uses next-themes so we wrap with ThemeProvider
const withTheme = (Story: React.ComponentType) => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <div className="p-4">
      <Story />
    </div>
  </ThemeProvider>
);

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [withTheme],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="dark p-4 rounded-lg bg-gray-900">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
