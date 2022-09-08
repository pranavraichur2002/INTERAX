import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import '../index.css'
import LinearProgress from '@mui/material/LinearProgress';

const Login = () => {
    document.title = 'Login - Interax';
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const login = () => {
        if (email === '' || password == '') {
            toast.error('Enter the required fields ', { autoClose: false });
            return;
        }
        setIsLoading(true);
        fetch('https://interax.herokuapp.com/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    toast.success(data.msg, { autoClose: 4000 });
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", data.user.username);
                    localStorage.setItem("email", data.user.email);
                    localStorage.setItem("year", data.user.year);
                    localStorage.setItem("userId", data.user.userId);
                    window.location.replace('https://interax.netlify.app/mainLoggedIn/forum'); // Perform apt redirection
                }
                else {
                    toast.error(data.msg, { autoClose: 4000 });
                }
            })
            .catch(err => {
                setIsLoading(false);
                toast.error("Error connecting to server", { autoClose: 4000 });
            })
    }

    return (
        <>
            <div className="backgroundContainer">
                <ToastContainer autoClose={4000} hideProgressBar={true} limit={1} closeButton={true} position={'top-right'}></ToastContainer>
                <div className='loginContainer'>
                    <div className='loginForm'>
                        <div className='linearProgressLoginContainer'>
                            {isLoading && <LinearProgress></LinearProgress>}
                        </div>
                        <h4 className='centerText'>Login</h4>
                        <TextField size='small' sx={{ margin: '0.5em' }} value={email} label='Email' onChange={(e) => setEmail(e.target.value)}></TextField>
                        <TextField size='small' type='password' sx={{ margin: '0.5em' }} value={password} label='Password' onChange={(e) => setPassword(e.target.value)}></TextField>
                        <div className='buttonWrapper'>
                            <button className='button' onClick={login}><p className='centerText buttonText' >LOGIN</p></button>
                        </div>
                        <p className="centerText homePageContent">
                            <a href="/forgotPassword" className="getStartedLink">Forgot Password ?</a>
                        </p>
                    </div>
                </div >
            </div>
        </>
    )
}


export default Login;
