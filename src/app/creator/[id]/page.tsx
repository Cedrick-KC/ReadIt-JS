interface CreatorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreatorPage({
  params,
}: CreatorPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Creator Profile</h1>

        <p className="mt-2 text-muted-foreground">
          Creator ID: {id}
        </p>
      </div>
    </main>
  );
}
