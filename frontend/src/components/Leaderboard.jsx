import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Trophy, Medal, Award, Flame, Users, MapPin, Sparkles, User } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Vite Environment variables se direct client initialize
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Leaderboard({ quizId }) {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;
    let isMounted = true;

    async function loadRanks() {
      try {
        setLoading(true);
        // avatar_url ke saath fetch
        const { data, error } = await supabase
          .from("class10_leaderboard")
          .select("id, student_name, district, score, total_questions, accuracy, avatar_url, created_at")
          .eq("quiz_id", quizId)
          .order("score", { ascending: false })
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) throw error;

        if (isMounted && data) {
          const rankedData = data.map((item, index) => ({
            ...item,
            rank: index + 1
          }));
          setRanks(rankedData);
        }
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
        <span className="p-1 rounded-full bg-amber-100 text-amber-600 shadow-xs inline-flex items-center justify-center">
          <Trophy size={16} />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="p-1 rounded-full bg-slate-200 text-slate-700 shadow-xs inline-flex items-center justify-center">
          <Medal size={16} />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="p-1 rounded-full bg-amber-50 text-amber-800 shadow-xs inline-flex items-center justify-center">
          <Award size={16} />
        </span>
      );
    }
    return <span className="text-xs font-black text-slate-400 w-5 text-center">#{rank}</span>;
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
          <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 backdrop-blur-xs">
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
          <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <Sparkles className="text-amber-500" size={24} />
            <span>अभी कोई सबमिशन नहीं हुआ है। टेस्ट देकर <b>#1 रैंक</b> हासिल करें!</span>
          </div>
        ) : (
          ranks.map((item) => (
            <div
              key={item.id || item.rank}
              className={`flex items-center justify-between p-3 sm:px-4 hover:bg-slate-50/80 transition ${
                item.rank === 1 ? "bg-amber-50/60" : ""
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* Rank Badge */}
                <div className="w-6 flex justify-center shrink-0">{getBadge(item.rank)}</div>

                {/* Profile Picture */}
                <div className="relative shrink-0">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.student_name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase border border-blue-200 shadow-xs">
                      {item.student_name ? item.student_name.charAt(0) : <User size={16} />}
                    </div>
                  )}

                  {/* Topper Mini Star */}
                  {item.rank === 1 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                      👑
                    </span>
                  )}
                </div>

                {/* Student Info */}
                <div className="min-w-0 truncate">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 truncate">
                    <span className="truncate">{item.student_name || "छात्र"}</span>
                    {item.rank === 1 && (
                      <span className="shrink-0 text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded border border-amber-300 uppercase">
                        Topper
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-rose-500 shrink-0" />
                    <span className="truncate">{item.district || "बिहार"}</span>
                  </p>
                </div>
              </div>

              {/* Score & Accuracy */}
              <div className="text-right shrink-0 pl-2">
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