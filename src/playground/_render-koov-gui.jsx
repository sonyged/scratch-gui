import React from 'react';
import {render} from 'react-dom';

import App from './scratch-koov-gui.jsx';
import styles from './index.css';

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

render(<App />, appTarget);
