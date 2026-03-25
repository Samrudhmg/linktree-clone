import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LivePreview from '@/components/LivePreview';
import { MOCK_PAGE, MOCK_LINKS, MOCK_THEMES } from './mocks';

const ThemeCollection = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4 text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Default / Light</h3>
          <LivePreview page={MOCK_PAGE} links={MOCK_LINKS} theme={MOCK_THEMES.default} />
        </div>
        <div className="space-y-4 text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Premium Dark</h3>
          <LivePreview page={MOCK_PAGE} links={MOCK_LINKS} theme={MOCK_THEMES.dark} />
        </div>
        <div className="space-y-4 text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Soft Pastel</h3>
          <LivePreview page={MOCK_PAGE} links={MOCK_LINKS} theme={MOCK_THEMES.pastel} />
        </div>
        <div className="space-y-4 text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">High Contrast</h3>
          <LivePreview page={MOCK_PAGE} links={MOCK_LINKS} theme={MOCK_THEMES.highContrast} />
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Product/ThemePreview',
  component: ThemeCollection,
} satisfies Meta<typeof ThemeCollection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
