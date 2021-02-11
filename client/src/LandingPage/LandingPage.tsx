import './LandingPage.scss'

import React, {MouseEvent} from 'react';

function Header() {
    const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Log In");
    }

    return <header className="flex-container">
        <div className="logo-and-title">
            <img className="logo" src="./img/logo.png" alt="Code Collab Logo"></img>
        </div>
        <div className="big-nav">
            <nav>
                <ul>
                    <li>HOME</li>
                    <li>FEATURES</li>
                    <li>ABOUT US</li>
                    <li>CONTACT US</li>
                </ul>
            </nav>
        </div>
        <button aria-label="log in button" onClick={handleOnClick}>LOG IN</button>
        <div className="hamburger-menu">
            <img></img>
        </div>
    </header>
}

function Main() {
    const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Sign Up");
    }

    return <main>
        <section className="flex-container landing-section">
            <div className="row1 block">
                <h1>Code Your Scripts Together</h1>
                <p>Create programming scripts that you can share with others and work together on.</p>
                <button onClick={handleOnClick}>CREATE ACCOUNT</button>
            </div>
            <div className="row2">
                <img src="./img/landingComputerImg.jpg" aria-hidden="true"></img>
            </div>
        </section>
        <section className="flex-container landing-section">
            <div className="row1">
                <img src="./img/landingImg1.png" aria-hidden="true"></img>
            </div>
            <div className="row2 block">
                <h1>Collaborate &#38; Share with your Teammates Across the Web</h1>
                <p>
                    CodeCollab is an online code editor that uses cloud storage to store your programming 
                    scripts online and allow you to share it with others so that you can work together on 
                    the same script. Its secure connection allows you to work with others with low latency 
                    and you can continue working even while you’re disconnected from the internet. 
                </p>
            </div>
        </section>
        <section className="flex-container landing-section">
            <div className="row1 block">
                <h1>Working Remotely Has Never Been Easier</h1>
                <p>
                    CodeCollab provides support for many different programming languages including:
                </p>
                <ul>
                    <li>Python</li>
                    <li>C#</li>
                    <li>Java</li>
                    <li>JavaScript</li>
                </ul>
            </div>
            <div className="row2">
                <img src="./img/landingImg2.png" aria-hidden="true"></img>
            </div>
        </section>
    </main>
}

function Footer() {
    return <footer>
        <p>&copy; CodeCollab 2021 by Khoa Luong, Thomas That, Nam Pham, and Hao Chen</p>
    </footer>
}

export default function LandingPage() {
    return <>
        <Header/>
        <Main />
        <Footer />
    </>
}
