import { PageTransition, Skeleton, StatsSkeleton } from '@/components/ui';

export default function Loading() {
  return (
    <PageTransition>
      <div className='space-y-6'>
        {/* Title Skeleton */}
        <div className='space-y-2'>
          <Skeleton variant='text' width='40%' height='32px' />
          <Skeleton variant='text' width='50%' />
        </div>

        {/* Stats Skeleton */}
        <StatsSkeleton />

        {/* Calendar Skeleton */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <Skeleton variant='text' width='30%' height='24px' />
          </div>
          <div className='p-4'>
            <Skeleton height='300px' />
          </div>
        </div>

        {/* List Skeleton */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <Skeleton variant='text' width='30%' height='24px' />
          </div>
          <div className='p-4 space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height='80px' />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
