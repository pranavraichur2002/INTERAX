import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import '../index.css';
import NavbarForum from '../components/NavbarForum';
import Logout from '../utils/Logout';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const UserInfo = () => {
    document.title = 'User Info - Interax';

    return (
        <>
            <ToastContainer autoClose={4000} hideProgressBar={true} limit={1} closeButton={true} position={'top-right'}></ToastContainer>
            <div className='linearProgressContainer'>

            </div>
            <div className='forumWrapper' >

                <NavbarForum />
                <button style={{ margin: '0.4em', width: '3em' }} className='button' onClick={() => { Logout() }}><LogoutIcon sx={{ margin: '-0.35em' }} /></button>
                <Link to='/mainLoggedIn/userInfo' style={{ textDecoration: 'none', color: '#82009c' }}>
                    <div className='loggedInAsTextContainer' style={{ display: 'inline', float: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <AccountCircleIcon sx={{ margin: '0.075em 0' }} /><p className='loggedInAsText'>{localStorage.getItem('username')}</p>
                        </div>
                    </div>
                </Link>
                <hr />
                <div className='postsWrapper' style={{
                    padding: '0em', margin: '0em',
                }} >
                    <div className='loginContainer' style={{ padding: '0.4em', fontSize: '0.95rem', margin: 'auto' }} >
                        <div className='loginForm'>
                            <h4 className='centerText'>User Info</h4>
                            <div className='userInfoText' style={{ display: 'flex', flexDirection: 'row' }}>
                                <h4 style={{ margin: '0.2em', padding: '0em' }}>Username: </h4>
                                <h4 style={{ margin: '0.2em', padding: '0em', fontWeight: '100' }}>{localStorage.getItem('username')}</h4>
                            </div>
                            <div className='userInfoText' style={{ display: 'flex', flexDirection: 'row' }}>
                                <h4 style={{ margin: '0.2em', padding: '0em' }}>Email: </h4>
                                <h4 style={{ margin: '0.2em', padding: '0em', fontWeight: '100' }}>{localStorage.getItem('email')}</h4>
                            </div>
                            <div className='userInfoText' style={{ display: 'flex', flexDirection: 'row' }}>
                                <h4 style={{ margin: '0.2em', padding: '0em' }}>Year: </h4>
                                <h4 style={{ margin: '0.2em', padding: '0em', fontWeight: '100' }}>{localStorage.getItem('year')}</h4>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        </>
    )
}


export default UserInfo;
