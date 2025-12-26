import { Skeleton } from "@/components/ui/skeleton";
import BgGradient from "@/components/common/bg-gradient";

export default function Loading() {
  return (
    <div
      className="relative isolate min-h-screen
    bg-linear-to-b from-rose-50/40 to-white"
    >
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="flex flex-col gap-4">
             <Skeleton className="h-8 w-1/3 bg-gray-300/50" />
             <div className="flex gap-2">
                 <Skeleton className="h-4 w-24 bg-gray-200" />
                 <Skeleton className="h-4 w-24 bg-gray-200" />
             </div>
          </div>
          
          <div className="relative mt-4 sm:mt-8 lg:mt-16">
            <div
              className="relative p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-md
              rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30
              h-[600px] flex items-center justify-center"
            >
               <Skeleton className="h-full w-full bg-gray-100/50 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
