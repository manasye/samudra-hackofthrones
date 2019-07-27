import React, { Component, Fragment } from 'react';
import './UserNavbar.css';
import $ from 'jquery';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

export default class UserNavbar extends Component {
    state = {
        notifs: [
            { message: 'Mengirim pesanan 1' },
            { message: 'Mengirim pesanan 2' }
        ],
        name: localStorage.getItem('username'),
        shopname: localStorage.getItem('shop')
    };

    logout = () => {
        localStorage.removeItem('key');
        window.location = '/login';
    };

    render() {
        return (
            <div className="user-navbar-container">
                <div className="row">
                    <div className="col-7 user-notif">
                        <Tooltip
                            trigger="click"
                            interactive
                            position="bottom"
                            id="tooltip-notif"
                            html={
                                <div className="tooltip-container">
                                    {this.state.notifs.map(notif => (
                                        <Fragment key={notif.message}>
                                            <p>{notif.message}</p>
                                            <hr />
                                        </Fragment>
                                    ))}
                                </div>
                            }>
                            <i
                                className="fas fa-bell"
                                onClick={() => $('#tooltip-notif').click()}
                            />
                        </Tooltip>
                    </div>
                    <div className="col-1">
                        <div className="triangle-bottomright" />
                    </div>
                    <div className="col-4 user-welcome">
                        <div className="row">
                            <div className="col-3">
                                <div
                                    style={{
                                        backgroundImage: `url(${require('../../assets/images/user.png')})`,
                                        width: '3vw',
                                        height: '3vw',
                                        backgroundSize: 'cover'
                                    }}
                                />
                            </div>
                            <div className="col-6">
                                <h4>Hi, {this.state.name}</h4>
                                <h5>{this.state.shopname}</h5>
                            </div>
                            <div className="col-2">
                                <i
                                    className="fas fa-power-off"
                                    onClick={() => this.logout()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
