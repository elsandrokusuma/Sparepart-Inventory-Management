"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { inventoryItems } from '@/lib/data';
import { ChartTooltipContent } from '@/components/ui/chart';

export default function InventoryChart() {
  const data = inventoryItems.reduce((acc, item) => {
    const existingCategory = acc.find((c) => c.name === item.category);
    if (existingCategory) {
      existingCategory.total += item.stock;
    } else {
      acc.push({ name: item.category, total: item.stock });
    }
    return acc;
  }, [] as { name: string; total: number }[]);

  return (
    <>
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
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
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  );
}
