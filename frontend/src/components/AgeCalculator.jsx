import { useState } from "react";
import PropTypes from "prop-types";
import { CheckCircle2, XCircle, Calculator } from "lucide-react";

const EXAM_RULES = {
  BSSC_INTER: {
    name: "BSSC Inter Level",
    cutoffDate: "2026-08-01",
    minAge: 18,
    maxAge: { GENERAL_MALE: 37, OBC_MALE_FEMALE: 40, GENERAL_FEMALE: 40, SC_ST: 42 }
  },
  BPSC_CCE: {
    name: "BPSC Combined Exam",
    cutoffDate: "2026-08-01",
    minAge: 20,
    maxAge: { GENERAL_MALE: 37, OBC_MALE_FEMALE: 40, GENERAL_FEMALE: 40, SC_ST: 42 }
  },
  BIHAR_POLICE: {
    name: "Bihar Police Constable",
    cutoffDate: "2026-08-01",
    minAge: 18,
    maxAge: { GENERAL_MALE: 25, OBC_MALE_FEMALE: 27, GENERAL_FEMALE: 28, SC_ST: 30 }
  }
};

export default function AgeCalculator({ onClose }) {
  const [selectedExamKey, setSelectedExamKey] = useState("BSSC_INTER");
  const [dob, setDob] = useState("");
  const [category, setCategory] = useState("GENERAL_MALE");
  const [result, setResult] = useState(null);

  const calculateAge = () => {
    if (!dob) return;

    const exam = EXAM_RULES[selectedExamKey];
    const birthDate = new Date(dob);
    const cutoff = new Date(exam.cutoffDate);

    let years = cutoff.getFullYear() - birthDate.getFullYear();
    let months = cutoff.getMonth() - birthDate.getMonth();
    let days = cutoff.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(cutoff.getFullYear(), cutoff.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const maxAllowedAge = exam.maxAge[category] || 37;
    const isEligible = years >= exam.minAge && years <= maxAllowedAge;

    setResult({
      years,
      months,
      days,
      isEligible,
      minAge: exam.minAge,
      maxAge: maxAllowedAge,
      cutoffDate: exam.cutoffDate
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-md mb-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="text-[#0B4F8A]" size={20} />
            उम्र कैलकुलेटर (Bihar Exam Cutoff)
          </h2>
          <p className="text-xs text-slate-500">परीक्षा की कटऑफ तिथि के अनुसार अपनी उम्र और पात्रता जांचें</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer">
            बंद करें
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">परीक्षा चुनें:</label>
          <select
            value={selectedExamKey}
            onChange={(e) => setSelectedExamKey(e.target.value)}
            className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B4F8A]"
          >
            {Object.entries(EXAM_RULES).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">जन्म तिथि (DOB):</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B4F8A]"
          >
          </input>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">आरक्षण वर्ग (Category):</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B4F8A]"
          >
            <option value="GENERAL_MALE">General (पुरुष)</option>
            <option value="GENERAL_FEMALE">General (महिला)</option>
            <option value="OBC_MALE_FEMALE">BC / EBC (ओबीसी)</option>
            <option value="SC_ST">SC / ST</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={calculateAge}
        className="w-full bg-[#0B4F8A] hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-lg transition cursor-pointer"
      >
        उम्र और पात्रता जांचें
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-lg border flex items-center justify-between ${
          result.isEligible ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}>
          <div>
            <p className="text-xs text-slate-600">
              कटऑफ तिथि ({result.cutoffDate}) को आपकी उम्र:
            </p>
            <p className="text-sm font-bold text-slate-900">
              {result.years} वर्ष, {result.months} महीने, {result.days} दिन
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              अनुमति: {result.minAge} से {result.maxAge} वर्ष
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-xs">
            {result.isEligible ? (
              <span className="flex items-center gap-1 text-green-700">
                <CheckCircle2 size={16} /> योग्य (Eligible)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-700">
                <XCircle size={16} /> अयोग्य (Not Eligible)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

AgeCalculator.propTypes = {
  onClose: PropTypes.func
};