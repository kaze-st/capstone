import React from 'react';

const LOGO_PATH = "../../public/favicon.ico"


function Header() {
    return <header>
        <img src="./favicon.ico" alt="Code Collab Logo"></img>
        <h1>CodeCollab</h1>
        <nav>
            <ul>
                <li>HOME</li>
                <li>FEATURES</li>
                <li>ABOUT US</li>
                <li>CONTACT US</li>
            </ul>
        </nav>
        <button aria-label="log in button">LOG IN</button>
    </header>
}

function Main() {
    return <main>
        <section>
            
        </section>
        <section>

        </section>
        <section>

        </section>
    </main>
}

function Footer() {
    return <footer>
        <p>© CodeCollab 2021 by Khoa Luong, Thomas That, Nam Pham, and Hao Chen</p>
    </footer>
}

export default function LandingPage() {
    return <>
        <Header/>
        <Main />
        <Footer />
    </>
}