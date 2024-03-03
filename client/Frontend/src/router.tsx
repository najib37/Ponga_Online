import { createBrowserRouter } from 'react-router-dom';
import  { lazy } from 'react';
import FriendsList from "./components/Chat/ChatList/FriendsList.tsx";
import GroupsList from "./components/Chat/ChatList/GroupsList.tsx";

const Authentication = lazy(() => import('./components/Authentication/Authentication.tsx'));
const Home = lazy(() => import('./components/Home/Home.tsx'));
const Profile = lazy(() => import('./components/Profile/Profile.tsx'));
const Game = lazy(() => import('./components/Game/Game.tsx'));
const Chat = lazy(() => import('./components/Chat/Chat.tsx'));
const About = lazy(() => import('./components/About/About.tsx'));
const NavBar = lazy(() => import('./components/NavBar/NavBar.tsx'));
const ErrorPage = lazy(() => import('./components/ErrorPage/ErrorPage.tsx'));
const AuthLayout = lazy(() => import('./components/AuthLayout/AuthLayout.tsx'));
const OTP = lazy(() => import('./components/OTP/OTP.tsx'));


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Authentication />,
  },
  {
    path: '/otp',
    element: <OTP />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        element: <NavBar />,
        children: [
          {
            path: '/profile',
            element: <Profile />,
            children: [
              {
                path: '/profile/:username',
                element: null,
              },
            ],
          },
          {
            path: '/game',
            element: <Game />,
			children: [
				{
				  path: '/game/:id',
				  element: null,
				},
			  ],
          },
          {
            path: '/chat',
            element: <Chat />,
            children: [
              {
                path: '/chat/Direct',
                element: <FriendsList/>,
              },
              {
                path: '/chat/Channels',
                element : <GroupsList/>
              },
              {
                path: '/chat/Direct/:id',
                element: null
              },
              {
                path: '/chat/Channels/:id',
                element: null
              }
            ]
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
