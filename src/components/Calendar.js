import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import { useTracksValue } from '../context/tracks-context';

export function Calendar() {
  const { events, setEvents } = useTracksValue();

    // const events = [
    //     {
    //       id: 1,
    //       title: 'event 1',
    //       start: '2022-03-23T10:00:00',
    //       end: '2022-03-23T12:00:00',
    //     },
    //     {
    //       id: 2,
    //       title: 'event 2',
    //       start: '2022-03-23T13:00:00',
    //       end: '2021-03-23T18:00:00',
    //     },
    //     { 
    //       id: 3, 
    //       title: 'event 3', 
    //       start: '2022-03-23', 
    //       end: '2021-03-23' },
    //   ];

    // show all the events
    useEffect(() => {
      console.log(events);
    }, [])

    return (
      <div className="tasks">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar = {{
            start: 'title',
            center: '',   
            end: 'today prev,next'
          }}
          customButtons={{
            new: {
              text: 'new',
              click: () => console.log('new event'),
            },
          }}
          events={events}
          nowIndicator
          contentHeight={1230}
          eventColor={'#8b53d5'}
        />
      </div>
    );
  }