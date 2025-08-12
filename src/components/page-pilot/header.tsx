import { BookMarked } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
  return (
    <header className="p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex items-center gap-4">
       <SidebarTrigger />
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookMarked className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-foreground">
          PagePilot
        </h1>
      </div>
    </header>
  );
}
