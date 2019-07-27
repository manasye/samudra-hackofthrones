import React, { Component } from 'react';
import RecentDealsItem from '../RecentDealsItem/RecentDealsItem';

export default class RecentDealsCard extends Component {
    render() {
        return (
            <div
                className="card chartcard-wrapper"
                style={{ overflow: 'scroll', maxHeight: '450px' }}>
                <div className="card-body">
                    <div className="card-title home-card-title">
                        Recent Deals
                    </div>
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                    <RecentDealsItem />
                </div>
            </div>
        );
    }
}
