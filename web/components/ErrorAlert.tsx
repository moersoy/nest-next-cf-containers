import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <Card className="bg-destructive/10 border-destructive text-destructive">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        <Button onClick={onDismiss} variant="ghost" size="sm">
          Dismiss
        </Button>
      </CardContent>
    </Card>
  );
} 