import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';

export default class SideBar extends Component {
    state = {
        path: window.location.pathname
    };

    componentDidMount() {
        const key = localStorage.getItem('key');
        if (!key) {
            window.location = '/login';
        }
    }

    detectUrlChange = () => {
        this.setState({ path: window.location.pathname });
    };

    showSettings(event) {
        event.preventDefault();
    }

    logout = event => {
        event.preventDefault();
        localStorage.removeItem('key');
        window.location = '/login';
    };

    render() {
        return (
            <div
                className="sidebar-container"
                onClick={() => this.detectUrlChange()}>
                <h1>Samudra</h1>

                <Link to="/home">
                    <div
                        className={
                            this.state.path === '/home'
                                ? 'row active'
                                : 'row inactive'
                        }>
                        <div className="col-2">
                            <i className="fas fa-home" />
                        </div>
                        <div className="col-10">Home</div>
                    </div>
                </Link>
                <Link to="/inventory">
                    <div
                        className={
                            this.state.path === '/inventory'
                                ? 'row active'
                                : 'row inactive'
                        }>
                        <div className="col-2">
                            <i className="fas fa-archive" />
                        </div>
                        <div className="col-10">Inventory</div>
                    </div>
                </Link>
                <Link to="/order">
                    <div
                        className={
                            this.state.path === '/order'
                                ? 'row active'
                                : 'row inactive'
                        }>
                        <div className="col-2">
                            <i className="fas fa-shopping-basket" />
                        </div>
                        <div className="col-10">Order</div>
                    </div>
                </Link>
                <Link to="/chat">
                    <div
                        className={
                            this.state.path === '/chat'
                                ? 'row active'
                                : 'row inactive'
                        }>
                        <div className="col-2">
                            <i className="fas fa-comments" />
                        </div>
                        <div className="col-10">Chat</div>
                    </div>
                </Link>
                <Link to="/" onClick={e => this.logout(e)}>
                    <div className="row logout-nav">
                        <div className="col-2">
                            <i className="fas fa-sign-out-alt" />
                        </div>
                        <div className="col-10">Logout</div>
                    </div>
                </Link>
            </div>
        );
    }
}
