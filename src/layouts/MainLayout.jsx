import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;