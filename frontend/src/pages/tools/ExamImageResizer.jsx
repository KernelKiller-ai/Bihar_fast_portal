import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileImage,
  Image as ImageIcon,
  LoaderCircle,
  ShieldCheck,
  Upload,
} from "lucide-react";

const EXAM_PRESETS = [
  { id: "bpsc-photo", label: "BPSC Photo", minKb: 20, maxKb: 50, type: "Photo" },
  { id: "bpsc-sign", label: "BPSC Sign", minKb: 10, maxKb: 20, type: "Signature" },
  { id: "bihar-police-photo", label: "Bihar Police Photo", minKb: 25, maxKb: 50, type: "Photo" },
  { id: "bihar-police-sign", label: "Bihar Police Sign", minKb: 10, maxKb: 20, type: "Signature" },
  { id: "ssc", label: "SSC", minKb: 20, maxKb: 50, type: "Photo or signature" },
];

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Your browser could not create the compressed image."));
    }, "image/jpeg", quality);
  });
}

async function compressImage(file, targetBytes) {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas is unavailable in this browser.");

    let scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    for (let resizeAttempt = 0; resizeAttempt < 7; resizeAttempt += 1) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      let low = 0.25;
      let high = 0.95;
      let bestBlob = null;
      for (let qualityAttempt = 0; qualityAttempt < 9; qualityAttempt += 1) {
        const quality = (low + high) / 2;
        const blob = await canvasToBlob(canvas, quality);
        if (blob.size <= targetBytes) {
          bestBlob = blob;
          low = quality;
        } else {
          high = quality;
        }
      }

      if (bestBlob) return bestBlob;
      scale *= 0.8;
    }

    return canvasToBlob(canvas, 0.25);
  } finally {
    bitmap.close();
  }
}

const imageGuides = [
  {
    title: "Start with the current recruitment notice",
    body: "Image rules are set by the recruiting authority, not by a general-purpose resizer. Before preparing a BPSC, BTSC, Bihar Police, or SSC application, open the latest official advertisement and the photo-upload instructions in the application portal. Check the permitted file type, minimum and maximum size, pixel dimensions, aspect ratio, background, and whether a live photograph or a separately signed declaration is required. The ranges shown in this tool are practical targets only; a notice for a particular post can prescribe different limits.",
  },
  {
    title: "Choose the matching preset and target",
    body: "Select the preset that most closely matches your form, then move the target-size slider within that preset's suggested range. The image is converted to a broadly supported JPEG and compressed in your browser. The preview updates as the target changes. A target near the upper end usually preserves more detail; a smaller target may need stronger compression. A tiny source image cannot be enlarged into a sharp photograph, and the tool will not add artificial data simply to make a file heavier.",
  },
  {
    title: "Prepare a clear, recent photograph",
    body: "Use a recent, unfiltered photograph with even lighting, a plain background, and your face clearly visible. Keep your head upright, look toward the camera, and avoid shadows, glare, tinted glasses, decorative borders, or other people in the frame. Do not rely on this tool to retouch identity details or create a substitute for an official live-photo capture. If the notice specifies a particular clothing, background, or photograph date, follow that instruction before uploading.",
  },
  {
    title: "Prepare signatures and handwritten documents",
    body: "Sign with dark blue or black ink on clean, unruled white paper, leaving a little margin around the writing. Photograph or scan the signature straight-on so the strokes are not blurred, cut off, or distorted. A signature should remain legible after compression; do not reduce its target size so far that thin strokes disappear. If a form asks for a signature in a particular language, a thumb impression, or a handwritten declaration, use that exact format rather than substituting another image.",
  },
  {
    title: "Keep proportions and details intact",
    body: "This utility keeps the source image's aspect ratio while reducing its dimensions only when needed to approach your selected file-size target. It does not promise that the result satisfies a portal's exact pixel dimensions or crop. Review the preview for a complete face, visible signature strokes, correct orientation, and comfortable margins. If the original is already very small, choose a better source instead of repeatedly compressing it. Never stretch a portrait into a square or squeeze a signature to fit a guessed template.",
  },
  {
    title: "Review the downloaded file before uploading",
    body: "Check the displayed output size against the current form's limits and open the downloaded JPEG once to confirm that it is readable. If the size falls outside the preset's range, treat the portal's stated limits as authoritative. Some upload forms also enforce pixel dimensions, aspect ratios, file naming, or a maximum combined size that a size-only preset cannot verify. Keep the final file somewhere you can find it, and select that exact file in the application rather than an older original.",
  },
  {
    title: "Privacy, device compatibility, and troubleshooting",
    body: "Image selection, resizing, and preview are handled locally by the browser's Canvas API; this page does not upload the selected image to a BiharFast image-processing server. Your browser still controls temporary memory and download handling, so close the page on a shared device and remove any saved copy when appropriate. If processing fails, try a standard JPG or PNG, reduce an unusually large source image, or use a current browser. Animated images are flattened to a still JPEG, and transparency is placed on a white background.",
  },
  {
    title: "Final checks for BPSC, BTSC, and Bihar Police forms",
    body: "Before you submit, compare the image with the actual preview shown by the application portal. BPSC and BTSC recruitment notices can differ by post and year; Bihar Police instructions can also distinguish a candidate photograph from a scanned signature. Confirm that the portal accepts JPEG, that the image is not rotated or cropped unexpectedly, and that your name or identity details match the application. This is an independent preparation aid, not an official service or a guarantee of acceptance. The recruiting authority's latest instructions always take precedence.",
  },
];

export default function ExamImageResizer() {
  const [presetId, setPresetId] = useState(EXAM_PRESETS[0].id);
  const [targetKb, setTargetKb] = useState(EXAM_PRESETS[0].maxKb);
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const preset = EXAM_PRESETS.find((item) => item.id === presetId) ?? EXAM_PRESETS[0];

  useEffect(() => {
    if (!sourceUrl) return undefined;
    return () => URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  useEffect(() => {
    if (!file) return undefined;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setProcessing(true);
      setError("");
      setResult(null);
      setResultUrl("");
      try {
        const blob = await compressImage(file, targetKb * 1024);
        if (!cancelled) {
          setResult(blob);
          setResultUrl(URL.createObjectURL(blob));
        }
      } catch (processingError) {
        if (!cancelled) {
          setError(processingError.message || "The image could not be processed. Try a JPG or PNG file.");
        }
      } finally {
        if (!cancelled) setProcessing(false);
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [file, targetKb, presetId]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setError("Choose an image file such as JPG, PNG, or WebP.");
      return;
    }
    if (selectedFile.size > MAX_FILE_BYTES) {
      setError("Choose an image smaller than 15 MB, then try again.");
      return;
    }

    setError("");
    setResult(null);
    setResultUrl("");
    setFile(selectedFile);
    setSourceUrl(URL.createObjectURL(selectedFile));
  };

  const selectPreset = (nextPreset) => {
    setPresetId(nextPreset.id);
    setTargetKb(nextPreset.maxKb);
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `biharfast-${preset.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const isWithinRange = result
    && result.size >= preset.minKb * 1024
    && result.size <= preset.maxKb * 1024;

  return (
    <main className="mx-auto min-h-[55vh] max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Free browser-based utility</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2545] sm:text-4xl">Exam Photo &amp; Signature Resizer</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Prepare a lighter JPEG for BPSC, Bihar Police, SSC, and other exam forms. Choose a size target and preview the result before downloading.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">
          <ShieldCheck size={16} aria-hidden="true" />
          Your image stays in this browser; it is not uploaded to our server.
        </div>
      </header>

      <section aria-labelledby="resizer-title" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-blue-50 p-3 text-blue-800"><ImageIcon size={22} /></span>
            <div>
              <h2 id="resizer-title" className="text-lg font-extrabold text-slate-900">Choose exam format</h2>
              <p className="text-xs text-slate-500">The latest recruitment notice always takes priority.</p>
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-slate-700">Suggested file-size range</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {EXAM_PRESETS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={presetId === item.id}
                  onClick={() => selectPreset(item)}
                  className={`min-h-16 rounded-xl border p-3 text-left transition ${
                    presetId === item.id
                      ? "border-blue-700 bg-blue-50 text-blue-950 ring-1 ring-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{item.type} · {item.minKb}–{item.maxKb} KB</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="image-upload" className="mt-6 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-4 py-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
            <Upload size={23} className="mb-2 text-blue-800" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-800">{file ? "Choose a different image" : "Choose a photo or signature"}</span>
            <span className="mt-1 text-xs text-slate-500">JPG, PNG, or WebP · up to 15 MB</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            onChange={handleFileChange}
            className="sr-only"
          />

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="target-size" className="text-sm font-bold text-slate-700">Target file size</label>
              <output htmlFor="target-size" className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-extrabold text-slate-800">{targetKb} KB</output>
            </div>
            <input
              id="target-size"
              type="range"
              min={preset.minKb}
              max={preset.maxKb}
              step="1"
              value={Math.min(targetKb, preset.maxKb)}
              onChange={(event) => setTargetKb(Number(event.target.value))}
              aria-describedby="target-hint"
              className="w-full accent-blue-800"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{preset.minKb} KB</span><span>{preset.maxKb} KB</span>
            </div>
            <p id="target-hint" className="mt-1 text-xs leading-5 text-slate-500">
              The slider sets a compression ceiling. A small or simple source image may finish below the selected size.
            </p>
          </div>

          {error && (
            <p role="alert" className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              <AlertCircle size={18} className="shrink-0" /> {error}
            </p>
          )}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-live="polite">
          <h2 className="text-lg font-extrabold text-slate-900">Live preview</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">Review the image and file size before uploading it to an exam form.</p>
          {file ? (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <figure className="min-w-0">
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <img src={sourceUrl} alt="Original selected image" className="max-h-full max-w-full object-contain" />
                  </div>
                  <figcaption className="mt-2 truncate text-center text-xs text-slate-500">Original · {(file.size / 1024).toFixed(1)} KB</figcaption>
                </figure>
                <figure className="min-w-0">
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                    {resultUrl ? (
                      <img src={resultUrl} alt="Compressed image preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400">Preview appears here</span>
                    )}
                  </div>
                  <figcaption className="mt-2 text-center text-xs text-slate-500">
                    {processing ? "Compressing…" : result ? `${(result.size / 1024).toFixed(1)} KB` : "Compressed"}
                  </figcaption>
                </figure>
              </div>
              {processing && (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-blue-800">
                  <LoaderCircle size={17} className="animate-spin" /> Preparing your preview
                </p>
              )}
              {result && !processing && (
                <p className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-xs leading-5 ${
                  isWithinRange ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"
                }`}>
                  {isWithinRange ? <CheckCircle2 size={17} className="shrink-0" /> : <AlertCircle size={17} className="shrink-0" />}
                  {isWithinRange
                    ? `Output is within the ${preset.minKb}–${preset.maxKb} KB suggested range.`
                    : `Output is outside the suggested ${preset.minKb}–${preset.maxKb} KB range. Check the official form limits and try another source or target.`}
                </p>
              )}
              <button
                type="button"
                onClick={downloadImage}
                disabled={!result || processing}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Download size={18} /> Download compressed JPEG
              </button>
            </>
          ) : (
            <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
              <FileImage size={34} className="text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold text-slate-700">Your preview will appear here</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Select a preset and an image. Compression happens locally in your browser.</p>
            </div>
          )}
        </aside>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-6 flex items-start gap-3">
          <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><ShieldCheck size={20} /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Application checklist</p>
            <h2 className="mt-1 text-2xl font-black text-[#0B2545]">Photo and signature guidelines for exam forms</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">A practical guide for preparing image files for BPSC, BTSC, Bihar Police, and SSC applications.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {imageGuides.map((guide) => (
            <article key={guide.title}>
              <h3 className="text-base font-extrabold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{guide.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-7 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500">
          BiharFast is an independent information portal. Preset size ranges are general preparation targets, not official specifications or a guarantee of application acceptance. Always follow the current recruiting authority's instructions.
        </p>
      </section>
    </main>
  );
}
