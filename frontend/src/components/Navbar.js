import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Navbar = () => {
    console.log()
    return <>
        <div className="navbarWrapper">
            <ul className="navbarList">
                <li className="logo" onClick={() => window.location.replace('https://interax.netlify.app/')}>INTERAX</li>
                <div className="navbarLinksWrapper">
                    <li className="navbarLink"><Link to='/' style={{ textDecoration: 'none' }}><div className="link2"><HomeIcon /> <p className="linktext">Home</p> </div></Link></li>
                    <li className="navbarLink"><Link to='/login' style={{ textDecoration: 'none' }}><div className="link2"><LoginIcon /> <p className="linktext">Login</p></div></Link></li>
                    <li className="navbarLink"><Link to='/signup' style={{ textDecoration: 'none' }}><div className="link2"><GroupAddIcon /> <p className="linktext">Sign Up</p></div></Link></li>
                </div>
            </ul>
        </div >
    </>
}

export default Navbar