import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Column<T extends Record<string, unknown>> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data: T[];
  emptyState?: string;
};

export function DataTable<T extends Record<string, unknown>>({ columns, data, emptyState = "No data available" }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground">
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={String(row.id)}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className}>
                    {column.render ? column.render(row[column.key], row) : (row[column.key] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

