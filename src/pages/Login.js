import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from '../firebase';

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       window.location.href="/dashboard";
  //     }
  //   })
  //   return unsubscribe
  // }, [])
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user logged in', user)
        window.location.href="/dashboard";
      }
    })
    return unsubscribe
  }, [])

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }


  return (
    <div className="login">
      <form className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={handleLogin}>Login</button>
        <button type="button" onClick={signInWithGoogle}>Login with Google</button>
      </form>
    </div>
  );
};
