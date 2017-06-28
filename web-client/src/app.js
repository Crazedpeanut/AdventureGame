import ReactDOM from 'react-dom';
import React from 'react'
import App from './components/app';

if(typeof window !== 'undefined') {
    ReactDOM.render(
        <App></App>,
        document.getElementById('root')
    );
}
