import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/data';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          An overview of the latest inventory movements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              {transaction.type === 'IN' ? (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-green-500/20">
                    <ArrowDownLeft className="h-4 w-4 text-green-500"/>
                </span>
              ) : (
                <span className={`flex h-full w-full items-center justify-center rounded-full bg-blue-500/20`}>
                    <ArrowUpRight className={`h-4 w-4 text-blue-500`}/>
                </span>
              )}
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction.quantity} x {transaction.item}
              </p>
              <p className="text-sm text-muted-foreground">
                By {transaction.user} &bull;{' '}
                {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
              </p>
            </div>
            <div className="ml-auto font-medium">
              <Badge variant={transaction.type === 'IN' ? 'default' : 'secondary'} className={transaction.type === 'IN' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                {transaction.type}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  );
}
