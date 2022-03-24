import React, { useState, useEffect } from 'react';
import { auth, db, signInWithGoogle } from '../firebase';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignUp = () => {
    console.log('email: ', email);
    console.log('password: ', password);
    console.log('firstName: ', firstName);
    console.log('lastName: ', lastName);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {})
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  };
  return (
    <div>
      <form className="signup-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
        <button type="submit" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
    </div>
  );
};
