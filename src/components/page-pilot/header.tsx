
'use client';
import { BookMarked, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCsvAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

export function Header() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const result = await downloadCsvAction();

    if (result.success && result.data) {
      try {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "receipt_log.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Success', description: 'Receipt log downloaded.' });
      } catch (e: any) {
        toast({ variant: 'destructive', title: 'Download Error', description: `Failed to prepare file for download: ${e.message}` });
      }
    } else {
      toast({ variant: 'destructive', title: 'Download Failed', description: result.error });
    }
    setIsDownloading(false);
  };

  return (
    <header className="p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookMarked className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          PagePilot
        </h1>
      </div>
      <Button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? (
          <>
            <Loader2 className="animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <FileDown />
            Download Log
          </>
        )}
      </Button>
    </header>
  );
}
