
'use client';

import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Header } from '@/components/page-pilot/header';
import { PagePilotClient } from '@/components/page-pilot/page-pilot-client';
import { ThemeCustomizer } from '@/components/theme-customizer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto">
        <PagePilotClient />
      </main>
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <Palette className="h-6 w-6" />
              <span className="sr-only">Customize Theme</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[320px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Customize Theme</SheetTitle>
              <SheetDescription>
                Pick a color palette and font to personalize the application's appearance.
              </SheetDescription>
            </SheetHeader>
            <ThemeCustomizer />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
