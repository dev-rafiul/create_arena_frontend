import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {

    const location = useLocation()
    const {user, loading} = useAuth()

    if(loading){
        return <div className='grid items-center justify-center'>
        
<span className="loading loading-dots loading-xl"></span>
        </div>
    }
    if(!user){
        return <Navigate to="/login" state={location.pathname} ></Navigate>
    }



    return children
};

export default PrivateRoute;