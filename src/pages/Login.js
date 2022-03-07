import React from 'react'
import { signInWithGoogle } from '../firebase'

export const Login = () => {
  return (
    <div className="login-buttons">
      <button className="login-buttons__button" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}

