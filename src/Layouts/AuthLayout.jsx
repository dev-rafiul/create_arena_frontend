import React from 'react';
import Logo from '../Components/Logo';
import { Outlet } from 'react-router';
import banner2 from '../assets/banners/banner3.jpg'

const AuthLayout = () => {
    return (
        <div>
            <div className='ml-15 mt-2'>
            <Logo></Logo>
            </div>
            <div className='grid md:grid-cols-2 grid-cols-1 justify-between gap-15'>
                <div className='-mt-9 md:mt-27 lg:-mt-16 order-2'>
                    <img src={banner2} alt="" />
                </div>
                <div className='mt-19 lg:mx-30 mx-10 order-1 '>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;