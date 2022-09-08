import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import '../index.css'
import LinearProgress from '@mui/material/LinearProgress';

const ChangePassword = () => {
    document.title = 'Change Password - Interax';
    const [reqId, setReqId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const reqPasswordChange = () => {

        if (reqId === "") {
            toast.error('Enter Request ID', { autoClose: 4000 });
            return;
        }

        if (password.length < 10) {
            toast.error('Password must contain 10 characters at least', { autoClose: 4000 });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords must match', { autoClose: 4000 });
            return;
        }
        setIsLoading(true);
        fetch('https://interax.herokuapp.com/changePassword', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reqId: reqId, password: password, confirmPassword: confirmPassword })
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
                        <h4 className='centerText'>Change Password</h4>
                        <TextField size='small' sx={{ margin: '0.5em' }} value={reqId} label='Request ID' onChange={(e) => setReqId(e.target.value)}></TextField>
                        <TextField size='small' sx={{ margin: '0.5em' }} type='password' value={password} label='Password' onChange={(e) => setPassword(e.target.value)}></TextField>
                        <TextField size='small' sx={{ margin: '0.5em' }} type='password' value={confirmPassword} label='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
                        <div className='buttonWrapper'>
                            <button className='button'><p className='centerText buttonText' onClick={reqPasswordChange}>Change Password</p></button>
                        </div>
                    </div>
                </div >
            </div>
        </>
    )
}


export default ChangePassword;
