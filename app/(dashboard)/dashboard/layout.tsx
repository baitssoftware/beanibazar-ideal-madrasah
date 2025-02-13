import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../components/header';
import { SidebarNav } from '../components/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r ">
          <SidebarHeader className="border-b px-6 py-[22px] bg-primary_school text-white">
            <h2 className="text-xl font-normal">School CMS</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex w-full flex-1 flex-col bg-white overflow-y-auto">
          <Header />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
