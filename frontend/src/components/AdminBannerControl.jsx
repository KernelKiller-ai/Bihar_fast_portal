import { useEffect, useState } from "react";
import { Save, CheckCircle2, Loader2, AlertCircle, Lock } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../api/supabase";

const BANNER_ID = "top_banner";
// Set VITE_ADMIN_BANNER_PIN in your .env — this is a lightweight gate, not real security.
const ADMIN_PIN = import.meta.env.VITE_ADMIN_BANNER_PIN || "";

const EMPTY = { banner_active: false, banner_text: "", banner_link: "", banner_bg: "bg-[#0B4F8A]" };

export default function AdminBannerControl() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("bf_banner_admin") === "1");
  const [pin, setPin] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!unlocked || !isSupabaseConfigured) return;
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", BANNER_ID)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) setForm({ ...EMPTY, ...data });
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!ADMIN_PIN || pin === ADMIN_PIN) {
      sessionStorage.setItem("bf_banner_admin", "1");
      setUnlocked(true);
    } else {
      setError("गलत PIN — दोबारा कोशिश करें");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    const { error: upErr } = await supabase
      .from("site_settings")
      .update({
        banner_active: form.banner_active,
        banner_text: form.banner_text,
        banner_link: form.banner_link || null,
        banner_bg: form.banner_bg,
      })
      .eq("id", BANNER_ID);
    setSaving(false);
    if (upErr) setError(upErr.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800 flex items-center gap-2">
        <AlertCircle size={16} /> Supabase configured नहीं है (.env में VITE_SUPABASE_URL सेट करें)।
      </div>
    );
  }

  if (!unlocked) {
    return (
      <form onSubmit={handleUnlock} className="rounded-2xl border border-slate-200/80 bg-white p-5 max-w-sm space-y-3">
        <p className="flex items-center gap-2 text-sm font-black text-slate-900">
          <Lock size={15} className="text-[#0B4F8A]" /> Banner Admin Access
        </p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Admin PIN"
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/40"
        />
        {error && <p className="text-xs font-bold text-rose-600 flex items-center gap-1"><AlertCircle size={13} /> {error}</p>}
        <button type="submit" className="w-full h-10 rounded-xl bg-[#0B4F8A] hover:bg-[#093f6e] text-white text-sm font-black transition">
          Unlock
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900">🔴 Live Banner Control</h3>
        {loading && <Loader2 size={15} className="animate-spin text-slate-400" />}
      </div>

      <label className="flex items-center gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
        <input
          type="checkbox"
          checked={form.banner_active}
          onChange={(e) => setForm({ ...form, banner_active: e.target.checked })}
          className="w-4 h-4 accent-emerald-600"
        />
        Banner Active (सभी पेज पर दिखेगा)
      </label>

      <textarea
        rows={2}
        value={form.banner_text || ""}
        onChange={(e) => setForm({ ...form, banner_text: e.target.value })}
        placeholder="घोषणा टेक्स्ट — उदा. BSSC परीक्षा तिथि जारी!"
        className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/40"
      />

      <input
        type="url"
        value={form.banner_link || ""}
        onChange={(e) => setForm({ ...form, banner_link: e.target.value })}
        placeholder="CTA Link (optional) — https://..."
        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4F8A]/40"
      />

      {error && <p className="text-xs font-bold text-rose-600 flex items-center gap-1"><AlertCircle size={13} /> {error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full h-11 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 transition ${saved ? "bg-emerald-700" : "bg-[#0B4F8A] hover:bg-[#093f6e]"
          }`}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
        {saved ? "Saved Live!" : "Save Live Banner"}
      </button>
    </div>
  );
}
