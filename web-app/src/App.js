import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

// import page
import HomePage from './containers/HomePage/HomePage';
import ChatPage from './containers/ChatPage/ChatPage';
import InventoryPage from './containers/InventoryPage/InventoryPage';
import OrderPage from './containers/OrderPage/OrderPage';
import LoginPage from './containers/LoginPage/LoginPage';
import RegisterPage from './containers/RegisterPage/RegisterPage';
import PaymentPage from './containers/PaymentPage/PaymentPage';

// import sidebar
import SideBar from './components/SideBar/SideBar';

// import user navbar
import UserNavBar from './components/UserNavbar/UserNavbar';

class App extends Component {
    state = {
        path: window.location.pathname
    };

    render() {
        return (
            <Router>
                <Fragment>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route exact path="/payment/:transactionId" component={PaymentPage} />

                    {this.state.path !== '/login' &&
                    this.state.path !== '/register' &&
                    this.state.path.search('payment') === -1 ? (
                        <div className="row">
                            <div className="col-3 sidebar-column">
                                <SideBar />
                            </div>

                            <div className="col-9 main-column">
                                <UserNavBar />
                                <Route exact path="/" component={HomePage} />
                                <Route
                                    exact
                                    path="/home"
                                    component={HomePage}
                                />
                                <Route
                                    exact
                                    path="/chat"
                                    component={ChatPage}
                                />
                                <Route
                                    exact
                                    path="/inventory"
                                    component={InventoryPage}
                                />
                                <Route
                                    exact
                                    path="/order"
                                    component={OrderPage}
                                />
                            </div>
                        </div>
                    ) : null}
                </Fragment>
            </Router>
        );
    }
}

export default App;
