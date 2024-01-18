import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../tabs/components/About';
import Homme from '../tabs/components/Home';

function Tabs(){
    return(
        <div>
            <ul>
                <li>
                    <a href="#/"> Home </a>
                </li>
                <li>
                    <a href="#/about"> About </a>
                </li>
            </ul>
            <Routes>
                <Route path="/"element={<Homme />} />
                <Route index element={<About />} />
            </Routes>
        </div> 
    )
}

export default Tabs;