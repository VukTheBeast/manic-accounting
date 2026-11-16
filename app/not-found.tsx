import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="ledger-paper min-h-screen">
      <Header />
      <main id="main-content" className="mx-auto flex max-w-[1200px] flex-col items-start gap-5 px-5 py-20 sm:px-8">
        <div className="overline">404 · MISSING ENTRY</div>
        <h1 className="h2">This page is not in the ledger.</h1>
        <p className="max-w-[580px] text-[17px] leading-relaxed">
          The link may be old, or the page may have moved. The books still balance.
        </p>
        <Link href="/" className="btn-marker">Back to the home page</Link>
      </main>
      <Footer />
    </div>
  );
}
