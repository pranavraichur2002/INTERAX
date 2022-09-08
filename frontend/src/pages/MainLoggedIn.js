import { useState, useEffect } from 'react';
import '../App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Forum from './Forum';
import PostForum from './PostForum';
import { ToastContainer, toast } from 'react-toastify';
import YourPosts from './YourPosts';
import TopPosts from './TopPosts';
import UserInfo from './UserInfo';

function MainLoggedIn() {
    document.title = 'mainLoggedIn - Interax';
    console.log("mainloggedIn");
    useEffect(() => {
        fetch('https://interax.herokuapp.com/checkAuth', {
            method: "POST",
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    toast.error('Login required', { autoClose: 4000 });
                    window.location.replace('https://interax.netlify.app/login');
                }
            })
            .catch(err => {
                console.log("Error connecting to server");
                toast.error("Error connecting to server", { autoClose: 4000 });
            })
    }, []);

    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path='/mainLoggedIn/forum'>
                        <Forum></Forum>
                    </Route>
                    <Route exact path='/mainLoggedIn/postForum'>
                        <PostForum></PostForum>
                    </Route>
                    <Route exact path='/mainLoggedIn/yourPosts'>
                        <YourPosts></YourPosts>
                    </Route>
                    <Route exact path='/mainLoggedIn/topPosts'>
                        <TopPosts></TopPosts>
                    </Route>
                    <Route exact path='/mainLoggedIn/userInfo'>
                        <UserInfo></UserInfo>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default MainLoggedIn;
