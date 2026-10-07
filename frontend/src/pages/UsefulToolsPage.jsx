import { useEffect } from "react";
import AgeCalculator from "../components/AgeCalculator";
import ImageResizer from "../components/ImageResizer";

export default function UsefulToolsPage() {
  useEffect(() => {
    document.title = "Useful Tools for Bihar Exams - BiharFast";
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-[55vh]">
      <header className="mb-7">
        <p className="text-xs font-black uppercase tracking-widest text-blue-700">Free Online Utilities</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">Useful Tools for Bihar Exams</h1>
        <p className="mt-2 text-sm text-slate-600">
          Check exam age eligibility or resize your photo and signature for application forms.
        </p>
      </header>
      <div className="space-y-5">
        <AgeCalculator />
        <ImageResizer />
      </div>
    </main>
  );
}
