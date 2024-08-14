import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './Navbar';
import { AuthContextProvider } from './AuthContext';
import Spline from '@splinetool/react-spline/next';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "T-Baymax AI",
  description: "Your AI-powered personal healthcare companion. Chat with personalized healthcare companion anytime, in any language and get immediate helpful response! - Built by Tuka Alsharief | Tuka Alarbi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Spline
            scene="https://prod.spline.design/1-uhYfcv9ndQrcvr/scene.splinecode" 
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 50,
              width: '100%',
              height: '100vh',
              zIndex: -1,
          }} />  
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
