import React, { Component } from 'react';
import './InventoryPage.css';
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';

import Modal from 'react-responsive-modal';

export default class InventoryPage extends Component {
    state = {
        inventories: [],
        openPreviewAdd: false,
        openPreviewEdit: false,
        page: 1,
        maxPage: 0,
        perPage: 10,
        inventorySelected: {}
    };

    componentDidMount() {
        this.fetchContent();
    }

    fetchContent = () => {
        axios
            .get(
                `item/page/${this.state.page}/${this.state.perPage}`,
                this.generateConfig()
            )
            .then(res => {
                this.setState({
                    inventories: res.data.result,
                    maxPage: Math.ceil(res.data.count / this.state.perPage)
                });
            })
            .catch(() => {});
    };

    generateConfig() {
        return {
            headers: {
                Authorization: 'bearer ' + localStorage.getItem('key')
            }
        };
    }

    showModalAdd = () => {
        this.setState({ openPreviewAdd: true });
    };

    showModalEdit = () => {
        this.setState({ openPreviewEdit: true });
    };

    onCloseModal = () => {
        this.setState({ openPreviewAdd: false, openPreviewEdit: false });
    };

    addProduct = () => {
        const data = {
            sku: $('#sku-inven').val(),
            name: $('#name-inven').val(),
            image_url: $('#image-inven').val(),
            description: $('#desc-inven').val(),
            stock: $('#stock-inven').val(),
            price: $('#price-inven').val()
        };
        axios
            .post('item/new', data, this.generateConfig())
            .then(() => {
                swal('Success', 'Item added to inventory', 'success');
                this.fetchContent();
                this.onCloseModal();
            })
            .catch(err => {});
    };

    filterInventories = () => {
        if ($('#search-input-inven').val() === '') {
            this.fetchContent();
        } else {
            const filteredInvens = this.state.inventories.filter(inventory => {
                return (
                    inventory.name.toLowerCase().search(
                        $('#search-input-inven')
                            .val()
                            .toLowerCase()
                    ) !== -1 ||
                    inventory.sku.toLowerCase().search(
                        $('#search-input-inven')
                            .val()
                            .toLowerCase()
                    ) !== -1
                );
            });
            this.setState({ inventories: filteredInvens });
        }
    };

    changePagination = page => {
        this.setState({ page }, () => this.fetchContent());
    };

    deleteInventory = sku => {
        axios
            .post(`item/delete/${sku}`, {}, this.generateConfig())
            .then(() => {
                swal('Success', 'Item deleted', 'success');
                this.fetchContent();
            })
            .catch(() => {});
    };

    triggerEdit = inventory => {
        this.setState({ inventorySelected: inventory });
        this.showModalEdit();
    };

    setValueInven = () => {
        const inventory = this.state.inventorySelected;
        $('#sku-inven-edit').val(inventory.sku);
        $('#name-inven-edit').val(inventory.name);
        $('#image-inven-edit').val(inventory.image_url);
        $('#desc-inven-edit').val(inventory.description);
        $('#stock-inven-edit').val(inventory.stock);
        $('#price-inven-edit').val(inventory.price);
    };

    editProduct = () => {
        const data = {
            sku: $('#sku-inven-edit').val(),
            name: $('#name-inven-edit').val(),
            image_url: $('#image-inven-edit').val(),
            description: $('#desc-inven-edit').val(),
            stock: $('#stock-inven-edit').val(),
            price: $('#price-inven-edit').val()
        };
        axios
            .post(`item/update/${data.sku}`, data, this.generateConfig())
            .then(() => {
                swal('Success', 'Item deleted', 'success');
                this.fetchContent();
                this.onCloseModal();
            })
            .catch(() => {});
    };

    render() {
        return (
            <div className="inventory-container">
                <div className="row">
                    <div className="col-6">
                        <button
                            className="btn btn-primary"
                            onClick={() => this.showModalAdd()}>
                            Add product
                        </button>
                    </div>
                    <div className="col-6">
                        <input
                            type="text"
                            className="form-control search-inven"
                            id="search-input-inven"
                            placeholder="Search here..."
                            onChange={() => {
                                this.filterInventories();
                            }}
                        />
                    </div>
                </div>

                <table className="table table-reponsive table-inventory">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">SKU</th>
                            <th scope="col">Name</th>
                            <th scope="col" className="inven-col-image">
                                Image
                            </th>
                            <th scope="col">Description</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Price</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.inventories.map((inventory, index) => (
                            <tr key={inventory.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{inventory.sku}</td>
                                <td>{inventory.name}</td>
                                <td>
                                    <img
                                        src={inventory.image_url}
                                        alt=""
                                        className="inventory-image"
                                    />
                                </td>
                                <td>{inventory.description}</td>
                                <td>{inventory.stock}</td>
                                <td>IDR {inventory.price}</td>
                                <td>
                                    <i
                                        className="fas fa-edit"
                                        onClick={() => {
                                            this.triggerEdit(inventory);
                                        }}
                                    />
                                </td>
                                <td>
                                    <i
                                        className="fas fa-trash"
                                        onClick={() =>
                                            this.deleteInventory(inventory.sku)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
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
                    open={this.state.openPreviewAdd}
                    onClose={this.onCloseModal}
                    closeOnEsc
                    center
                    showCloseIcon={false}>
                    <div className="inventory-modal">
                        <div className="row">
                            <div className="col-3">
                                <h5>Sku</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="sku-inven"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Name</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name-inven"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Image URL</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="image-inven"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Description</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="desc-inven"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Stock</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="stock-inven"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Price</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price-inven"
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-primary float-right"
                            onClick={this.addProduct}>
                            Add Product
                        </button>
                        <button
                            className="btn btn-secondary float-right"
                            onClick={this.onCloseModal}>
                            Cancel
                        </button>
                    </div>
                </Modal>

                <Modal
                    open={this.state.openPreviewEdit}
                    onClose={this.onCloseModal}
                    closeOnEsc
                    center
                    showCloseIcon={false}
                    onEntered={this.setValueInven}>
                    <div className="inventory-modal">
                        <div className="row">
                            <div className="col-3">
                                <h5>SKU</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="sku-inven-edit"
                                    readOnly
                                />
                            </div>
                            <div className="col-3">
                                <h5>Name</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name-inven-edit"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Image URL</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="image-inven-edit"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Description</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="desc-inven-edit"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Stock</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="stock-inven-edit"
                                />
                            </div>
                            <div className="col-3">
                                <h5>Price</h5>
                            </div>
                            <div className="col-9 input-container">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price-inven-edit"
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-primary float-right"
                            onClick={this.editProduct}>
                            Edit Product
                        </button>
                        <button
                            className="btn btn-secondary float-right"
                            onClick={this.onCloseModal}>
                            Cancel
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}
