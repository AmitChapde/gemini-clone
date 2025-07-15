export function MessageSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] animate-pulse">
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-32"></div>
      </div>
      <div className="flex-1 px-4 py-4 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChatroomSkeleton() {
  return (
    <div className="px-2 space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-3 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2 mb-1"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  )
}
