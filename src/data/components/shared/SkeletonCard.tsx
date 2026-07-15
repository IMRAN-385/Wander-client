export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden animate-pulse">
      <div className="h-52 bg-dark-100" />
      <div className="p-5 space-y-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => <div key={i} className="w-3.5 h-3.5 bg-dark-100 rounded" />)}
        </div>
        <div className="h-5 bg-dark-100 rounded w-3/4" />
        <div className="h-3 bg-dark-50 rounded w-full" />
        <div className="h-3 bg-dark-50 rounded w-2/3" />
      </div>
    </div>
  );
}