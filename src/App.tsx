import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css';

const ErrorPage = React.lazy(() => import('./pages/ErrorPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const UpdatePassword = React.lazy(() => import('./pages/UpdatePassword'));

const routes = [
  {
    path: '/',
    element: <h1 className="text-3xl font-bold">Hello world!</h1>,
    errorElement: <ErrorPage />,
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
  return <RouterProvider router={router} />;
};

export default App;
