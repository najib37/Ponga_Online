import { Outlet, Navigate } from 'react-router-dom';
import { useLocationContext } from '../../locationContext.tsx';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { logStatus } from '../../api/auth/Login.ts';

const AuthLayout = () => {
  const { location } = useLocationContext();

  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    switch (location) {
      case '/':
      case '/home':
        setBackgroundImage('/src/assets/img/grannyBackground.png');
        break;
      case '/game':
        setBackgroundImage('/src/assets/img/gameBackground.png');
        break;
      case '/chat':
        setBackgroundImage('/src/assets/img/chatBackground.png');
        break;
      case '/profile':
        setBackgroundImage('/src/assets/img/profileBackground.png');
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
