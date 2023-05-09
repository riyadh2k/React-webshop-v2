import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.querySelector('#root'));
root.render(
<React.StrictMode>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
</React.StrictMode>
);