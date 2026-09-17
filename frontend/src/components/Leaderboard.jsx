import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Trophy, Medal, Award, Flame, Users, MapPin } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com";

export default function Leaderboard({ quizId }) {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;
    let isMounted = true;

    async function loadRanks() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/quiz/leaderboard/${quizId}`);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        if (isMounted && Array.isArray(data)) setRanks(data);
      } catch (err) {
        console.error("Leaderboard load failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadRanks();

    return () => {
      isMounted = false;
    };
  }, [quizId]);

  const getBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="p-1.5 rounded-full bg-amber-100 text-amber-600 shadow-xs">
          <Trophy size={18} />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="p-1.5 rounded-full bg-slate-200 text-slate-700 shadow-xs">
          <Medal size={18} />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="p-1.5 rounded-full bg-amber-50 text-amber-800 shadow-xs">
          <Award size={18} />
        </span>
      );
    }
    return <span className="text-xs font-black text-slate-500 w-6 text-center">#{rank}</span>;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden mt-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="text-amber-300 animate-bounce" size={22} />
            <h3 className="font-extrabold text-base sm:text-lg">बिहार स्टेट लाइव लीडरबोर्ड</h3>
          </div>
          <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Users size={12} /> {ranks.length} छात्र
          </span>
        </div>
        <p className="text-xs text-blue-100 mt-1">अंक व समय के आधार पर बिहार के शीर्ष छात्र</p>
      </div>

      {/* Ranks List */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500">रैंक लोड हो रहा है...</div>
        ) : ranks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            अभी कोई सबमिशन नहीं हुआ है। टेस्ट देकर #1 रैंक हासिल करें!
          </div>
        ) : (
          ranks.map((item) => (
            <div
              key={item.rank}
              className={`flex items-center justify-between p-3.5 sm:px-5 hover:bg-slate-50/80 transition ${
                item.rank === 1 ? "bg-amber-50/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center">{getBadge(item.rank)}</div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    {item.student_name}
                    {item.rank === 1 && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded border border-amber-300">
                        TOPPER
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <MapPin size={11} className="text-rose-500" />
                    <span>{item.district || "बिहार"}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-indigo-700">
                  {item.score}/{item.total_questions} अंक
                </span>
                <p className="text-[10px] text-emerald-600 font-bold">{item.accuracy}% सटीकता</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

Leaderboard.propTypes = {
  quizId: PropTypes.string.isRequired
};