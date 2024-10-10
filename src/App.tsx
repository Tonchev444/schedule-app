import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import { DateRangeSelect } from "./components/date-range-picker";
import { useState } from "react";
import { ScheduleDayConteiner } from "./components/schedule-days-container";
import { DayObject, NUMBER_ITEMS_PER_PAGE } from "./utils/genetic-utils";

function App() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateList, setDateList] = useState<DayObject[]>([]);
  const [previewDateList, setPreviewDateList] = useState<DayObject[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isAutocompletePreview, setIsAutocompletePreview] =
    useState<boolean>(false);
  const [isAutocompleteDone, setIsAutocompleteDone] = useState<boolean>(false);
  const [donwloadComplete, setDonwloadComplete] = useState<boolean>(false);
  const numberOfPages = Math.ceil(dateList.length / NUMBER_ITEMS_PER_PAGE);

  const checkForTimeStamps = (list: DayObject[]) =>
    list.some((day) => day.timeStamps && day.timeStamps.length > 0);

  const fillTimeStamps = () => {
    const dateAutoComplete = dateList.map((item) => ({
      ...item,
      timeStamps: item.timeStamps ? [...item.timeStamps] : [],
    }));

    let lastIndex = 0;
    for (let i = dateList.length - 1; i >= 0; i--) {
      const item = dateList[i];
      if (item.timeStamps && item.timeStamps.length > 0) {
        lastIndex = i;
        break;
      }
    }

    const sequence = dateAutoComplete.slice(0, lastIndex + 1);
    let indexOfRotation = 0;

    for (let i = lastIndex + 1; i < dateAutoComplete.length; i++) {
      if (sequence[indexOfRotation]?.timeStamps) {
        dateAutoComplete[i].timeStamps = [
          ...sequence[indexOfRotation].timeStamps,
        ];
      }

      indexOfRotation = (indexOfRotation + 1) % sequence.length;
    }

    setPreviewDateList(dateAutoComplete);
  };

  const resetTimeStamps = () => {
    const newDateList = [...dateList];
    newDateList.forEach((date) => {
      date.timeStamps = undefined;
    });
    setDateList(newDateList);
    setIsAutocompleteDone(false);
  };

  const downloadJson = () => {
    const jsonString = JSON.stringify(dateList, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MySchedule.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-11 flex flex-col h-screen">
      <div className="flex gap-11 flex-col justify-start mb-3.5">
        <h1 className="font-semibold text-2xl">Create new Schedule</h1>
        <div className="flex flex-row justify-between">
          <DateRangeSelect
            startDate={startDate}
            endDate={endDate}
            differenceInDays={dateList?.length}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            setDateList={setDateList}
            dateList={dateList}
          />
          {dateList?.length > 0 && (
            <div className="h-full content-center flex flex-rol gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="text-xl font-bold disabled:opacity-30"
              >
                &lt;
              </button>
              <button
                disabled={page === numberOfPages}
                onClick={() => setPage(page + 1)}
                className="text-xl font-bold disabled:opacity-30"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-screen pr-11 -translate-x-11">
        <hr className="border-gray-300 w-full mx-auto" />
      </div>
      <ScheduleDayConteiner
        dateList={dateList}
        previewDateList={previewDateList}
        page={page}
        setDateList={setDateList}
        isAutocompletePreview={isAutocompletePreview}
      />
      {dateList?.length > 0 && (
        <div className="h-3 border-b flex flex-row">
          {Array(numberOfPages)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`flex flex-grow ${
                  page === index + 1
                    ? "bg-black hover:bg-black"
                    : "hover:bg-lightGray"
                }`}
                onClick={() => setPage(index + 1)}
              />
            ))}
        </div>
      )}
      {dateList?.length > 0 && (
        <div className="flex felx-row gap-3 justify-end pt-9">
          <button
            className="px-[17px] py-[13px] bg-buttonGray text-white disabled:opacity-30 min-w-40"
            disabled={!checkForTimeStamps(dateList)}
            onClick={() => resetTimeStamps()}
          >
            Reset
          </button>
          <button
            className="px-[17px] py-[13px] bg-buttonCyan text-white disabled:opacity-30 min-w-40"
            disabled={!checkForTimeStamps(dateList) || isAutocompleteDone}
            onClick={() => {
              setDateList([...previewDateList]);
              setIsAutocompleteDone(true);
            }}
            onMouseEnter={() => {
              fillTimeStamps();
              setIsAutocompletePreview(true);
            }}
            onMouseLeave={() => setIsAutocompletePreview(false)}
          >
            Autocomplete
          </button>
          <button
            className="px-[17px] py-[13px] bg-buttonGray text-white disabled:opacity-30 min-w-40"
            disabled={!checkForTimeStamps(dateList)}
            onClick={() => {
              downloadJson();
              setDonwloadComplete(true);
            }}
          >
            Upload
          </button>
        </div>
      )}
      {donwloadComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-24 py-14 rounded shadow-md flex flex-col justify-center items-center text-center">
            <h3 className="mb-4 text-3xl w-80">
              Schedule successfully created.
            </h3>
            <button
              onClick={() => {
                setEndDate(null);
                setStartDate(null);
                setDonwloadComplete(false);
                setIsAutocompleteDone(false);
              }}
              className="text-white bg-buttonCyan p-3 text-lg font-bold w-fit"
            >
              Create another plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
