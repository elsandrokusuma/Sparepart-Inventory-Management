
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { transactions } from '@/lib/data';
import { format } from 'date-fns';

export default function HistoryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Record History</h2>
          <p className="text-muted-foreground">
            A detailed log of all inventory movements.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{format(new Date(tx.date), 'PPP p')}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'IN' ? 'default' : 'secondary'} className={tx.type === 'IN' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{tx.item}</TableCell>
                  <TableCell>{tx.quantity}</TableCell>
                  <TableCell>
                    {tx.type === 'IN'
                      ? `From: ${tx.supplier}`
                      : '-'}
                  </TableCell>
                  <TableCell>{tx.user}</TableCell>
                  <TableCell>
                    {tx.status ? (
                       <Badge
                       variant={tx.status === 'Pending' ? 'secondary' : (tx.status === 'Approved' ? 'default' : 'destructive')}
                       className={
                         tx.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                         (tx.status === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                         'bg-red-500/20 text-red-400 border-red-500/30')
                       }
                     >
                       {tx.status}
                     </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
