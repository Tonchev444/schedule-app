import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { DayObject } from "../utils/genetic-utils";

const ScheduleDayColumn = ({
  date,
  previewSchedule,
  setTime,
  isPreview,
}: {
  date: DayObject;
  previewSchedule: DayObject;
  setTime: (id: string, value: string) => void;
  isPreview: boolean;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [timePickerIsOpen, setTimePickerIsOpen] = useState<boolean>(false);
  return (
    <div className="w-[calc(100%/7)] max-w-[calc(100%/7)] text-lg px-1.5 first:pl-0 last:pr-0 flex-grow flex flex-col text-center py-7">
      <p className="font-bold">{date.dayName}</p>
      <p className="mb-4">{date.dateString}</p>
      <div
        className={`w-full bg-lightGray flex flex-grow max-h-96 flex-col gap-3 overflow-y-auto ${
          isHovered ? "bg-hoverGray" : "bg-lightGray"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {date.timeStamps &&
          date.timeStamps.length > 0 &&
          date.timeStamps.map((timeStamp, key) => (
            <div
              className="w-full border border-buttonCyan text-buttonCyan text-lg py-3 bg-white"
              key={key}
            >
              {timeStamp}
            </div>
          ))}
        {(!date.timeStamps || date.timeStamps.length <= 0) &&
          isPreview &&
          previewSchedule?.timeStamps &&
          previewSchedule.timeStamps.length > 0 &&
          previewSchedule.timeStamps.map((timeStamp, key) => (
            <div
              className="w-full border border-darkGray text-darkGray text-lg py-3 bg-white"
              key={key}
            >
              {timeStamp}
            </div>
          ))}
        {isHovered && (
          <button
            className="w-full bg-darkGray text-white text-lg py-3"
            onClick={() => setTimePickerIsOpen(true)}
          >
            Add Time
          </button>
        )}
      </div>
      {timePickerIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-md">
            <h3 className="mb-4">Select Time</h3>
            <DatePicker
              onChange={(value) => {
                if (!value) return;
                setTime(
                  date.id,
                  value?.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                );
                setTimePickerIsOpen(false);
              }}
              className="mb-4 border"
              showTimeSelect
              showTimeSelectOnly
              dateFormat={"h:mm aa"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleDayColumn;
