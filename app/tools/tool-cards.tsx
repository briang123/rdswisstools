import { ToolCard } from './tool-card';
import cardDataArr from './tool-cards.json';

export function ToolCards() {
  // Support an array of cards for a Vercel-style grid
  const cards = Array.isArray(cardDataArr) ? cardDataArr : [cardDataArr];
  return (
    <div className="grid grid-cols-1 gap-6 px-4 py-2 lg:px-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center">
      {cards.map((cardData, idx) => (
        <ToolCard key={cardData.title + idx} cardData={cardData} />
      ))}
    </div>
  );
}
