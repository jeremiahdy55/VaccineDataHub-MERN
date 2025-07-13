import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"
import App from "./app/app.js"
import * as ReactDOM from "react-dom/client"
import { Provider } from "react-redux";
import store from './app/ReduxStore/store';
import './app/app.css'

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}> 
        <App/>
    </Provider>
)
