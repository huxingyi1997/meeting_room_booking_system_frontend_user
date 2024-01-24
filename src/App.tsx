import { Skeleton } from 'antd';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const Menu = React.lazy(() => import('./pages/Menu'));
const MeetingRoomList = React.lazy(() => import('./pages/MeetingRoomList'));
const BookingHistory = React.lazy(() => import('./pages/BookingHistory'));

const Index = React.lazy(() => import('./pages/Index'));
const UpdateInfo = React.lazy(() => import('./pages/UpdateInfo'));

const ErrorPage = React.lazy(() => import('./pages/ErrorPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const UpdatePassword = React.lazy(() => import('./pages/UpdatePassword'));

const routes = [
  {
    path: '/',
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />,
      },
      {
        path: '/',
        element: <Menu />,
        children: [
          {
            path: '/',
            element: <MeetingRoomList />,
          },
          {
            path: 'meeting_room_list',
            element: <MeetingRoomList />,
          },
          {
            path: 'booking_history',
            element: <BookingHistory />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'update_password',
    element: <UpdatePassword />,
  },
];

export const router = createBrowserRouter(routes);

const App = () => {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default App;
