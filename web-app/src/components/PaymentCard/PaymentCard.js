import React, { Component } from 'react';
import './PaymentCard.css';

export default class PaymentCard extends Component {
    render() {
        return (
            <div
                className="card payment-card-wrapper"
                onClick={() => this.props.onCardClick()}>
                <div className="card-body d-flex align-items-center">
                    <div className="row w-100 align-items-center justify-content-between">
                        <img
                            src={this.props.imageUrl}
                            style={{ height: '7vh' }}
                            alt=""
                        />
                        <div className="row align-items-center">
                            <div className="row flex-column text-right align-items-end">
                                <div className="card-legend">
                                    {this.props.legend}
                                </div>
                                <div className="card-value">
                                    {this.props.value}
                                </div>
                            </div>
                            <i
                                className="card-icon fa fa-chevron-right card-icon"
                                style={{ paddingLeft: '20px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
