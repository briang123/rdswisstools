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
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{cardData.description}</CardDescription>
        <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl flex items-center gap-2">
          <Icon className="size-6 text-primary" />
          {cardData.title}
          <Badge variant="outline" className="ml-2">
            {cardData.badge}
          </Badge>
        </CardTitle>
        <CardAction>
          <a href={cardData.cta.href} className="inline-block">
            <button className="bg-primary text-primary-foreground rounded px-4 py-1 text-sm font-medium hover:bg-primary/90 transition cursor-pointer">
              {cardData.cta.label}
            </button>
          </a>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="font-medium">{cardData.footer.main}</div>
        <div className="text-muted-foreground">{cardData.footer.sub}</div>
      </CardFooter>
    </Card>
  );
}
