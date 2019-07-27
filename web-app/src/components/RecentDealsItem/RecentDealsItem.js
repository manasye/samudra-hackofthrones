import React, { Component } from 'react';
import './RecentDealsItem.css';

export default class RecentDealsItem extends Component {
    render() {
        return(
            <div className="row justify-content-between align-items-center">
                <div className="d-flex flex-column">
                    <span className="deal-title">Lorem Ipsum</span>
                    <span>Qty. 5</span>
                </div>
                <span className="deal-price">Rp 123.456,00</span>
            </div>
        );
    }
}