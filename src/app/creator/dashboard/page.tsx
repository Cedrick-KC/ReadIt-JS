import Link from "next/link";

export default function CreatorDashboardPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your works and submissions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">My Works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View and manage your published works.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Submissions</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Track works submitted for review.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Create a Work</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit a new book, article, essay, or other work.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
