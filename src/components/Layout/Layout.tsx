import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100 relative">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="p-4 md:p-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;