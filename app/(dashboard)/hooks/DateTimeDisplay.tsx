import useDateTime from './useDateTime';

const DateTimeDisplay = () => {
  const { getCurrentTime, getCurrentDate, getCurrentDay } = useDateTime();

  return (
    <div className="flex items-end gap-3">
      <h3 className="text-2xl">{getCurrentTime()},</h3>
      <div>
        <p className="text- opacity-75">
          {getCurrentDay()}, {getCurrentDate()}
        </p>
      </div>
    </div>
  );
};

export default DateTimeDisplay;
