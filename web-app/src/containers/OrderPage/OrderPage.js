import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import swal from 'sweetalert';
import moment from 'moment';

import Modal from 'react-responsive-modal';
import './OrderPage.css'
export default class OrderPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            perPage: 10,
            maxPage: 1,
            transactions: [],
            activeTransaction: {},
            showDeleteModal: false,
            showResiModal: false,
            trackingId: '',
        }
    }

    componentDidMount() {
        this.fetchContent();
    }

    fetchContent = () => {
        axios
            .get(
                `transaction/page/${this.state.page}/${this.state.perPage}`,
                this.generateConfig()
            )
            .then(res => {
                this.setState({
                    transactions: res.data.result,
                    maxPage: Math.ceil(res.data.count / this.state.perPage)
                })
            })
            .catch(() => {});
    };

    addResi = (transaction, resi) => {
        axios
            .post(
                `transaction/update/${transaction.id}`, {
                    status: 'Delivered',
                    address: transaction.address,
                    buyer_name: transaction.buyer_name,
                    total_price: transaction.total_price,
                    tracking: resi,
                }, this.generateConfig()
            )
            .then(() => {
                swal('Success', 'Tracking Id Updated', 'success');
                this.fetchContent();
            })
    }

    cancelTransaction = (transaction) => {
        axios
            .post(
                `transaction/update/${transaction.id}`,
                {
                    status: 'Cancelled',
                    address: transaction.address,
                    buyer_name: transaction.buyer_name,
                    total_price: transaction.total_price,
                    tracking: transaction.tracking,
                },
                this.generateConfig()
            )
            .then(() => {
                swal('Success', 'Transaction Successfully Cancelled', 'success');
                this.fetchContent();
            })
    }

    generateConfig() {
        return {
            headers: {
                Authorization: 'bearer ' + localStorage.getItem('key')
            }
        };
    }

    renderRow(data, i) {
        let badge;

        switch (data.status) {
            case "Ordered":
                badge = <span className="badge badge-secondary">Ordered</span>;
                break;
            case "Paid":
                badge = <span className="badge badge-primary">Paid</span>;
                break;
            case "Delivered":
                badge = <span className="badge badge-success">Delivered</span>;
                break;
            case "Cancelled":
                badge = <span className="badge badge-danger">Cancelled</span>;
                break;
            default:
                badge = <span className="badge badge-danger">Error</span>;
        }

        return (
            <tr key={i}>
                <td>{(this.state.page - 1) * this.state.perPage + i + 1}</td>
                <td>{data.buyer_name}</td>
                <td>{data.address}</td>
                <td>
                    {data.items.map((item, idx) => (
                        <p key={idx} style={{marginBottom: '0'}}>{item.item.name} x{item.qty}</p>
                    ))}
                </td>
                <td>{`Rp ${data.total_price}`}</td>
                <td className="text-center">{moment(data.created_at).format('DD-MMM-YY')}</td>
                <td className="text-center">{moment(data.updated_at).format('DD-MMM-YY')}</td>
                <td className="text-center">{badge}</td>
                <td className="text-center">
                {
                    data.status === 'Paid' ? (
                        <i className="fas fa-edit" onClick={() => this.onEditButtonClick(data)}/>
                    ) : ''
                }
                {' '}
                {
                    data.status !== 'Cancelled' && data.status !== 'Delivered' ? (
                        <i className="fas fa-ban" style={{color: "red"}} onClick={() => this.onDeleteButtonClick(data)}/>
                    ) : ''
                }
                </td>
            </tr>
        );
    }

    renderRows() {
        if (this.state.transactions.length === 0) {
            return (
                <tr>
                    <td className="text-center" colSpan={9}>
                        No Data
                    </td>
                </tr>
            )
        }

        const rows = [];
        for (let i = 0; i < this.state.transactions.length; i++) {
            rows.push(this.renderRow(this.state.transactions[i], i));
        }

        return rows;
    }

    filterOrders = () => {
        if ($('#search-input-order').val() === '') {
            this.fetchContent();
        } else {
            const filteredTransactions = this.state.transactions.filter(transaction => {
                for (let i = 0; i < transaction.items.length; i++) {
                    if (transaction.items[i].item.name.toLowerCase().search(
                        $('#search-input-order')
                            .val()
                            .toLowerCase()
                    ) !== -1) {
                        return true;
                    }
                }

                return (
                    transaction.buyer_name.toLowerCase().search(
                        $('#search-input-order')
                            .val()
                            .toLowerCase()
                    ) !== -1 ||
                    transaction.address.toLowerCase().search(
                        $('#search-input-order')
                            .val()
                            .toLowerCase()
                    ) !== -1 ||
                    transaction.status.toLowerCase().search(
                        $('#search-input-order')
                            .val()
                            .toLowerCase()
                    ) !== -1
                );
            });
            this.setState({ transactions: filteredTransactions });
        }
    };

    changePagination(page) {
        this.setState({page}, () => this.fetchContent());
    }

    onDeleteButtonClick(id) {
        this.setState({
            activeTransaction: id,
            showDeleteModal: true,
        });
    }

    onCloseDeleteModal() {
        this.setState({
            activeTransaction: {},
            showDeleteModal: false,
        });
    }

    onDeleteConfirmYes(id) {
        this.cancelTransaction(this.state.activeTransaction);
        this.setState({
            activeTransaction: {},
            showDeleteModal: false,
        })
    }

    onDeleteConfirmNo() {
        this.setState({
            activeTransaction: {},
            showDeleteModal: false,
        })
    }

    onEditButtonClick(id) {
        this.setState({
            activeTransaction: id,
            showResiModal: true,
        })
    }

    onTrackingIdChange(e) {
        this.setState({
            trackingId: e.target.value,
        })
    }

    onCloseResiModal() {
        this.setState({
            activeTransaction: {},
            showResiModal: false,
        })
    }

    onResiSubmit() {
        this.addResi(this.state.activeTransaction, this.state.trackingId);
        this.setState({
            activeTransaction: {},
            showResiModal: false,
        })
    }

    onResiCancel() {
        this.setState({
            activeTransaction: {},
            showResiModal: false,
        })
    }

    render() {
        return (
            <div className="order-container">
                <div className="row">
                    <div className="offset-6 col-6">
                        <input
                            type="text"
                            className="form-control search-order"
                            id="search-input-order"
                            placeholder="Search here..."
                            onChange={() => {
                                this.filterOrders()
                            }}
                        />
                    </div>
                </div>
                <table className="table table-hover table-order">
                    <thead>
                        <tr className="text-center">
                            <th scope="col" width="5%">No</th>
                            <th scope="col" width="10%">Name</th>
                            <th scope="col" width="20%">Address</th>
                            <th scope="col" width="25%">Products Purchased</th>
                            <th scope="col" width="10%">Total</th>
                            <th scope="col" width="9%">Created At</th>
                            <th scope="col" width="10%">Updated At</th>
                            <th scope="col" width="5%">Status</th>
                            <th scope="col" width="6%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderRows() }
                    </tbody>
                </table>

                <nav aria-label="Page navigation example">
                    <ul className="pagination float-right">
                        {this.state.page !== 1 ? (
                            <li
                                className="page-item"
                                onClick={() =>
                                    this.changePagination(this.state.page - 1)
                                }>
                                <p className="page-link">
                                    {this.state.page - 1}
                                </p>
                            </li>
                        ) : null}

                        <li className="page-item active">
                            <p className="page-link">{this.state.page}</p>
                        </li>

                        {this.state.page !== this.state.maxPage ? (
                            <li
                                className="page-item"
                                onClick={() =>
                                    this.changePagination(this.state.page + 1)
                                }>
                                <p className="page-link">
                                    {this.state.page + 1}
                                </p>
                            </li>
                        ) : null}
                    </ul>
                </nav>
                <Modal
                    open={this.state.showDeleteModal}
                    onClose={() => this.onCloseDeleteModal()}
                    closeOnEsc
                    center
                    showCloseIcon={false}
                >
                    <h2>Are you sure to cancel this transaction?</h2>
                    <br/>
                    <button className="btn btn-danger btn-block" onClick={() => this.onDeleteConfirmYes()}>Yes</button>
                    <button className="btn btn-secondary btn-block" onClick={() => this.onDeleteConfirmNo()}>No</button>
                </Modal>
                <Modal
                    open={this.state.showResiModal}
                    onClose={() => this.onCloseResiModal()}
                    closeOnEsc
                    center
                    showCloseIcon={false}
                >
                    <h2>Input Tracking Number</h2>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Tracking Id"
                        value={this.state.trackingId}
                        onChange={(e) => this.onTrackingIdChange(e)}
                    />
                    <br/>
                    <button className="btn btn-primary btn-block" onClick={() => this.onResiSubmit()}>Submit</button>
                    <button className="btn btn-secondary btn-block" onClick={() => this.onResiCancel()}>Cancel</button>
                </Modal>

            </div>
        );
    }
}
