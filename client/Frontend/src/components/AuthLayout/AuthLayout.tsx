import { Outlet, Navigate } from 'react-router-dom';
import { useLocationContext } from '../../locationContext.tsx';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { logStatus } from '../../api/auth/Login.ts';

import grannyBackground from '../../assets/img/grannyBackground.png';
import gameBackground from '../../assets/img/gameBackground.png';
import chatBackground from '../../assets/img/chatBackground.png';
import profileBackground from '../../assets/img/profileBackground.png';


const AuthLayout = () => {
  const { location } = useLocationContext();

  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    switch (location) {
      case '/':
      case '/home':
        setBackgroundImage(grannyBackground);
        break;
      case '/game':
        setBackgroundImage(gameBackground);
        break;
      case '/chat':
        setBackgroundImage(chatBackground);
        break;
      case '/profile':
        setBackgroundImage(profileBackground);
        break;
      default:
        setBackgroundImage('');
    }
  }, [location]);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundRepeat = 'repeat';
    if (location === '/profile') {
      document.body.style.backdropFilter = 'blur(6px)';
      document.body.style.backgroundPosition = 'right center';
    }

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backdropFilter = '';
      document.body.style.backgroundRepeat = '';
    };
  }, [backgroundImage, location]);

  // const auth = ;
  const { data: auth } = useSWR('/status', logStatus, {
    suspense: true,
    revalidateOnFocus: false,
  })
  return auth?.authorized ? <Outlet /> : <Navigate to="/" />;
};

export default AuthLayout;
