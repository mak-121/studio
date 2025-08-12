import { Header } from '@/components/page-pilot/header';
import { PagePilotClient } from '@/components/page-pilot/page-pilot-client';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <PagePilotClient />
      </main>
    </div>
  );
}
