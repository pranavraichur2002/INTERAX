import React, { useEffect, useState } from 'react'
import { TextField, Button, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Post from '../components/Post';
import NavbarForum from '../components/NavbarForum';
import '../index.css';
import LinearProgress from '@mui/material/LinearProgress';
import LogoutIcon from '@mui/icons-material/Logout';
import Logout from '../utils/Logout'
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TOP_QUESTIONS_LIMIT = 2;

const TopPosts = () => {
    document.title = 'Top Posts - Interax';
    const [category, setCategory] = useState('1st Cat');
    const [posts, setPosts] = useState([]);
    const [posts1, setPosts1] = useState([]);
    const [posts2, setPosts2] = useState([]);
    const [posts3, setPosts3] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
                    window.location.replace('https://interax.netlify.app/login');
                }
                console.log("topposts data ", data.posts);
                let topPosts = [[], [], []], temp = [[], [], []];
                for (let i = 0; i < data.posts[0].length; i++) {
                    topPosts[0].push([data.posts[0][i].upvotes.length, data.posts[0][i]]);
                }
                for (let i = 0; i < data.posts[1].length; i++) {
                    topPosts[1].push([data.posts[1][i].upvotes.length, data.posts[1][i]]);
                }

                for (let i = 0; i < data.posts[2].length; i++) {
                    topPosts[2].push([data.posts[2][i].upvotes.length, data.posts[2][i]]);
                }
                topPosts[0].sort();
                topPosts[0].reverse();
                topPosts[1].sort();
                topPosts[1].reverse();
                topPosts[2].sort();
                topPosts[2].reverse();

                console.log("top posts ", topPosts);
                console.log("length ", topPosts[2].length);
                if (topPosts[0].length > TOP_QUESTIONS_LIMIT) {
                    topPosts[0].splice(TOP_QUESTIONS_LIMIT, topPosts[0].length - TOP_QUESTIONS_LIMIT);
                }
                if (topPosts[1].length > TOP_QUESTIONS_LIMIT) {
                    topPosts[1].splice(TOP_QUESTIONS_LIMIT, topPosts[1].length - TOP_QUESTIONS_LIMIT);
                }
                if (topPosts[2].length > TOP_QUESTIONS_LIMIT) {
                    topPosts[2].splice(TOP_QUESTIONS_LIMIT, topPosts[2].length - TOP_QUESTIONS_LIMIT);
                }
                for (let i = 0; i < topPosts[0].length; i++) {
                    temp[0].push(topPosts[0][i][1]);
                }
                for (let i = 0; i < topPosts[1].length; i++) {
                    temp[1].push(topPosts[1][i][1]);
                }
                for (let i = 0; i < topPosts[2].length; i++) {
                    temp[2].push(topPosts[2][i][1]);
                }
                setPosts1(temp[0]);
                setPosts2(temp[1]);
                setPosts3(temp[2]);
            })
            .catch(err => {
                setIsLoading(false);
                console.log("Error connecting to server");
                toast.error("Error connecting to server", { autoClose: 4000 });
            })
    }, []);

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
                            return <Post key={index} title={post.title} year={post.year} body={post.body} username={post.username} email={post.email} answers={post.answers} postId={post.postId} id={post._id} category={post.category} upvotes={post.upvotes} time={post.time} />
                        })
                    }
                </div>
            }
            {category === '2nd Cat' &&
                <div className='postsWrapper'>
                    {posts2.length === 0 && <p className='centerText' style={{ fontSize: '1.2rem' }}>No posts yet</p>}
                    {
                        posts2.map((post, index) => {
                            return <Post key={index} title={post.title} year={post.year} body={post.body} username={post.username} email={post.email} answers={post.answers} postId={post.postId} id={post._id} category={post.category} upvotes={post.upvotes} time={post.time} />
                        })
                    }
                </div>
            }
            {category === '3rd Cat' &&
                <div className='postsWrapper'>
                    {posts3.length === 0 && <p className='centerText' style={{ fontSize: '1.2rem' }}>No posts yet</p>}
                    {
                        posts3.map((post, index) => {
                            return <Post key={index} title={post.title} year={post.year} body={post.body} username={post.username} email={post.email} answers={post.answers} postId={post.postId} id={post._id} category={post.category} upvotes={post.upvotes} time={post.time} />
                        })
                    }
                </div>
            }
        </div>
    </>
}

export default TopPosts