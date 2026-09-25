import { Download, ExternalLink, LockKeyhole, ShieldCheck, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "100% Safe & Secure",
    description: "Directly served from BiharFast.in",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    icon: LockKeyhole,
    title: "No unnecessary permissions",
    description: "Only push notifications",
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    icon: Smartphone,
    title: "Official BiharFast Release",
    description: "Free for Bihar aspirants",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
];

export default function DownloadApp() {
  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-200 bg-white p-2 shadow-md">
                  <img src="/logo-192.png" alt="BiharFast app icon" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Official Android App</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Version 1.0 • Approx. 3 MB</p>
                </div>
              </div>
              <h1 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-[#0B3B66] sm:text-4xl">
                BiharFast updates, right in your pocket.
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                Get fast access to Bihar government jobs, admit cards, results and useful public services with the lightweight BiharFast Android app.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/biharfast.apk"
                  download="BiharFast.apk"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
                >
                  <Download size={18} aria-hidden="true" />
                  Download BiharFast.apk
                </a>
                <span className="text-xs font-bold text-slate-500">Free download • ~3 MB</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-wider text-slate-500">Why download from here?</p>
              <div className="space-y-3">
                {trustPoints.map(({ icon: Icon, title, description, color }) => (
                  <div key={title} className={`flex items-start gap-3 rounded-xl border p-3 ${color}`}>
                    <Icon size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-black">{title}</p>
                      <p className="mt-0.5 text-[11px] font-semibold opacity-80">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Quick install guide</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Install in two simple steps</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white">1</span>
              <h3 className="mt-4 text-base font-black text-slate-900">Download the APK</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Tap the download button above and wait for the BiharFast.apk file to finish downloading.
              </p>
            </article>
            <article className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-sm font-black text-white">2</span>
              <h3 className="mt-4 text-base font-black text-slate-900">Allow and install</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Tap the downloaded file. If Chrome or your browser asks about unknown apps, tap Settings, enable “Allow from this source”, return to the installer, and tap Install.
              </p>
              <p className="mt-3 text-xs font-bold text-amber-800">You can turn this setting off again after installation.</p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-100 p-5 text-sm leading-relaxed text-slate-600 sm:p-6">
          <h2 className="text-base font-black text-slate-900">Trust note and FAQ</h2>
          <p className="mt-2">
            BiharFast is an independent educational portal. The app is provided free of charge for access to public information and is distributed from the official BiharFast website. Always download the APK from this page and review Android&apos;s permission prompt before installing.
          </p>
          <p className="mt-3 font-semibold text-slate-700">
            Need more details? Read our <Link to="/disclaimer" className="text-blue-700 underline underline-offset-2">disclaimer</Link> or <Link to="/contact" className="text-blue-700 underline underline-offset-2">contact us</Link>.
          </p>
          <a href="/biharfast.apk" download="BiharFast.apk" className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:text-emerald-800">
            Download again <ExternalLink size={13} aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
