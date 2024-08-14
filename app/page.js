"use client";

import { Box, Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation';

export default function Landing() {
    const { push } = useRouter();
    

    // redirect to login
    const handleLogin = () => {
        push('login');
    }

    // redirect to signup
    const handleSignup = () => {
        push('signup');
    }

  return (
    <Box width="100vw" height="100vh" gap={3} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <Stack direction={'column'} width={'100%'} height={'95%'} p={2} spacing={2} sx={{ mt: '10px'}} flexGrow={1} overflow={'auto'} maxHeight={'100%'}>
          <Box display={'flex'} flexDirection={'column'} position={'relative'} width="100%" p={4} sx={{ bottom: 0 }}>
            <Stack direction={'column'} spacing={2} sx={{ top: 20 }}>
              <Box
                display="flex"
                p={1}
                flexDirection={'column'}
                alignItems={'flex-start'} 
              >
                <Box
                  width="450px"
                  borderRadius={'60px'}
                  p={3}
                  border={'1px solid white'}
                  sx={{
                    background: 'linear-gradient(to right, #2E0854, #4B0082, #8B008B, #9400D3, #4B0082, #2E0854)',
                  }}
                >
                  <Typography variant="h6" color='#ffffff' textAlign={'center'}>
                    AI-powered Personal Healthcare Companion
                  </Typography>
                </Box>
              </Box>

              <Box
                display="flex"
                p={1}
                flexDirection={'column'}
                alignItems={'flex-end'} 
              >
                <Box
                  width="450px"
                  borderRadius={'60px'}
                  p={3}
                  border={'1px solid white'}
                  sx={{
                    background: 'linear-gradient(to right, #FFD700, #FFA500, #FF8C00, #FF4500, #FFA500, #FFD700)',
                  }}
                >
                  <Typography variant="body1" color={'#000000'} textAlign={'center'}>
                    Chat with personalized healthcare companion anytime, in any language and get immediate helpful response
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Box display={'flex'} flexDirection={'column'} position={'fixed'} justifyContent={'center'} alignItems={'center'} width="100%" p={4} sx={{ bottom: 0 }}>
          <Stack direction={'column'} spacing={6} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'column'} spacing={2} justifyContent={'center'} alignItems={'center'}>
              <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} 
              width="450px" borderRadius= {'60px'} p={4} mb={'2px'} 
              sx={{ background: 'linear-gradient(to right, #000044, #191970, #446CCF, #0F52BA, #191970, #000044)', 
              }}>
                <Typography variant="h2" color='#ffffff' textAlign={'center'}>T-Baymax AI</Typography>
              </Box>

              <Stack direction={'row'} spacing={2}>
                <Button variant="contained" color="secondary" onClick={handleSignup}>Signup</Button>
                <Button variant="outlined" color="primary" onClick={handleLogin}>Login</Button>
              </Stack>
            </Stack>
            <Typography variant="p" color='#ffffff' component="p">&copy; {new Date().getFullYear()} Tuka Alsharief. All rights reserved.</Typography>
          </Stack>
          </Box>
        </Stack>
    </Box>
  )
}
