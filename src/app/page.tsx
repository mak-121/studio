import { Header } from '@/components/page-pilot/header';
import { PagePilotClient } from '@/components/page-pilot/page-pilot-client';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Sidebar>
          <ThemeCustomizer />
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex-1 container mx-auto">
            <PagePilotClient />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
