"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="ledger-paper flex min-h-[70vh] items-center px-5 py-20 sm:px-8">
      <div className="card mx-auto flex w-full max-w-[680px] flex-col items-start gap-5 p-[clamp(24px,5vw,48px)]">
        <div className="overline">SOMETHING DID NOT BALANCE</div>
        <h1 className="h2">That page hit an unexpected error.</h1>
        <p className="text-[17px] leading-relaxed">
          No accounting drama required. Try the page again.
        </p>
        <button type="button" onClick={reset} className="btn-marker">
          Try again
        </button>
      </div>
    </main>
  );
}
