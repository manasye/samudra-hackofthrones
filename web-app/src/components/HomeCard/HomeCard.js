import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HomeCard.css';

export default class HomeCard extends Component {
    render() {
        return (
            <div className="card homecard-wrapper">
                <div className="card-body d-flex align-items-center">
                    <div className="row w-100 align-items-center justify-content-between">
                        <i className={"card-icon fas " + this.props.icon } />
                        <div className="row flex-column text-right align-items-end">
                            <div className="card-legend">{ this.props.title }</div>
                            <div className="card-value">{ this.props.value }</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HomeCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
}