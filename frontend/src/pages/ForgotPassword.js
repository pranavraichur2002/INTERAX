import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import '../index.css'
import LinearProgress from '@mui/material/LinearProgress';

const ForgotPassword = () => {
    document.title = 'Forgot Password - Interax'
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMail = () => {

        if (/\S+@\S+\.\S+/.test(email) === false) {
            toast.error('Enter valid email', { autoClose: false });
            return;
        }

        setIsLoading(true);
        fetch('https://interax.herokuapp.com/forgotPassword', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === true) {
                    toast.success(data.msg, { autoClose: 4000 });
                }
                else {
                    toast.error(data.msg, { autoClose: 4000 });
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log("Error connecting to server");
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
                        <h4 className='centerText'>Forgot Password</h4>
                        <TextField size='small' sx={{ margin: '0.5em' }} value={email} label='Email' onChange={(e) => setEmail(e.target.value)}></TextField>
                        <div className='buttonWrapper'>
                            <button className='button'><p className='centerText buttonText' onClick={sendMail}>SEND MAIL</p></button>
                        </div>
                    </div>
                </div >
            </div>
        </>
    )
}


export default ForgotPassword;
