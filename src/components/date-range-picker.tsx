import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { DayObject } from "../utils/genetic-utils";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  differenceInDays?: number | null;
  dateList: DayObject[];
  setDateList: (days: DayObject[]) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
};

export const DateRangeSelect = ({
  startDate,
  endDate,
  differenceInDays,
  dateList,
  setDateList,
  setEndDate,
  setStartDate,
}: Props) => {
  const minStartDate = new Date();
  minStartDate.setDate(minStartDate.getDate() + 1);

  useEffect(() => {
    const oldDateList = [...dateList];
    if (startDate && endDate) {
      const days: DayObject[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayName = currentDate.toLocaleDateString("en-GB", {
          weekday: "long",
        });
        const regex = /\//g;
        const dateString = currentDate
          .toLocaleDateString("en-GB")
          .replace(regex, ".");
        days.push({ dayName, dateString, id: dateString });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      days.forEach((day, index) => {
        const oldDate = oldDateList[index];
        if (oldDate && oldDate.timeStamps) day.timeStamps = oldDate.timeStamps;
      });
      setDateList(days);
    }
  }, [startDate, endDate, setDateList, dateList]);

  return (
    <div className="flex flex-row justify-start gap-3">
      <div className="flex flex-col justify-center">
        <label className="text-center text-lg mb-3.5">Start-Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => {
            setStartDate(date);
            if (date) {
              setEndDate(null);
            }
          }}
          minDate={minStartDate}
          dateFormat="dd.MM.yyyy"
          className="pt-3 pb-3.5 px-3 text-center border border-black text-lg rounded-none focus-visible:outline-none focus-visible:border w-40"
        />
      </div>
      <div className="flex flex-col justify-center">
        <label className="text-center text-lg mb-3.5">End-Date</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          minDate={
            startDate
              ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
              : undefined
          }
          dateFormat="dd.MM.yyyy"
          className="pt-3 pb-3.5 px-3 text-center border border-black text-lg rounded-none focus-visible:outline-none focus-visible:border w-40"
          placeholderText="Select an end date"
        />
      </div>
      {!!differenceInDays && differenceInDays > 0 && (
        <div className="flex-col content-end pb-3.5">
          <p className="text-center text-lg">
            {differenceInDays} {differenceInDays > 1 ? "days" : "day"}
          </p>
        </div>
      )}
    </div>
  );
};
