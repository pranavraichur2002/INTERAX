import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Drawer } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import ForumIcon from '@mui/icons-material/Forum';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

const NavbarForum = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    return <>
        <button style={{ margin: '0.4em', width: '3em' }} className={`button drawer`} onClick={() => setIsDrawerOpen(true)}><ListIcon sx={{ margin: '-0.35em' }} /></button>
        <Drawer achor='left' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <div className="drawerListWrapper">
                <ul className="drawerLinks">
                    <li className="drawerLink"><Link to='/mainLoggedIn/forum' style={{ textDecoration: 'none', color: '#82009c' }}><div className="link"><ForumIcon sx={{ margin: '-0.2em 0.2em' }} />Forum</div></Link></li>
                    <li className="drawerLink"><Link to='/mainLoggedIn/postForum' style={{ textDecoration: 'none', color: '#82009c' }}><div className="link"><PostAddIcon sx={{ margin: '-0.2em 0.2em' }} />Post</div></Link></li>
                    <li className="drawerLink"><Link to='/mainLoggedIn/yourPosts' style={{ textDecoration: 'none', color: '#82009c' }}><div className="link"><AccountBoxIcon sx={{ margin: '-0.2em 0.2em' }} />Your Posts</div></Link></li>
                    <li className="drawerLink"><Link to='/mainLoggedIn/topPosts' style={{ textDecoration: 'none', color: '#82009c' }}><div className="link"><LocalFireDepartmentIcon sx={{ margin: '-0.2em 0.2em' }} />Top Posts</div></Link></li>
                    <li className="drawerLink"><Link to='/mainLoggedIn/userInfo' style={{ textDecoration: 'none', color: '#82009c' }}><div className="link"><DisplaySettingsIcon sx={{ margin: '-0.2em 0.2em' }} />User Info</div></Link></li>
                </ul>
            </div>
        </Drawer>
    </>
}

export default NavbarForum;