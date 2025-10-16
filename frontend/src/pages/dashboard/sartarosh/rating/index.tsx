import React, { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Rating = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const events = [
    { date: '2022-08-17', time: '09:00', title: 'Meeting A' },
    { date: '2022-08-17', time: '10:00', title: 'Call B' },
    { date: '2022-08-20', time: '10:00', title: 'Review C' },
    { date: '2022-08-22', time: '10:00', title: 'Planning D' },
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDate = (year: any, month: any, day: any) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const renderCells = () => {
    const cells = [];

    for (let i = 0; i < startingDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2 bg-transparent" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const dayEvents = events.filter(e => e.date === dateStr);

      cells.push(
        <div key={day} className="p-2 bg-gray-800 rounded-lg text-white relative min-h-[80px]">
          <div className="font-bold">{day}</div>
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              className="mt-1 text-xs bg-orange-400 text-black px-2 py-1 rounded-md"
            >
              {event.time}
            </div>
          ))}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl text-white">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          &gt;
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-sm font-medium bg-gray-700 py-2 rounded"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {renderCells()}
      </div>
    </div>
  );
};

export default Rating;
