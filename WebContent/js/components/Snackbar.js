/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright IBM Corporation 2016, 2019
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { List } from 'immutable';
import { popMessage } from '../actions/snackbarNotifications';

class AtlasSnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeout: 0,
            open: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { snackbarNotificationsMessages } = this.props;
        this.registerMessageWithSnackbar = this.registerMessageWithSnackbar.bind(this);
        if (nextProps.snackbarNotificationsMessages.first() &&
            snackbarNotificationsMessages.first() !== nextProps.snackbarNotificationsMessages.first()) {
            this.registerMessageWithSnackbar();
        }
    }

    componentWillUnmount() {
        this.state.timeout = clearTimeout(this.state.timeout);
    }

    registerMessageWithSnackbar() {
        const { dispatch } = this.props;
        this.setState({ open: true });
        this.state.timeout = setTimeout(() => {
            dispatch(popMessage());
            this.setState({ open: false });
        }, 4000);
    }

    handleRequestClose = () => {
        const { dispatch } = this.props;
        this.state.timeout = clearTimeout(this.state.timeout);
        this.setState({ open: false });
        dispatch(popMessage());
    }

    render() {
        const { snackbarNotificationsMessages } = this.props;
        if (snackbarNotificationsMessages.size > 0) {
            const message = snackbarNotificationsMessages.first();
            let messageText = message.get('message');
            const messageAction = message.get('action');
            if (messageAction) {
                messageText = <a onClick={() => { messageAction(); }}>{messageText}</a>;
            }
            return (
                <Snackbar
                    message={messageText}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                />
            );
        }
        return null;
    }
}

AtlasSnackbar.propTypes = {
    snackbarNotificationsMessages: PropTypes.instanceOf(List).isRequired,
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        snackbarNotificationsMessages: state.get('snackbarNotifications').get('messages'),
    };
}

const ConnectedSnackbar = connect(mapStateToProps)(AtlasSnackbar);
export default ConnectedSnackbar;
