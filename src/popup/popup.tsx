import React from 'react';
import {createRoot} from 'react-dom/client'
import '../assets/tailwind.css'

const test = (<div>
    <h1 className="text-5xl text-green-500">The Great Extension </h1>
    <img src="Banner.png" alt ="Picture depicting different disabilities"/>
</div>
)

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(test)