"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-paper font-sans text-body">
        <main className="ledger-paper flex min-h-screen items-center px-5 py-20">
          <div className="card mx-auto flex w-full max-w-[680px] flex-col items-start gap-5 p-10">
            <p className="font-display text-4xl font-bold text-ink">Something went wrong.</p>
            <p className="text-lg">Try loading the site again.</p>
            <button type="button" onClick={reset} className="btn-marker">
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
