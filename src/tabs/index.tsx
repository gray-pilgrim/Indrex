import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import Tabs from "./tabs";


function init(){
    const appContainer = document.createElement("div");
    document.body.appendChild(appContainer);
    if(!appContainer){
        throw new Error("Failed to find app container");
    }
    const root = createRoot(appContainer);
    root.render(<Router><Tabs /></Router>);
}