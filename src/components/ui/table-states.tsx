import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon, AlertCircleIcon, UsersIcon } from "lucide-react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TableStatesProps {
  columns: number;
}

export function TableLoadingState({ columns }: TableStatesProps) {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: columns }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export function TableEmptyState({ columns }: TableStatesProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={columns} className="h-32 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <UsersIcon className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export function TableErrorState({ 
  columns, 
  error, 
  onRetry 
}: TableStatesProps & { 
  error: string; 
  onRetry: () => void; 
}) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={columns} className="h-32 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <AlertCircleIcon className="h-8 w-8 text-red-500" />
            <div className="text-center">
              <p className="text-lg font-medium text-red-700">Error loading users</p>
              <p className="text-sm text-muted-foreground mb-3">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCwIcon className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
