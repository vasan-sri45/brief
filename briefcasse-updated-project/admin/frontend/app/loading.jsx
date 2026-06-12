"use client";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-24 animate-pulse rounded-3xl bg-white shadow-sm" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
      </div>
    </main>
  );
}
