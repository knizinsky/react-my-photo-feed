import React from 'react';
import Header from './Header';
import { LayoutProps } from '../types/LayoutProps';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: '80vh', padding: '1rem' }}>{children}</main>
    </div>
  );
};

export default Layout;
