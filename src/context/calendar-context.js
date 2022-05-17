import React, {createContext, useContext, useState} from "react";
import moment from "moment";

export const CalendarContext = createContext();

export const CalendarProvider = ({children}) => {
  const [nowValue, setNowValue] = useState(moment());

  return (
    <CalendarContext.Provider
      value={{
        nowValue,
        setNowValue,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarValue = () => useContext(CalendarContext);





/*
TrackContext: showSideBar = true or false

pages:
app/calendar/today
  <Header />
  <SideBar />
  <CalendarHome />
app/calendar/week
  <Header />
  <SideBar />
  <CalendarWeekView />
app/calendar/month
    <Header />
    <SideBar />
    <CalendarMonthView />

app/folder/:folderId
    <Header />
    <SideBar />
    <Tasks />


*each page will load the sidebar based on the track context.

*/
