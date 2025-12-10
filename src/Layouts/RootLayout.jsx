import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Footer';
import Navbar from '../Pages/Shared/Navbar';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='max-w-7xl mx-auto'>
            <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;