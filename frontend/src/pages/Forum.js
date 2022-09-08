import React, { useEffect, useState } from 'react'
import { TextField, Button, Grid } from '@mui/material';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Post from '../components/Post';
import NavbarForum from '../components/NavbarForum';
import '../index.css'
import LinearProgress from '@mui/material/LinearProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import Logout from '../utils/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Forum = () => {
    document.title = 'Forum - Interax';
    const [category, setCategory] = useState('1st Cat');
    const [posts, setPosts] = useState([]);
    const [posts1, setPosts1] = useState([]);
    const [posts2, setPosts2] = useState([]);
    const [posts3, setPosts3] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [forumUpdate, setForumUpdate] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch('https://interax.herokuapp.com/forum', {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === false) {
                    toast.error(data.msg, { autoClose: 4000 });
                    window.location.replace('http://localhost:3000/login');
                }
                data.posts[0].reverse();
                data.posts[1].reverse();
                data.posts[2].reverse();
                setPosts1(data.posts[0]);
                setPosts2(data.posts[1]);
                setPosts3(data.posts[2]);
            })
            .catch(err => {
                setIsLoading(false);
                console.log("Error connecting to server");
                toast.error("Error connecting to server", { autoClose: 4000 });
            })
    }, [forumUpdate]);

    return <>
        <ToastContainer autoClose={4000} hideProgressBar={true} limit={1} closeButton={true} position={'top-right'}></ToastContainer>
        <div className='linearProgressContainer'>
            {isLoading && <LinearProgress></LinearProgress>}
        </div>
        <div className='forumWrapper'>
            <NavbarForum />
            <button style={{ margin: '0.4em', width: '3em' }} className={`button`} onClick={() => setForumUpdate(!forumUpdate)} ><RefreshIcon sx={{ margin: '-0.35em' }} /></button>
            <button style={{ margin: '0.4em', width: '3em' }} className='button' onClick={() => { Logout() }}><LogoutIcon sx={{ margin: '-0.35em' }} /></button>
            <Link to='/mainLoggedIn/userInfo' style={{ textDecoration: 'none', color: '#82009c' }}>
                <div className='loggedInAsTextContainer' style={{ display: 'inline', float: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <AccountCircleIcon sx={{ margin: '0.075em 0' }} /><p className='loggedInAsText'>{localStorage.getItem('username')}</p>
                    </div>
                </div>
            </Link>
            <hr />
            <div className='categoriesWrapper'>
                <Grid container sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Grid item md={4} sm={4} xs={12}>
                        <h4 onClick={() => setCategory('1st Cat')} className={`centerText category ${category === '1st Cat' ? 'selectedCategory' : null}`}>Academics</h4>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                        <h4 onClick={() => setCategory('2nd Cat')} className={`centerText category ${category === '2nd Cat' ? 'selectedCategory' : null}`}>Placements/Internships</h4>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                        <h4 onClick={() => setCategory('3rd Cat')} className={`centerText category ${category === '3rd Cat' ? 'selectedCategory' : null}`}>Miscellaneous</h4>
                    </Grid>
                </Grid>
            </div>
            {category === '1st Cat' &&
                <div className='postsWrapper'>
                    {posts1.length === 0 && <p className='centerText' style={{ fontSize: '1.2rem' }}>No posts yet</p>}
                    {
                        posts1.map((post, index) => {
                            return <Post key={index} title={post.title} year={post.year} body={post.body} username={post.username} email={post.email} answers={post.answers} postId={post.postId} id={post._id} category={post.category} upvotes={post.upvotes} time={post.time} forumUpdate={forumUpdate} setForumUpdate={setForumUpdate} />
                        })
                    }
                </div>
            }
            {category === '2nd Cat' &&
                <div className='postsWrapper'>
                    {posts2.length === 0 && <p className='centerText' style={{ fontSize: '1.2rem' }}>No posts yet</p>}
                    {
                        posts2.map((post, index) => {
                            return <Post key={index} title={post.title} year={post.year} body={post.body} username={post.username} email={post.email} answers={post.answers} postId={post.postId} id={post._id} category={post.category} upvotes={post.upvotes} time={post.time} forumUpdate={forumUpdate} setForumUpdate={setForumUpdate} />
                        })
                    }
                </div>
            }
            {category === '3rd Cat' &&
                <div className='postsWrapper'>
                    {posts3.length === 0 && <p className='centerText' style={{ fontSize: '1.2rem' }}>No posts yet</p>}
                    {
                        posts3.map((post, index) => {
                            return <Post key={index} title={post.title} year={post.year} body={post.body} username={post.username} email={post.email} answers={post.answers} postId={post.postId} id={post._id} category={post.category} upvotes={post.upvotes} time={post.time} forumUpdate={forumUpdate} setForumUpdate={setForumUpdate} />
                        })
                    }
                </div>
            }
        </div>
    </>
}

export default Forum