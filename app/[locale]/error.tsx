"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="ledger-paper flex min-h-[70vh] items-center px-5 py-20 sm:px-8">
      <div className="card mx-auto flex w-full max-w-[680px] flex-col items-start gap-5 p-[clamp(24px,5vw,48px)]">
        <div className="overline">{t("errorOverline")}</div>
        <h1 className="h2">{t("errorTitle")}</h1>
        <p className="text-[17px] leading-relaxed">{t("errorText")}</p>
        <button type="button" onClick={reset} className="btn-marker">
          {t("retry")}
        </button>
      </div>
    </main>
  );
}
