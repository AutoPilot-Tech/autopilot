import React,  { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Tasks } from '../Tasks';
import { Calendar } from '../Calendar';

export const Content = () => {
  

  return (
    <section className="content">
      <Sidebar />
      <Tasks />
      {/* <Calendar /> */}
      
    </section>
  );
};
