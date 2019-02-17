import React from 'react';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';

const BlocksOnly = props => (<GUI
    horizontal
    {...props}
/>);

const App = AppStateHOC(HashParserHOC(BlocksOnly));

export default App;
