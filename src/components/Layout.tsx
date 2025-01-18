import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: '80vh', padding: '1rem' }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
