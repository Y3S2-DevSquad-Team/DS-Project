import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return <Outlet />; // Preserves context during navigation
};