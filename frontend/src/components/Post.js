import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import ModalComponent from "./ModalComponent";
import { ToastContainer, toast } from 'react-toastify';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import Linkify from 'react-linkify'

const findUserId = (upvotes, username) => {
    for (let i = 0; i < upvotes.length; i++) {
        if (upvotes[i] === username) {
            return i;
        }
    }
    return -1;
}

const Post = ({ title, body, username, email, answers, id, year, postId, category, yourPostsFlag, upvotes, time, forumUpdate, setForumUpdate, yourPostsUpdate, setYourPostsUpdate }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [answerBody, setAnswerBody] = useState('');
    const [postUpdate, setPostUpdate] = useState(false);

    const postUpvote = () => {
        fetch('https://interax.herokuapp.com/upvote', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ category: category, username: localStorage.getItem('username'), email: localStorage.getItem('email'), year: localStorage.getItem('year'), userId: localStorage.getItem('userId'), postId: postId }) // CHANGE THIS 
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    toast.error(data.msg, { autoClose: 4000 });
                }
                else {
                    if (data.msg === "Post upvoted") {
                        setForumUpdate(!forumUpdate);
                        setPostUpdate(!postUpdate);
                    }
                    toast.success(data.msg, { autoClose: 4000 });
                }
            })
    }

    const deletePost = () => {
        fetch('https://interax.herokuapp.com/deletePost', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ category: category, username: localStorage.getItem('username'), email: localStorage.getItem('email'), year: localStorage.getItem('year'), userId: localStorage.getItem('userId'), postId: postId }) // CHANGE THIS 
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) {
                    toast.error(data.msg, { autoClose: 4000 });
                }
                else {
                    if (data.msg === "Post deleted") {
                        setYourPostsUpdate(!yourPostsUpdate);
                    }
                    toast.success(data.msg, { autoClose: 4000 });
                }
            })
    }

    return <>
        <Grid container>
            <Grid item xs={12}>
                <ModalComponent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} title={title} body={body} answerBody={answerBody} setAnswerBody={setAnswerBody} id={id} postId={postId} category={category} />
                <div className="postWrapper">
                    <div className='titleWrapper'>
                        <h4 className="title">{title}</h4>
                        <p className="time">{time}</p>
                        <hr />
                        {yourPostsFlag && <p className="askedInCat">Asked in {category === '1st Cat' ? 'Academics' : (category === '2nd Cat' ? 'Placements/Internships' : 'Miscellaneous')}</p>}
                    </div>
                    <div className='bodyWrapper'>
                        <Linkify>
                            <pre>
                                {body}
                            </pre>
                        </Linkify>
                    </div>
                    <div className="emailWrapper">
                        <p className="bold">Posted By: {username} {`(${year})`}</p>
                        <div className="answerButtonWrapper">
                            <button onClick={postUpvote} className={(findUserId(upvotes, localStorage.getItem('username')) !== -1) ? 'upvotedButton' : 'button upvoteButton'} style={{ margin: '0 0.4em' }}>
                                <p className='centerText buttonText' >
                                    <ThumbUpOffAltIcon sx={{ marginTop: '-0.08em' }} />
                                </p>
                                <div>
                                    <p className="upvotesText">{upvotes.length}</p>
                                </div>
                            </button>
                            {yourPostsFlag ?
                                <button className='button upvoteButton' style={{ margin: '0 0.4em' }} onClick={() => deletePost()} ><p className='centerText buttonText' ><DeleteIcon sx={{ marginTop: '-0.08em' }} /></p></button>
                                :
                                <button className='button' style={{ margin: '0 0.4em' }} onClick={() => setIsModalOpen(true)} ><p className='centerText buttonText' >REPLY</p></button>
                            }
                        </div>

                    </div>
                    {answers.length > 0 &&
                        <div className="answersWrapper">
                            {answers.map((answer, index) => {
                                return <div key={index} className="answerWrapper">
                                    <p style={{ margin: '0em', padding: '0em' }}>
                                        <pre style={{ padding: '0em', margin: '0.2em' }}>
                                            <Linkify>{answer.answer}</Linkify>
                                        </pre>
                                    </p>
                                    <p className="bold">- {answer.username}</p>
                                    <hr />
                                </div>
                            })}
                        </div>
                    }
                </div>
            </Grid>
        </Grid>
    </>
}

export default Post;