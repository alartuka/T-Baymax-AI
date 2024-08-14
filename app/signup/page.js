"use client";

import { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');
  const { push } = useRouter();
  const { user, loading } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      push('/t-baymax');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      push('/t-baymax');
    } catch (error) {
      setError(error.message);
    }
  };

  // Redirect to login
  const handleLogin = () => {
    push('/login');
  };

  if (!user && !loading){ 
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fdefe2' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <TextField
            label="Password Again"
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" color="primary" disabled={!email || !password}>
            Sign Up
          </Button>
        </form>

        {/* Google Sign in */}
        <Button onClick={handleGoogleLogin} variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Sign Up with Google
        </Button>

        <Button onClick={handleLogin} variant="outlined" color="primary" style={{ marginTop: '20px' }}>
          Already have an account?
        </Button>
      </div>
    );
  }

  if (user && !loading) {
    push("/t-baymax")
    return
  } else {
    return <CircularProgress />
  } 
};

export default SignupPage;
