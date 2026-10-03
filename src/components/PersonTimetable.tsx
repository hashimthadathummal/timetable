import { useMemo, useState } from "react";
import type { PersonSchedule } from "../types";
import {
  getTodayName,
  getTomorrowName,
  PERIOD_TIMES,
  TOTAL_PERIODS,
} from "../utils/scheduleHelpers";

import { CalendarDays as CalendarDaysIcon } from "lucide-react";

interface Props {
  persons: PersonSchedule[];
}

type DayMode = "today" | "tomorrow";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type ViewMode = "single-day" | "week";

export default function PersonTimetable({ persons }: Props) {
  const [selectedName, setSelectedName] = useState<string>("");
  const [dayMode, setDayMode] = useState<DayMode | "custom">("today");
  const [customDate, setCustomDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("single-day");

  const effectiveName =
    selectedName && persons.some((p) => p.name === selectedName)
      ? selectedName
      : persons[0]?.name || "";

  const selectedPerson = useMemo(
    () => persons.find((p) => p.name === effectiveName) || null,
    [persons, effectiveName],
  );

  let dayName: string = dayMode === "today" ? getTodayName() : getTomorrowName();
  if (dayMode === "custom" && customDate) {
    const dt = new Date(customDate);
    dayName = WEEK_DAYS[dt.getDay()];
  }

  return (
    <div className="rounded-3xl shadow-2xl border border-white/10 bg-[#0B1121]/80 backdrop-blur-md p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2">
          Personal Timetable
        </h2>

        <label
          htmlFor="person-select"
          className="mt-3 block text-xs text-gray-400"
        >
          Select Person
        </label>
        <select
          id="person-select"
          value={effectiveName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
        >
          {persons.map((person) => (
            <option key={person.name} value={person.name} className="bg-[#0B1121]">
              {person.name}
            </option>
          ))}
        </select>
        {persons.length === 0 && (
          <p className="mt-2 text-xs text-rose-400">
            No persons loaded.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 p-1 bg-black/40 border border-white/5 rounded-full max-w-fit">
          <button
            onClick={() => setViewMode("single-day")}
            className={`text-sm font-semibold py-1.5 px-4 rounded-full transition-all duration-300 ${
              viewMode === "single-day"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`text-sm font-semibold py-1.5 px-4 rounded-full transition-all duration-300 ${
              viewMode === "week"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Week View
          </button>
        </div>

        {viewMode === "single-day" && (
          <div className="flex flex-wrap gap-1 p-1 bg-black/20 border border-white/5 rounded-full max-w-fit">
            <button
              onClick={() => setDayMode("today")}
              className={`min-w-[80px] text-sm font-semibold py-1.5 px-3 rounded-full transition-all duration-300 ${
                dayMode === "today"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDayMode("tomorrow")}
              className={`min-w-[80px] text-sm font-semibold py-1.5 px-3 rounded-full transition-all duration-300 ${
                dayMode === "tomorrow"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Tomorrow
            </button>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDaysIcon className="h-4 w-4 text-cyan-400" />
              </div>
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setDayMode("custom");
                  setCustomDate(e.target.value);
                }}
                className={`w-full h-full pl-9 pr-4 py-1.5 bg-transparent text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  dayMode === "custom"
                    ? "bg-white/10 text-white shadow-sm border border-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        {!selectedPerson ? (
          <p className="text-sm text-gray-500">No person selected.</p>
        ) : viewMode === "week" ? (
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-[#0B1121] border-b border-white/10 px-2 py-3 text-gray-500 font-semibold w-24 text-center">
                    Period
                  </th>
                  {WEEK_DAYS.map((day) => (
                    <th key={day} className="border-b border-white/10 px-2 py-3 text-gray-300 font-semibold min-w-[130px] text-center">
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: TOTAL_PERIODS }, (_, i) => i + 1).map((period) => {
                  const times = PERIOD_TIMES[period];
                  return (
                    <tr key={period} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="sticky left-0 z-10 bg-[#0B1121] group-hover:bg-[#0c1325] transition-colors border-r border-white/5 px-2 py-3 text-center">
                        <div className="font-bold text-gray-300">P{period}</div>
                        <div className="text-[10px] text-gray-500 font-medium tracking-wide mt-0.5">{times.start} - {times.end}</div>
                      </td>
                      {WEEK_DAYS.map((day) => {
                        const detail = selectedPerson.schedule[day]?.[period];
                        const isFree = !detail?.subject;
                        
                        return (
                          <td key={day} className="px-2 py-2 align-top">
                            {isFree ? (
                              <div className="h-full w-full flex items-center justify-center p-2 opacity-30">
                                <span className="text-emerald-500 font-bold text-xs">-</span>
                              </div>
                            ) : (
                              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 h-full shadow-sm hover:border-cyan-500/30 transition-colors">
                                <p className="text-xs font-semibold text-gray-200 line-clamp-2 leading-snug">
                                  {detail.subject}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                  {detail.room ? (
                                    <span className="text-[9px] uppercase tracking-wide bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-bold">
                                      {detail.room}
                                    </span>
                                  ) : (
                                    <span />
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <p className="text-xs text-cyan-500 mb-2 font-medium tracking-widest uppercase">{dayName}</p>
            <div className="space-y-2">
              {Array.from({ length: TOTAL_PERIODS }, (_, i) => i + 1).map(
                (period) => {
                  const times = PERIOD_TIMES[period];
                  const detail = selectedPerson.schedule[dayName]?.[period];
                  const isFree = !detail?.subject;

                  return (
                    <div
                      key={period}
                      className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-500">
                          P{period} - {times.start}-{times.end}
                        </p>
                        {isFree ? (
                          <p className="text-sm text-emerald-400 font-medium mt-1">
                            Free
                          </p>
                        ) : (
                          <div className="mt-1">
                            <p className="text-sm text-gray-200 font-medium">
                              {detail.subject}
                            </p>
                            <p className="text-xs text-gray-400">
                              {detail.teacher || "No teacher"}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-3">
                        {detail?.room ? (
                          <span className="text-[10px] uppercase tracking-wide bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                            {detail.room}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
