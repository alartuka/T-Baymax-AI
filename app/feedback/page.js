"use client";

import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import dotenv from 'dotenv';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
dotenv.config();

export default function FeedbackPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { push } = useRouter();
  const { user, loading } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_API_KEY,
        name: user.displayName,
        email: user.email,
        message: feedback,
      }),
    });

    const result = await response.json();

    if (result.success) {
        console.log(result);
        setSubmitted(true);
        setFeedback('')
        setTimeout(() => {
          setSubmitted(false)
        }, 3000);
    }
  }
 
  if (!user && !loading) {
    push('/')
    return
  }

  if (loading) {
    return <CircularProgress />
  }
  
  if (!loading && user) {
    return (
      <Box width="100vw" height="100vh" gap={3} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} sx={{ position:"fixed", top: 50, left: 20 }}>
        <Box width="413px" height="460px" display={'flex'} flexDirection={'column'} border={'1px solid white'} justifyContent={'center'} alignItems={'center'} 
          borderRadius={8} sx={{ mt: '10px', background: 'linear-gradient(to right, #000044, #191970, #446CCF, #0F52BA, #191970, #000044)'}}>
          <Stack direction={'column'} p={2} spacing={4} sx={{ mt: '10px'}} flexGrow={1} overflow={'auto'} maxHeight={'100%'}>
            
            <Typography variant="h3" color='#ffffff'>
              Feedback Form
            </Typography>

            <Typography variant="body1" color='#ffffff'>
              Do you have any feedback on the app? <br /> 
              Use this form to let us know of your thoughts, concerns, or issue reports of the app. 
            </Typography>

            {submitted && 
              <Alert severity="success">Your feedback was sent successfully.</Alert>
            }

            <TextField
              label="FeedBack"
              fullWidth
              value={feedback}
              variant="outlined"
              required
              margin="dense"
              color="secondary"
              onChange={(e) => setFeedback(e.target.value)}
              multiline
              maxRows={4}
              focused
            />

            <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit Form</Button>
            
          </Stack>
        </Box>
      </Box>
    );
  } 
  // else {
  //   <Box width="100vw" height="100vh" gap={3} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} sx={{ position:"fixed", top: 50, left: 20 }}>
  //     <Box width="413px" height="560px" display={'flex'} flexDirection={'column'} border={'1px solid white'} justifyContent={'center'} alignItems={'center'} 
  //       borderRadius={8} sx={{ mt: '10px', background: 'linear-gradient(to right, #000044, #191970, #446CCF, #0F52BA, #191970, #000044)'}}>
  //       <Stack direction={'column'} p={2} spacing={4} sx={{ mt: '10px'}} flexGrow={1} overflow={'auto'} maxHeight={'100%'}>
  //         <Typography variant="h3" color='#ffffff'>
  //           Thank you!
  //         </Typography>

  //         <Typography variant="body1" color='#ffffff'>
  //           Your feedback was successfully sent and will be reviewed.
  //         </Typography>

  //         <Typography variant="body1" color='#ffffff'>
  //           Need to submit another feedback form?
  //         </Typography>

  //         <Button variant="contained" color="secondary" onClick={handleResetForm}>Reset Form</Button>
  //       </Stack>
  //     </Box>
  //   </Box>
  // }
}



