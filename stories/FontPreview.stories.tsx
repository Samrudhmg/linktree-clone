import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_PAGE, MOCK_LINKS, MOCK_THEMES } from './mocks';
import LivePreview from '@/components/LivePreview';

const FontGallery = () => {
    const fonts = [
        { name: 'Modern Sans', class: 'font-sans' },
        { name: 'Elegant Serif', class: 'font-serif' },
        { name: 'Mono Tech', class: 'font-mono' },
        { name: 'Premium Display', class: 'font-display' }, // Requires Tailwind setup for font-display
    ];

    return (
        <div className="p-8 space-y-16 bg-white dark:bg-black min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {fonts.map((f) => (
                    <div key={f.name} className="space-y-4 text-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">{f.name}</h3>
                        <div className={f.class}>
                            <LivePreview page={MOCK_PAGE} links={MOCK_LINKS} theme={MOCK_THEMES.dark} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-2xl mx-auto space-y-8 border-t pt-12">
                <h2 className="text-2xl font-bold">Typography Comparison</h2>
                {fonts.map((f) => (
                    <div key={f.name} className={`space-y-2 p-6 rounded-xl border ${f.class} bg-muted/20`}>
                        <p className="text-[10px] uppercase font-bold opacity-50">{f.name}</p>
                        <h1 className="text-3xl font-bold">The quick brown fox</h1>
                        <p className="text-lg opacity-80 italic">Fullstack Developer & UI Enthusiast.</p>
                        <div className="flex gap-4 mt-4 text-sm">
                            <span className="underline">View Portfolio</span>
                            <span className="underline">Twitter Profile</span>
                            <span className="underline">GitHub Code</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const meta = {
  title: 'Product/FontPreview',
  component: FontGallery,
} satisfies Meta<typeof FontGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
