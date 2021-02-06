import React from 'react';

export default function LandingPage() {
    return <Header/>
}

function Header() {
    return <header>
        <img alt="Code Collab Logo"></img>
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