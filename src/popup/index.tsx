import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "./popup";

function init(){
    const appContainer = document.createElement("div");
    document.body.appendChild(appContainer);
    if(!appContainer){
        throw new Error("Failed to find app container");
    }
    const root = createRoot(appContainer);
    console.log(appContainer);
    root.render(<Popup />);
}