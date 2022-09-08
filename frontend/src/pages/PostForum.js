import React, { useEffect, useState } from 'react'
import { TextField, Button, MenuItem, Grid, Checkbox } from '@mui/material';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import NavbarForum from '../components/NavbarForum';
import '../index.css'
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Logout from '../utils/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const styles = {
    resize: {
        fontSize: '10px'
    }
}


const PostForum = () => {
    document.title = 'Post Forum - Interax';
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('1st Cat');
    const [checked, setChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const postForumHandler = () => {

        if (title.length < 5) {
            toast.error('Title must container 5 characters at least', { autoClose: 4000 });
            return;
        }

        if (body.length < 10) {
            toast.error('Body must container 10 characters at least', { autoClose: 4000 });
            return;
        }

        setIsLoading(true);
        fetch('https://interax.herokuapp.com/postForum', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title: title, body: body, category: category, username: localStorage.getItem('username'), email: localStorage.getItem('email'), year: localStorage.getItem('year'), userId: localStorage.getItem('userId'), anonymous: checked })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === false) {
                    toast.error(data.msg, { autoClose: 4000 });
                }
                else {
                    toast.success(data.msg, { autoClose: 4000 });
                    window.location.replace('https://interax.netlify.app/mainLoggedIn/forum');
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log("Error connecting to server");
                toast.error("Error connecting to server", { autoClose: 4000 });
            })
    }

    return <>
        <ToastContainer autoClose={4000} hideProgressBar={true} limit={1} closeButton={true} position={'top-right'}></ToastContainer>
        <div className='linearProgressContainer'>
            {isLoading && <LinearProgress></LinearProgress>}
        </div>
        <div className='forumWrapper'>
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
            <div className='postsWrapper' style={{ backgroundColor: 'rgb(242, 242, 255)' }} >
                <TextField variant='outlined' size='small' sx={{ margin: '0.5em' }} label='Title' value={title} onChange={(e) => { setTitle(e.target.value) }}></TextField>
                <TextField multiline minRows={8} maxRows={8} variant='outlined' size='small' sx={{ margin: '0.5em' }} inputProps={{ style: { fontSize: '0.96rem' } }} label='Body' value={body} onChange={(e) => { setBody(e.target.value) }}></TextField>
                <Select size='small' sx={{ margin: '0.5em', minWidth: "15em", alignSelf: 'center' }} value={category} onChange={(e) => setCategory(e.target.value)} >
                    <MenuItem value={'1st Cat'}>Academics</MenuItem>
                    <MenuItem value={'2nd Cat'}>Placements/Internships</MenuItem>
                    <MenuItem value={'3rd Cat'}>Miscellaneous</MenuItem>
                </Select>
                <div className='anonymousCheckboxWrapper'>
                    <p className='stayAnonymousText'>Stay anonymous: </p>
                    <Checkbox sx={{ margin: '1em' }} onChange={() => setChecked(!checked)} size='small' ></Checkbox>
                </div>
                <div className='buttonWrapper'>
                    <button className='button' style={{ margin: '0em' }} onClick={postForumHandler}><p className='centerText buttonText' >POST</p></button>
                </div>
            </div>
        </div>
    </>
}

export default PostForum;