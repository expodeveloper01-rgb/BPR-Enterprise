/**
 * Skeleton Component
 * Placeholder loading skeleton for content
 */
export const Skeleton = ({ className = "", ...props }) => (
  <div
    className={`bg-gray-200 rounded-md animate-pulse ${className}`}
    {...props}
  />
);

/**
 * CardSkeletons - Multiple card placeholders
 */
export const CardSkeletons = ({ count = 3, className = "" }) => (
  <div className={`grid gap-4 ${className}`}>
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse"
      />
    ))}
  </div>
);

/**
 * ProductCardSkeleton - Loading skeleton for product cards
 */
export const ProductCardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="rounded-lg overflow-hidden bg-white border border-gray-100"
      >
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * TableRowSkeletons - Loading skeleton for table rows
 */
export const TableRowSkeletons = ({ count = 5 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <tr key={i} className="border-b border-gray-100 animate-pulse">
        <td className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-24" />
        </td>
        <td className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </td>
        <td className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </td>
      </tr>
    ))}
  </>
);

/**
 * FilterSkeletons - Loading skeleton for filter items
 */
export const FilterSkeletons = ({ count = 5 }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
    ))}
  </div>
);

/**
 * ProductDetailSkeleton - Loading skeleton for product detail page
 */
export const ProductDetailSkeleton = () => (
  <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 py-10 space-y-10">
    {/* Gallery skeleton */}
    <div className="space-y-4">
      <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-full h-20 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>

    {/* Info skeleton */}
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

export default Skeleton;
