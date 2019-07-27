import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import './RegisterPage.css';

class RegisterPage extends Component {
    componentDidMount = () => {
        if (localStorage.getItem('key') !== null) {
            window.location = '/home';
        }
    };

    register = () => {
        const data = {
            username: $('#user-regis').val(),
            password: $('#password-regis').val(),
            email: $('#email-regis').val(),
            shop: $('#shop-regis').val()
        };
        axios
            .post('register', data)
            .then(res => {
                localStorage.setItem('key', res.data.result.key);
                localStorage.setItem('username', res.data.result.user.username);
                localStorage.setItem('shop', res.data.result.user.shop);
                this.props.history.push('/home');
                window.location.reload(true);
            })
            .catch(err => {
                swal('Oops!', 'An error has occured', 'error');
            });
    };

    render() {
        return (
            <div className="register-container">
                <div className="register-box">
                    <h2>Register</h2>
                    <div className="row">
                        <div className="col-3">
                            <h4>Username</h4>
                        </div>
                        <div className="col-9">
                            <input
                                type="text"
                                className="form-control"
                                id="user-regis"
                            />
                        </div>
                        <div className="col-3">
                            <h4>Password</h4>
                        </div>
                        <div className="col-9">
                            <input
                                type="password"
                                className="form-control"
                                id="password-regis"
                            />
                        </div>
                        <div className="col-3">
                            <h4>Email</h4>
                        </div>
                        <div className="col-9">
                            <input
                                type="text"
                                className="form-control"
                                id="email-regis"
                            />
                        </div>
                        <div className="col-3">
                            <h4>Shop Name</h4>
                        </div>
                        <div className="col-9">
                            <input
                                type="text"
                                className="form-control"
                                id="shop-regis"
                            />
                        </div>
                    </div>
                    <div className="register-submit">
                        <Link to="/login" className="login-to-regis">
                            Already have account?
                        </Link>
                        <button
                            className="btn btn-primary float-right"
                            onClick={this.register}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(RegisterPage);
