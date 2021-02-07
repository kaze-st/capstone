import React, {MouseEvent} from 'react';

const LOGO_PATH = "../../public/favicon.ico"


function Header() {
    const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Log In");
    }

    return <header>
        <img src="./favicon.ico" alt="Code Collab Logo"></img>
        <p>CodeCollab</p>
        <nav>
            <ul>
                <li>HOME</li>
                <li>FEATURES</li>
                <li>ABOUT US</li>
                <li>CONTACT US</li>
            </ul>
        </nav>
        <button aria-label="log in button" onClick={handleOnClick}>LOG IN</button>
    </header>
}

function Main() {
    const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Sign Up");
    }

    return <main>
        <section className="flex-container">
            <div className="row1">
                <h1>Code Your Scripts Together</h1>
                <p>Create programming scripts that you can share with others and work together on.</p>
                <button onClick={handleOnClick}>CREATE ACCOUNT</button>
            </div>
            <div className="row2">
                <img src="" aria-hidden="true"></img>
            </div>
        </section>
        <section className="flex-container">
            <div className="row1">
                <img src="" aria-hidden="true"></img>
            </div>
            <div className="row2">
                <h1>Collaborate &#38; Share with your Teammates Across the Web</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Neque convallis a cras 
                    semper auctor neque vitae. Libero volutpat sed cras ornare arcu dui. Vitae 
                    tempus quam pellentesque nec nam aliquam. Odio aenean sed adipiscing diam donec 
                    adipiscing tristique. 
                </p>
            </div>
        </section>
        <section className="flex-container">
            <div className="row1">
                <h1>Working Remotely Has Never Been Easier</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua.
                </p>
                <ul>
                    <li>Item 1</li>
                    <li>item 2</li>
                    <li>item 3</li>
                    <li>item 4</li>
                </ul>
            </div>
            <div className="row2">
                <img src="" aria-hidden="true"></img>
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