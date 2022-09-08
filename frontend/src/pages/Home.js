import React from "react";

const Home = () => {
    document.title = 'Interax'
    return <>
        <div className="backgroundContainer">
            <div className='homeContentContainer'>
                <h1 className="centerText homePageTitle">Welcome !</h1>
                <hr />
                <p className="centerText homePageContent slideInRight">
                    A one stop destination, for all your queries and doubts regarding college
                </p>
                <p className="centerText homePageContent slideInLeft">
                    Ask anything you would like to, read blogs, share materials and resources, and expect answers at the earliest
                </p>
                <p className="centerText homePageContent slideInRightMoreDelay">
                    Be a part of the community and help in sustaining it by answering others queries
                </p>
                <p className="centerText homePageContent slideInLeftDelay2">
                    <a href="/signup" className="getStartedLink">Click to Get Started !</a>
                </p>
            </div>
        </div>
    </>
}

export default Home