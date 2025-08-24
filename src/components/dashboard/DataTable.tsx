'use client';

import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
} from '@/components/ui';
import { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyStateTitle: string;
  emptyStateAction?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  emptyStateTitle,
  emptyStateAction,
  className = '',
}: DataTableProps<T>) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <tr>
              {columns.map(column => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} isAlternate={index % 2 !== 0}>
                {columns.map(column => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <TableEmptyState title={emptyStateTitle} action={emptyStateAction} />
        )}
      </CardContent>
    </Card>
  );
}
