import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A short description of this card&apos;s content and purpose.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the card body area. Any content can go here — text, forms, images, etc.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Minimal: Story = {
  render: () => (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm">Minimal card with only content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithHeaderOnly: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Header Only Card</CardTitle>
        <CardDescription>No content or footer section.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ActionCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          This action is permanent and cannot be undone. All your data will be removed.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" className="w-full">Delete Account</Button>
      </CardFooter>
    </Card>
  ),
};
