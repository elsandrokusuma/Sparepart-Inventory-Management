
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InventoryItem } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  total: {
    label: "Stock",
    color: "hsl(var(--primary))",
  },
};

interface InventoryChartProps {
    inventoryItems: InventoryItem[];
}

export default function InventoryChart({ inventoryItems }: InventoryChartProps) {
  const data = inventoryItems.reduce((acc, item) => {
    const existingLocation = acc.find((c) => c.name === item.location);
    if (existingLocation) {
      existingLocation.total += item.stock;
    } else {
      acc.push({ name: item.location, total: item.stock });
    }
    return acc;
  }, [] as { name: string; total: number }[]);

  return (
    <>
      <CardHeader>
        <CardTitle>Inventory by Location</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
