import React from 'react';
import { Sidebar } from './Sidebar';
import { Tasks } from '../Tasks';

export const Content = () => {
  console.log('Content component just ran')
  return (
    <section className="content">
      <Sidebar />
      <Tasks />
    </section>
  );
};
