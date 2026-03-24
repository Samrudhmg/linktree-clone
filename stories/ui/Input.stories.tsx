import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'url', 'search'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const WithValue: Story = {
  args: { defaultValue: 'Hello, world!' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'Enter email...' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter password...' },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled input', defaultValue: 'Cannot edit' },
};

export const URL: Story = {
  args: { type: 'url', placeholder: 'https://example.com' },
};
