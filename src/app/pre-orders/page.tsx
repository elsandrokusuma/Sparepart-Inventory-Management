import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { preOrders } from '@/lib/data';
import { format } from 'date-fns';

export default function PreOrdersPage() {
  const jakartaPreOrders = preOrders.filter(
    (order) => order.location === 'Jakarta'
  );
  const surabayaPreOrders = preOrders.filter(
    (order) => order.location === 'Surabaya'
  );

  const renderPreOrderTable = (orders: typeof preOrders) => (
    <Card>
      <CardContent className="!p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.item}</TableCell>
                <TableCell className="text-right">{order.quantity}</TableCell>
                <TableCell>
                  {format(new Date(order.orderDate), 'PPP')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={order.status === 'Pending' ? 'secondary' : 'default'}
                    className={order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pre-Order Management</h2>
          <p className="text-muted-foreground">
            Track and manage customer pre-orders for each location.
          </p>
        </div>
      </div>
      <Tabs defaultValue="jakarta" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jakarta">Jakarta</TabsTrigger>
          <TabsTrigger value="surabaya">Surabaya</TabsTrigger>
        </TabsList>
        <TabsContent value="jakarta">
          {renderPreOrderTable(jakartaPreOrders)}
        </TabsContent>
        <TabsContent value="surabaya">
          {renderPreOrderTable(surabayaPreOrders)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
