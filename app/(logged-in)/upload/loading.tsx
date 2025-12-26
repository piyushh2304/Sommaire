import { Skeleton } from "@/components/ui/skeleton";
import BgGradient from "@/components/common/bg-gradient";

export default function Loading() {
  return (
    <section className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div
          className="flex flex-col items-center
        justify-center gap-6 text-center"
        >
          <div className="space-y-4 w-full flex flex-col items-center">
            <Skeleton className="h-10 w-64 bg-gray-200" />
            <Skeleton className="h-6 w-96 max-w-full bg-gray-200" />
          </div>
          
          <div className="w-full max-w-lg mt-8 p-8 border border-dashed border-gray-300 rounded-lg">
             <div className="flex flex-col items-center gap-4">
                 <Skeleton className="h-12 w-12 rounded-full bg-rose-100" />
                 <Skeleton className="h-6 w-48 bg-gray-200" />
                 <Skeleton className="h-4 w-64 bg-gray-200" />
                 <Skeleton className="h-10 w-full bg-gray-900/10 mt-4" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
