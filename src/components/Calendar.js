import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import { useTracksValue } from '../context/tracks-context';
import { useAutoFill } from '../hooks';

export function Calendar() {
  const { events, setEvents } = useTracksValue();



    

    // testing for autofill
    // useEffect(() => {
    //   useAutoFill(events);
    // }, [])

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
          // eventColor={'#F0A202'}
        />
      </div>
    );
  }