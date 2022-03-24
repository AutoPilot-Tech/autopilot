import React, { useState, useEffect } from 'react';

import { Header } from '../components/layout/Header';
import { Content } from '../components/layout/Content';
import { TracksProvider, useTracksValue } from '../context/tracks-context';
import { Loading } from './Loading';
import { auth } from '../firebase';

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const Dashboard = ({darkModeDefault = true }) => {
  const [darkMode, setDarkMode] = useState(darkModeDefault);
  const [loading, setLoading] = useState(true);
  // get user from context

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user logged in', user)
        
        setLoading(false);
      }
    })
    return unsubscribe
  }, [])

  return (
    // if loading is true, show loading component
    loading ? <Loading /> : (
      
      <TracksProvider>
        <main data-testid="application"
        className={darkMode ? 'darkmode' : undefined}>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <Content />
        </main>
       </TracksProvider>
    )
  );
};
