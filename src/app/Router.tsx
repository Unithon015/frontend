import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from './RootLayout';
import ProtectedLayout from './ProtectedLayout';
import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import OnboardingPage from '@/pages/auth/OnboardingPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import AnalyzingPage from '@/pages/dashboard/AnalyzingPage';
import ResultPage from '@/pages/dashboard/ResultPage';
import GoogleAuthCallbackPage from '@/pages/auth/GoogleAuthCallbackPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/callback',
    element: <GoogleAuthCallbackPage />,
  },
  {
    path: '/onboarding',
    element: localStorage.getItem('token') ? <OnboardingPage /> : <Navigate to="/login" replace />,
  },
  {
    path: '/dashboard',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'analyzing', element: <AnalyzingPage /> },
      { path: 'result', element: <ResultPage /> },
    ],
  },
]);
