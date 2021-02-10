import React, {MouseEvent} from 'react';
import { Link } from 'react-router-dom';


function Header() {

    return <header className="flex-container">
        <div className="logo-and-title">
            <img className="logo" src="./img/logo.png" alt="Code Collab Logo"></img>
        </div>
        <nav>
            <ul>
                <li>HOME</li>
                <li>FEATURES</li>
                <li>ABOUT US</li>
                <li>CONTACT US</li>
            </ul>
        </nav>
        <Link to="/login">
            <button aria-label="log in button">LOG IN</button>
        </Link>
        
    </header>
}

function Main() {
    return <main>
        <section className="flex-container landing-section">
            <div className="row1">
                <h1>Code Your Scripts Together</h1>
                <p>Create programming scripts that you can share with others and work together on.</p>
                <Link to="/register">
                    <button>CREATE ACCOUNT</button>
                </Link>
            </div>
            <div className="row2">
                <img src="./img/landingComputerImg.jpg" aria-hidden="true"></img>
            </div>
        </section>
        <section className="flex-container landing-section">
            <div className="row1">
                <img src="./img/landingImg1.png" aria-hidden="true"></img>
            </div>
            <div className="row2">
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
            <div className="row1">
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
        <div className="page-wrapper">
            <Header/>
            <Main />
            <Footer />
        </div>
    </>
}
