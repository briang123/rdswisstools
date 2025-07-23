'use client';

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconFileDescription } from '@tabler/icons-react';

export interface ToolCardData {
  title: string;
  description: string;
  badge: string;
  icon: string;
  cta: {
    label: string;
    href: string;
  };
  footer: {
    main: string;
    sub: string;
  };
}

export function ToolCard({ cardData }: { cardData: ToolCardData }) {
  // For now, only IconFileDescription is supported. You can extend this to support more icons.
  const Icon = IconFileDescription;

  return (
    <Card
      className="@container/card group relative flex flex-col min-h-[260px] max-w-[340px] w-full bg-gradient-to-t from-primary/5 to-card dark:bg-card border border-border rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer p-0 overflow-hidden"
      style={{ aspectRatio: '1.3/1' }}
    >
      <div className="flex flex-col flex-1 justify-between h-full">
        <CardHeader className="flex flex-col items-center justify-center gap-2 pt-8 pb-4 px-6 flex-shrink-0">
          <div className="flex items-center justify-center mb-2">
            <Icon className="size-10 text-primary drop-shadow-sm" />
          </div>
          <CardTitle className="text-2xl font-bold text-center flex items-center gap-2">
            {cardData.title}
            <Badge variant="outline" className="ml-2 text-xs px-2 py-0.5">
              {cardData.badge}
            </Badge>
          </CardTitle>
          <CardDescription className="text-center text-base mt-1 mb-2 min-h-[40px]">
            {cardData.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-center gap-2 px-6 pb-6 flex-shrink-0">
          <a href={cardData.cta.href} className="w-full">
            <button
              className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 text-base font-semibold hover:bg-primary/90 transition-colors duration-150 shadow focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="tool-card-cta"
            >
              {cardData.cta.label}
            </button>
          </a>
          <div className="w-full mt-3 text-left">
            <div className="font-medium text-sm mb-0.5 line-clamp-2">{cardData.footer.main}</div>
            <div className="text-muted-foreground text-xs line-clamp-2">{cardData.footer.sub}</div>
          </div>
        </CardFooter>
      </div>
      <span className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-transparent group-hover:border-primary/40 transition-all duration-200" />
    </Card>
  );
}
