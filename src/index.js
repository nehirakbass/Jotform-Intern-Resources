import React from 'react';
import ReactDOM from 'react-dom';
import Container from './Container'
import { Provider } from 'react-redux'
import store from './Redux/Store'
import './index.css'
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
    <Provider store={store}>
        <Container />
    </Provider>,
    document.getElementById('root'));