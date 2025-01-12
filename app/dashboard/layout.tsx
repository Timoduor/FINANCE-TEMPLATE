import SideNav from '@/app/ui/dashboard/sidenav'; // Importing the side navigation component

export default function Layout({ children }: { children: React.ReactNode }) {
 return (
  <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
   {/* Side Navigation */}
   <div className="w-full flex-none md:w-64">
    <SideNav /> {/* Render the SideNav component */}
   </div>
   {/* Main Content */}
   <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
    {children} {/* Render the page's content dynamically */}
   </div>
  </div>
 );
}
