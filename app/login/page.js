"use client";

import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAuth } from '../AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { push } = useRouter();
  const { user, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    // signIn('credentials', {email, password, redirect: true, callbackUrl: '/'})
    try {
      await signIn('credentials', {email, password, redirect: true, callbackUrl: '/'})
    //   await signInWithEmailAndPassword(auth, email, password);
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

  // Redirect to signup
  const handleSignup = () => {
    push('/signup');
  };

  if (!user && !loading){
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fdefe2' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Email & Password Sign in */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          <Button type="submit" variant="contained" color="primary" disabled={!email || !password}>
            Login
          </Button>
        </form>

        {/* Google Sign in */}
        <Button onClick={handleGoogleLogin} variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Login with Google
        </Button>

        <Button onClick={handleSignup} variant="outlined" color="primary" style={{ marginTop: '20px' }}>
          Don&apos;t have an account?
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

export default LoginPage;
