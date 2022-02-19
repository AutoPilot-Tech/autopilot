import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Header } from './components/layout/Header';
import { Content } from './components/layout/Content';
import { TracksProvider } from './context/tracks-context';
import './App.scss';

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const App = ({darkModeDefault = true }) => {
  const [darkMode, setDarkMode] = useState(darkModeDefault);
  return (
      <TracksProvider>
        <main data-testid="application"
        className={darkMode ? 'darkmode' : undefined}>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <Content />
        </main>
       </TracksProvider>
  );
};
