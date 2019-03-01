import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose} from 'redux';
import editorMessages from 'scratch-l10n/locales/editor-msgs';

import ConnectedIntlProvider from './connected-intl-provider.jsx';
import guiReducer, {guiInitialState, guiMiddleware, initFullScreen, initPlayer} from '../reducers/gui';
import localesReducer, {
    initLocale
    // localesInitialState
} from '../reducers/locales';

import {setPlayer, setFullScreen} from '../reducers/mode.js';

import {ScratchPaintReducer} from 'scratch-paint';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;
const enhancer = composeEnhancers(guiMiddleware);

/*
 * Higher Order Component to provide redux state. If an `intl` prop is provided
 * it will override the internal `intl` redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent) {
    class AppStateWrapper extends React.Component {
        constructor (props) {
            super(props);
            let initializedGui = guiInitialState;
            if (props.isFullScreen) {
                initializedGui = initFullScreen(initializedGui);
            }
            if (props.isPlayerOnly) {
                initializedGui = initPlayer(initializedGui);
            }

            // let initializedLocales = localesInitialState;
            // initial locale getting from KOOV-app via props
            let programLocale = '';
            // let koovLocale = '';

            if (props.programLocale === 'zh') {
                programLocale = 'zh-cn';
            } else {
                programLocale = props.programLocale;
            }

            // if (props.locale === 'ja-furigana') {
            //     koovLocale = 'ja';
            // } else if (props.locale === 'zh') {
            //     koovLocale = 'zh-cn';
            // } else {
            //     koovLocale = props.locale;
            // }

            let initializedLocales = {
                locale: programLocale ? programLocale : 'en',
                messagesByLocale: editorMessages,
                messages: programLocale ? editorMessages[programLocale] : editorMessages.en
            };
            if (window.location.search.indexOf('locale=') !== -1 || window.location.search.indexOf('lang=') !== -1) {
                const locale = window.location.search.match(/(?:locale|lang)=([\w]+)/)[1];
                initializedLocales = initLocale(initializedLocales, locale);
            }

            const reducer = combineReducers({
                locales: localesReducer,
                scratchGui: guiReducer,
                scratchPaint: ScratchPaintReducer
            });
            this.store = createStore(
                reducer,
                {
                    locales: initializedLocales,
                    scratchGui: initializedGui
                },
                enhancer
            );
        }
        componentDidUpdate (prevProps) {
            if (prevProps.isPlayerOnly !== this.props.isPlayerOnly) {
                this.store.dispatch(setPlayer(this.props.isPlayerOnly));
            }
            if (prevProps.isFullScreen !== this.props.isFullScreen) {
                this.store.dispatch(setFullScreen(this.props.isFullScreen));
            }
        }
        render () {
            const {
                isFullScreen, // eslint-disable-line no-unused-vars
                isPlayerOnly, // eslint-disable-line no-unused-vars
                locale, // eslint-disable-line no-unused-vars
                programLocale, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            return (
                <Provider store={this.store}>
                    <ConnectedIntlProvider>
                        <WrappedComponent {...componentProps} />
                    </ConnectedIntlProvider>
                </Provider>
            );
        }
    }
    AppStateWrapper.propTypes = {
        isFullScreen: PropTypes.bool,
        isPlayerOnly: PropTypes.bool,
        locale: PropTypes.string,
        programLocale: PropTypes.string
    };
    return AppStateWrapper;
};

export default AppStateHOC;
