import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useMain from '../hooks/useMain';
import Spinner1 from '@/Util/Spinner1';

const PrivateRoute = () => {
    const location = useLocation();
    const context = useMain();
    let authFlag = true;
    let role = ['ADMIN'];

    const [loadFlag, setLoadFlag] = useState(true);

    useEffect(() => {
        getData();
    }, [location]);

    const getData = async () => {
        setLoadFlag(true);
        if (!localStorage.getItem('reel_rivals_token')) {
            authFlag = false;
        }
        else {
            // let currentTs = new Date().getTime();
            // let rememberTs = JSON.parse(localStorage.getItem('reel_rivals_token')).expiry;

            // if (rememberTs < currentTs) {
            //     if (JSON.parse(localStorage.getItem('reel_rivals_token')).rememberMe) {
            //         // increase the time limit
            //         localStorage.setItem("reel_rivals_token", JSON.stringify({ ...JSON.parse(localStorage.getItem("reel_rivals_token")), rememberTs: currentTs + (24 * 60 * 60 * 1000) }))
            //     }
            //     else {
            //         // logout the user 
            //         authFlag = false;
            //     }
            // }

            // if (authFlag) {
            //     if(!role.includes(JSON.parse(localStorage.getItem('travel_user')).role))
            //     {
            //         authFlag = false;
            //     }
            //     else
            //     {
            //         if (role === 'USER') {
            //             const verify = await context.verifyUser();
            //             if (!verify.success) {
            //                 authFlag = false;
            //             }
            //         }
            //         if (role === 'ADMIN') {
            //             const verify = await context.verifyAdmin();
            //             if (!verify.success) {
            //                 authFlag = false;
            //             }
            //         }
            //     }
            // }
        }

        // console.log(authFlag);
        if (!authFlag) {
            localStorage.removeItem('reel_rivals_token');
            window.location.href = "/auth/sign-in";
        }
        else {
            setLoadFlag(false);
        }
    };

    return (
        <>
            {loadFlag ? <Spinner1 /> : <Outlet />}
        </>
    );
};

export default PrivateRoute;
