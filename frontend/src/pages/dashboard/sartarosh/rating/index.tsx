import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Rating = () => {
  const [currentMonth] = useState("August 2022");
  const [activeTab, setActiveTab] = useState("Oy");
  const [filters, setFilters] = useState({
    barchasini: true,
    red: true,
    blue: true,
    orange: true,
    green: true,
    cyan: true,
  });

  const events: Record<
    string,
    Array<{ time?: string; color?: string; more?: string }>
  > = {
    "17": [
      { time: "09:00", color: "orange" },
      { time: "10:00", color: "cyan" },
      { more: "+2 More" },
    ],
    "20": [
      { time: "10:00", color: "red" },
      { time: "10:00", color: "blue" },
    ],
    "22": [{ time: "10:00", color: "green" }],
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const miniCalDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const mainCalendarDays = [
    [31, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
  ];

  const miniCalendarDays = [
    [31, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 1, 2, 3],
    [3, 4, 5, 6, 7, 8],
  ];

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex bg-[#14151F] rounded-[8px] text-white">
      <div className="w-72 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">August 2022</h3>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-gray-800 rounded">
                <ChevronLeft size={20} />
              </button>
              <button className="p-1 hover:bg-gray-800 rounded">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
            {miniCalDays.map((day) => (
              <div key={day} className="text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm text-center">
            {miniCalendarDays.flat().map((day, idx) => (
              <div
                key={idx}
                className={`p-1 rounded ${
                  day === 4
                    ? "bg-orange-500 text-white"
                    : day > 24 && idx < 7
                    ? "text-gray-600"
                    : day < 7 && idx > 28
                    ? "text-gray-600"
                    : "hover:bg-gray-800"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-gray-300">FILTER</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.barchasini}
                onChange={() => toggleFilter("barchasini")}
                className="w-4 h-4 accent-purple-500"
              />
              <span>Barchasini ko'rish</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.red}
                onChange={() => toggleFilter("red")}
                className="w-4 h-4 accent-red-500"
              />
              <span>09:00</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.blue}
                onChange={() => toggleFilter("blue")}
                className="w-4 h-4 accent-blue-500"
              />
              <span>09:00</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.orange}
                onChange={() => toggleFilter("orange")}
                className="w-4 h-4 accent-orange-500"
              />
              <span>09:00</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.green}
                onChange={() => toggleFilter("green")}
                className="w-4 h-4 accent-green-500"
              />
              <span>09:00</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.cyan}
                onChange={() => toggleFilter("cyan")}
                className="w-4 h-4 accent-cyan-500"
              />
              <span>09:00</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 border-2 m-4 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-800 rounded">
              <ChevronLeft size={24} />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded">
              <ChevronRight size={24} />
            </button>
            <h2 className="text-2xl font-bold">{currentMonth}</h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("Oy")}
              className={`px-6 py-2 rounded ${
                activeTab === "Oy"
                  ? "bg-orange-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Oy
            </button>
            <button
              onClick={() => setActiveTab("Hafta")}
              className={`px-6 py-2 rounded ${
                activeTab === "Hafta"
                  ? "bg-orange-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Hafta
            </button>
            <button
              onClick={() => setActiveTab("Kun")}
              className={`px-6 py-2 rounded ${
                activeTab === "Kun"
                  ? "bg-orange-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Kun
            </button>
            <button
              onClick={() => setActiveTab("List")}
              className={`px-6 py-2 rounded ${
                activeTab === "List"
                  ? "bg-orange-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              List
            </button>
          </div>
        </div>

        <div className="h-full">
          <div className="grid grid-cols-7 border-b ">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="p-4 text-center font-semibold border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 h-[calc(100%-4rem)]">
            {mainCalendarDays.map((week, weekIdx) =>
              week.map((day, dayIdx) => {
                const isCurrentMonth =
                  !(day > 24 && weekIdx === 0) && !(day < 11 && weekIdx >= 4);
                const dayEvents = events[day.toString()] || [];

                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`border-r border-b p-2 ${
                      !isCurrentMonth ? "bg-gray-800 bg-opacity-50" : ""
                    } last:border-r-0`}
                  >
                    <div
                      className={`text-sm mb-1 ${
                        !isCurrentMonth ? "text-gray-600" : ""
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event, idx) => {
                        if (event.more) {
                          return (
                            <div
                              key={idx}
                              className="text-xs text-gray-400 mt-1"
                            >
                              {event.more}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={idx}
                            className={`text-xs px-2 py-1 rounded ${
                              event.color === "orange"
                                ? "bg-orange-500"
                                : event.color === "cyan"
                                ? "bg-cyan-500"
                                : event.color === "red"
                                ? "bg-red-500"
                                : event.color === "blue"
                                ? "bg-blue-500"
                                : event.color === "green"
                                ? "bg-green-500"
                                : ""
                            }`}
                          >
                            {event.time}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
