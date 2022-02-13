import React from 'react';
import { Header } from './components/layout/Header';
import { Content } from './components/layout/Content';
import { TracksProvider, SelectedTrackProvider } from './context';
import './App.scss';

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const App = () => {
  return (
    <SelectedTrackProvider>
      <TracksProvider>
        <div className="App">
          <Header />
          <Content />
        </div>
      </TracksProvider>
    </SelectedTrackProvider>
  );
};
