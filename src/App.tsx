import { useEffect, useState } from "react";
import {
  Clock3,
  CalendarDays,
  UserRound
} from "lucide-react";
import type { PersonSchedule, DayName } from "./types";
import { loadAllPersons } from "./data/index";
import { getTodayName, getTomorrowName } from "./utils/scheduleHelpers";
import Header from "./components/Header";
import CurrentPeriod from "./components/CurrentPeriod";
import NextPeriod from "./components/NextPeriod";
import DayView from "./components/DayView";
import PersonTimetable from "./components/PersonTimetable";

const DAYS: DayName[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Tab = "now" | "day" | "person";

function getInitialTab(): Tab {
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    return "person";
  }
  return "now";
}

export default function App() {
  const [persons, setPersons] = useState<PersonSchedule[]>([]);
  const [tab, setTab] = useState<Tab>(getInitialTab);

  const [dayTabMode, setDayTabMode] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState("");

  useEffect(() => {
    loadAllPersons().then((allPersons) => {
      setPersons(allPersons);
    });
  }, []);

  const today = getTodayName();
  const tomorrow = getTomorrowName();

  let displayDayName: string = dayTabMode === "today" ? today : tomorrow;
  if (dayTabMode === "custom" && customDate) {
    const dt = new Date(customDate);
    displayDayName = DAYS[dt.getDay()];
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "now", label: "Now" },
    { id: "day", label: "Day" },
    { id: "person", label: "Person" },
  ];

  const tabIcons: Record<Tab, React.ReactNode> = {
    now: <Clock3 className="h-4 w-4" />,
    day: <CalendarDays className="h-4 w-4" />,
    person: <UserRound className="h-4 w-4" />,
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#030712] text-gray-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>

      <Header />

      {/* Tab Bar */}
      <div className="sticky top-18 z-20 border-b border-white/5 bg-[#030712]/60 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl gap-2 rounded-2xl bg-white/5 border border-white/10 p-1.5 backdrop-blur-md overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 min-w-max ${
                tab === t.id
                  ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tabIcons[t.id]}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl space-y-4 px-4 py-5 sm:py-6">
        {persons.length === 0 && (
          <p className="mt-16 text-center text-sm text-gray-400">
            Loading schedules...
          </p>
        )}

        {persons.length > 0 && (
          <>
            {tab === "now" && (
              <>
                <CurrentPeriod persons={persons} />
                <NextPeriod persons={persons} />
              </>
            )}
            {tab === "day" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1 rounded-full bg-black/40 border border-white/5 p-1 backdrop-blur-md max-w-fit overflow-hidden">
                  <button
                    onClick={() => setDayTabMode("today")}
                    className={`text-sm font-semibold py-1.5 px-4 rounded-full transition-all duration-300 ${
                      dayTabMode === "today"
                        ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setDayTabMode("tomorrow")}
                    className={`text-sm font-semibold py-1.5 px-4 rounded-full transition-all duration-300 ${
                      dayTabMode === "tomorrow"
                        ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Tomorrow
                  </button>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDays className="h-4 w-4 text-cyan-400" />
                    </div>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => {
                        setDayTabMode("custom");
                        setCustomDate(e.target.value);
                      }}
                      className={`h-full pl-9 pr-4 py-1.5 bg-transparent text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                        dayTabMode === "custom"
                          ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                </div>
                <DayView
                  persons={persons}
                  day={displayDayName}
                  label={`${displayDayName}'s Schedule`}
                />
              </div>
            )}
            {tab === "person" && <PersonTimetable persons={persons} />}
          </>
        )}
      </div>
    </div>
  );
}
