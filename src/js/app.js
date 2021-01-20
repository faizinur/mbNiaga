// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';

// Import Framework7
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7-Redux plugin
import { framework7ReduxPlugin } from 'framework7-redux';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../container/App.jsx';

// Init F7 React Plugin
Framework7.use(Framework7React)

// Init Framework7-Redux plugin
Framework7.use(framework7ReduxPlugin);

// Mount React App
ReactDOM.render(
	React.createElement(App),
	document.getElementById('app'),
);