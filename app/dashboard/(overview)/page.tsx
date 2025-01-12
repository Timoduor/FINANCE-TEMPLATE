import Link from 'next/link';
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';

import { Suspense } from 'react';
import {
 RevenueChartSkeleton,
 LatestInvoicesSkeleton,
} from '@/app/ui/skeletons';

import { fetchCardData } from '@/app/lib/data';

export default async function Page() {
 try {
  // Fetch data
  const {
   numberOfInvoices,
   numberOfCustomers,
   totalPaidInvoices,
   totalPendingInvoices,
  } = await fetchCardData();

  return (
   <main>
    {/* Page Header */}
    <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
     Dashboard
    </h1>

    {/* Statistics Cards */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
     <Card title="Collected" value={totalPaidInvoices} type="collected" />
     <Card title="Pending" value={totalPendingInvoices} type="pending" />
     <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
     <Card
      title="Total Customers"
      value={numberOfCustomers}
      type="customers"
     />
    </div>

    {/* Charts and Invoices */}
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
     <Suspense fallback={<RevenueChartSkeleton />}>
      <RevenueChart />
     </Suspense>
     <Suspense fallback={<LatestInvoicesSkeleton />}>
      <LatestInvoices />
     </Suspense>
    </div>

    {/* Navigation to Invoices */}
    <div className="mt-6">
     <Link href="/dashboard/invoices-page" className="text-blue-500 underline">

     </Link>
    </div>
   </main>
  );
 } catch (error) {
  console.error("Error loading dashboard data:", error);
  // Optionally, return an error UI or fallback content
  return (
   <main>
    <h1 className="text-red-500">Failed to load dashboard data.</h1>
   </main>
  );
 }
}
