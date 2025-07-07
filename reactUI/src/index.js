import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"
import App from "./app/app"
import * as ReactDOM from "react-dom/client"
import { Provider } from "react-redux";
// import store from "./app/State/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    // <Provider store={null}> 
        <App/>
    // </Provider>
)
