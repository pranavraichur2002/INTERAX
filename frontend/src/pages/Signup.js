import React, { useState } from 'react'
import { TextField, Button } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ToastContainer, toast } from 'react-toastify';
import '../index.css'
import "react-toastify/dist/ReactToastify.css";
import LinearProgress from '@mui/material/LinearProgress';


const Signup = () => {
    document.title = 'Signup - Interax';
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [year, setYear] = useState("1st Year");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const sendCode = () => {
        if (/\S+@\S+\.\S+/.test(email) === false) {
            toast.error('Enter valid email', { autoClose: false });
            return;
        }
        if (email.includes("@rvce.edu.in") == false) {
            toast.error('Use college mail ID only', { autoClose: false });
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
        fetch('https://interax.herokuapp.com/sendCode', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, year: year })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === false) {
                    toast.error(data.msg, { autoClose: 4000 });
                }
                else {
                    toast.success(data.msg, { autoClose: 4000 });
                    setCodeSent(true);
                }
            })
            .catch(err => {
                setIsLoading(false);
                toast.error("Error connecting to server", { autoClose: 4000 });
            })
    }

    const signup = () => {
        if (/\S+@\S+\.\S+/.test(email) === false) {
            toast.error('Enter valid email', { autoClose: false });
            return;
        }
        if (email.includes("@rvce.edu.in") == false) {
            toast.error('Use college mail ID only', { autoClose: false });
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

        if (code === '') {
            toast.error('Enter the code ', { autoClose: false });
            return;
        }

        setIsLoading(true);
        fetch('https://interax.herokuapp.com/signup', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password, email: email, year: year, code: code })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.success === false) {
                    toast.error(data.msg, { autoClose: 4000 });
                }
                else {
                    setPassword('');
                    setEmail('');
                    setYear('1st Year');
                    setCode('');
                    setCodeSent(false);
                    toast.success(data.msg, { autoClose: 4000 });
                }
            })
            .catch(err => {
                setIsLoading(false);
                toast.error("Error connecting to server", { autoClose: 4000 });
            })
    }

    return <>
        <div className="backgroundContainer">
            <ToastContainer autoClose={4000} hideProgressBar={true} limit={1} closeButton={true} position={'top-right'}></ToastContainer>
            <div className='loginContainer'>
                <div className='loginForm'>
                    <div className='linearProgressLoginContainer'>
                        {isLoading && <LinearProgress></LinearProgress>}
                    </div>
                    <h4 className='centerText'>Sign Up</h4>
                    <TextField size='small' sx={{ margin: '0.5em' }} value={email} label='Email' onChange={!codeSent ? (e) => setEmail(e.target.value) : null}></TextField>
                    <TextField size='small' sx={{ margin: '0.5em' }} type='password' value={password} label='Password' onChange={!codeSent ? (e) => setPassword(e.target.value) : null}></TextField>
                    <TextField size='small' sx={{ margin: '0.5em' }} type='password' value={confirmPassword} label='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
                    <Select size='small' sx={{ margin: '0.5em' }} value={year} onChange={!codeSent ? (e) => setYear(e.target.value) : null} >
                        <MenuItem value={'1st Year'}>1st Year</MenuItem>
                        <MenuItem value={'2nd Year'}>2nd Year</MenuItem>
                        <MenuItem value={'3rd Year'}>3rd Year</MenuItem>
                        <MenuItem value={'4th Year'}>4th Year</MenuItem>
                    </Select>
                    <TextField size='small' sx={{ margin: '0.5em' }} value={code} label='Code' onChange={(e) => setCode(e.target.value)}></TextField>
                    <div className='buttonWrapper'>
                        {codeSent === false ?
                            <button className='button' onClick={sendCode} ><p className='centerText buttonText' >SEND CODE</p></button> :
                            <button className='button' onClick={signup} ><p className='centerText buttonText' >SIGN UP</p></button>
                        }

                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Signup