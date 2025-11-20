import { IconTrendingDown, IconTrendingUp, IconCurrencyDollar, IconUsers, IconActivity, IconChartBar } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const cards = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    change: "+12.5%",
    trend: "up",
    description: "Trending up this month",
    subtext: "Visitors for the last 6 months",
    icon: IconCurrencyDollar,
    gradient: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
    iconColor: "text-white"
  },
  {
    title: "New Customers",
    value: "1,234",
    change: "-20%",
    trend: "down",
    description: "Down 20% this period",
    subtext: "Acquisition needs attention",
    icon: IconUsers,
    gradient: "from-purple-500 to-pink-400",
    shadow: "shadow-purple-500/20",
    iconColor: "text-white"
  },
  {
    title: "Active Accounts",
    value: "45,678",
    change: "+12.5%",
    trend: "up",
    description: "Strong user retention",
    subtext: "Engagement exceed targets",
    icon: IconActivity,
    gradient: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/20",
    iconColor: "text-white"
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    change: "+4.5%",
    trend: "up",
    description: "Steady performance increase",
    subtext: "Meets growth projections",
    icon: IconChartBar,
    gradient: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-500/20",
    iconColor: "text-white"
  }
];

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className={cn(
            "group relative overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105",
            "animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transform group-hover:rotate-6 transition-transform duration-300",
                  card.gradient,
                  card.shadow
                )}
              >
                <card.icon className={cn("h-6 w-6", card.iconColor)} />
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "font-medium",
                  card.trend === 'up'
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {card.trend === 'up' ? <IconTrendingUp className="w-3 h-3 mr-1" /> : <IconTrendingDown className="w-3 h-3 mr-1" />}
                {card.change}
              </Badge>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
              <div className="text-2xl font-bold text-foreground tracking-tight">{card.value}</div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center text-xs font-medium text-foreground">
                {card.description}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{card.subtext}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
