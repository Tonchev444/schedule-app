import { DayObject, NUMBER_ITEMS_PER_PAGE } from "../utils/genetic-utils";
import ScheduleDayColumn from "./schedule-day-column";
import { useEffect, useState } from "react";

export const ScheduleDayConteiner = ({
  dateList,
  previewDateList,
  page,
  setDateList,
  isAutocompletePreview,
}: {
  dateList: DayObject[];
  previewDateList: DayObject[];
  page: number;
  setDateList: (days: DayObject[]) => void;
  isAutocompletePreview: boolean;
}) => {
  const [dateListPageContent, setDateListPageContent] = useState<DayObject[]>(
    []
  );
  useEffect(() => {
    setDateListPageContent(
      dateList.slice(
        (page - 1) * NUMBER_ITEMS_PER_PAGE,
        page * NUMBER_ITEMS_PER_PAGE
      )
    );
  }, [dateList, page]);
  const setTime = (id: string, value: string) => {
    const newDateList = [...dateList];
    const index = newDateList.findIndex((a) => a.id === id);
    if (!newDateList[index].timeStamps) newDateList[index].timeStamps = [];
    newDateList[index].timeStamps.push(value);
    console.log("index", index, newDateList[index]);
    newDateList[index].timeStamps?.sort((a, b) => {
      const [aHours, aMinutes] = a.split(":").map(Number);
      const [bHours, bMinutes] = b.split(":").map(Number);

      return aHours - bHours || aMinutes - bMinutes;
    });
    console.log("newDatelist", newDateList);
    setDateList(newDateList);
  };
  return (
    <>
      {dateListPageContent?.length > 0 && (
        <div className="flex flex-row w-full flex-grow">
          {dateListPageContent.map((date, index) => (
            <ScheduleDayColumn
              isPreview={isAutocompletePreview}
              date={date}
              setTime={setTime}
              previewSchedule={previewDateList[index]}
            />
          ))}
        </div>
      )}
    </>
  );
};
