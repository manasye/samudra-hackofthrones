import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import axios from 'axios';
import swal from 'sweetalert';
import $ from 'jquery';

export default class LoginPage extends Component {
    componentDidMount() {
        if (localStorage.getItem('key') !== null) {
            window.location = '/home';
        }
    }

    login = () => {
        const data = {
            password: $('#password-login').val(),
            email: $('#email-login').val()
        };
        axios
            .post('login', data)
            .then(res => {
                localStorage.setItem('key', res.data.result.key);
                localStorage.setItem('username', res.data.result.user.username);
                localStorage.setItem('shop', res.data.result.user.shop);
                window.location = '/home';
            })
            .catch(() => {
                swal('Oops!', 'An error has occured', 'error');
            });
    };

    render() {
        return (
            <div className="login-container">
                <div className="login-box">
                    <h2>Login</h2>
                    <div className="row">
                        <div className="col-3">
                            <h4>Email</h4>
                        </div>
                        <div className="col-9">
                            <input
                                type="text"
                                className="form-control"
                                id="email-login"
                            />
                        </div>
                        <div className="col-3">
                            <h4>Password</h4>
                        </div>
                        <div className="col-9">
                            <input
                                type="password"
                                className="form-control"
                                id="password-login"
                            />
                        </div>
                    </div>
                    <div className="login-submit">
                        <Link to="/register" className="login-to-regis">
                            Register here
                        </Link>
                        <button
                            className="btn btn-primary float-right"
                            onClick={this.login}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
