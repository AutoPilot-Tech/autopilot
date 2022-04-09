import React,  { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Tasks } from '../Tasks';
import { Calendar } from '../Calendar';
import { useTracksValue } from '../../context/tracks-context';


export const Content = () => {

  

  return (
    <section className="content">
      <Sidebar />
      <Tasks />      
    </section>
  );
};
