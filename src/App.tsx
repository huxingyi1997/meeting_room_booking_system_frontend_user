import { Skeleton } from 'antd';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

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

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default App;
