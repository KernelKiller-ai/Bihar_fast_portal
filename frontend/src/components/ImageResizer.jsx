import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { 
  Upload, Download, RefreshCw, CheckCircle2, AlertTriangle, 
  Sliders, Image as ImageIcon, X, RotateCcw 
} from "lucide-react";

const EXAM_PRESETS = [
  { id: "BSSC_PHOTO", label: "BSSC फोटो", minKb: 20, maxKb: 50, width: 200, height: 230, type: "photo" },
  { id: "BSSC_SIGN", label: "BSSC हस्ताक्षर", minKb: 10, maxKb: 20, width: 140, height: 60, type: "sign" },
  { id: "BPSC_PHOTO", label: "BPSC फोटो", minKb: 20, maxKb: 50, width: 200, height: 230, type: "photo" },
  { id: "BPSC_SIGN", label: "BPSC हस्ताक्षर", minKb: 10, maxKb: 20, width: 140, height: 60, type: "sign" },
  { id: "POLICE_PHOTO", label: "बिहार पुलिस फोटो", minKb: 15, maxKb: 25, width: 200, height: 250, type: "photo" },
  { id: "CUSTOM", label: "कस्टम साइज", minKb: 10, maxKb: 100, width: 300, height: 300, type: "custom" }
];

export default function ImageResizer({ onClose }) {
  const [selectedPreset, setSelectedPreset] = useState(EXAM_PRESETS[0]);
  const [imageSrc, setImageSrc] = useState(null);
  const [originalSizeKb, setOriginalSizeKb] = useState(0);
  const [outputBlob, setOutputBlob] = useState(null);
  const [outputSizeKb, setOutputSizeKb] = useState(0);
  const [quality, setQuality] = useState(0.85);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSizeKb((file.size / 1024).toFixed(1));
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      processImage(event.target.result, selectedPreset, quality);
    };
    reader.readAsDataURL(file);
  };

  // Compression & Resize Engine
  const processImage = (src, preset, manualQuality) => {
    if (!src) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext("2d");

      // White base fill for signatures and transparencies
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, preset.width, preset.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setOutputBlob(blob);
            setOutputSizeKb((blob.size / 1024).toFixed(1));
          }
          setIsProcessing(false);
        },
        "image/jpeg",
        manualQuality
      );
    };
  };

  // Trigger re-process when preset or manual slider changes
  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    if (imageSrc) processImage(imageSrc, preset, quality);
  };

  const handleQualityChange = (val) => {
    setQuality(val);
    if (imageSrc) processImage(imageSrc, selectedPreset, val);
  };

  const handleDownload = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biharfast_${selectedPreset.id.toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isValidSize = outputSizeKb >= selectedPreset.minKb && outputSizeKb <= selectedPreset.maxKb;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 text-[#0B4F8A] p-2 rounded-xl">
            <ImageIcon size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              स्मार्ट फोटो & साइन रिसाइज़र
            </h2>
            <p className="text-[11px] text-slate-500">100% प्राइवेट: फोटो सीधे आपके ब्राउज़र में कंप्रेस होती है</p>
          </div>
        </div>

        {onClose && (
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Preset Badges Grid */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          फॉर्म का प्रकार चुनें:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EXAM_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPreset.id === preset.id
                  ? "bg-[#0B4F8A] text-white border-[#0B4F8A] shadow-xs"
                  : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-blue-50/40"
              }`}
            >
              <span className="block text-xs font-bold leading-tight">{preset.label}</span>
              <span className={`block text-[10px] mt-0.5 ${selectedPreset.id === preset.id ? "text-blue-200" : "text-slate-400"}`}>
                {preset.minKb}–{preset.maxKb} KB ({preset.width}x{preset.height}px)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-200 hover:border-[#0B4F8A] bg-blue-50/30 rounded-2xl p-7 text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="bg-white w-12 h-12 mx-auto rounded-full flex items-center justify-center text-[#0B4F8A] shadow-xs mb-2 group-hover:scale-110 transition-transform">
            <Upload size={22} />
          </div>
          <p className="text-sm font-extrabold text-slate-800">
            अपनी फोटो या सिग्नेचर चुनें
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            JPG, PNG या WEBP फाइल अपलोड करें
          </p>
        </div>
      ) : (
        /* Processed Preview Workspace */
        <div className="space-y-4">
          <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            {/* Visual Box */}
            <div className="relative shrink-0 bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <img
                src={outputBlob ? URL.createObjectURL(outputBlob) : imageSrc}
                alt="Cropped Preview"
                className="object-contain max-h-36 max-w-36 mx-auto bg-white"
                style={{ aspectRatio: `${selectedPreset.width} / ${selectedPreset.height}` }}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-xs">
                  <RefreshCw className="animate-spin" size={18} />
                </div>
              )}
            </div>

            {/* Metrics & Gauges */}
            <div className="w-full space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">तैयार साइज:</span>
                <span className={`text-base font-black ${isValidSize ? "text-emerald-600" : "text-amber-600"}`}>
                  {outputSizeKb} KB
                </span>
              </div>

              {/* Progress visual gauge */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    isValidSize ? "bg-emerald-500" : outputSizeKb > selectedPreset.maxKb ? "bg-amber-500" : "bg-blue-400"
                  }`}
                  style={{ width: `${Math.min((outputSizeKb / selectedPreset.maxKb) * 100, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>ओरिजिनल: {originalSizeKb} KB</span>
                <span>मानक सीमा: {selectedPreset.minKb}–{selectedPreset.maxKb} KB</span>
              </div>

              {/* Validation Message */}
              <div className="pt-1">
                {isValidSize ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-[11px] px-2 py-0.5 rounded-md font-bold">
                    <CheckCircle2 size={13} /> {selectedPreset.label} के लिए एकदम सही
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 text-[11px] px-2 py-0.5 rounded-md font-semibold">
                    <AlertTriangle size={13} /> साइज रेंज से बाहर है (स्लाइडर एडजस्ट करें)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quality Slider Control */}
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1">
                <Sliders size={13} className="text-[#0B4F8A]" /> क्वालिटी / साइज एडजस्ट करें:
              </span>
              <span className="text-slate-500 text-[11px]">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full accent-[#0B4F8A] cursor-pointer"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-1/3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <RotateCcw size={14} /> दूसरी फोटो
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="w-2/3 bg-[#1E8E3E] hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Download size={15} /> डाउनलोड करें ({outputSizeKb} KB)
            </button>
          </div>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

ImageResizer.propTypes = {
  onClose: PropTypes.func
};