import React, { Component } from 'react';
import HomeCard from '../../components/HomeCard/HomeCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import RecentDealsCard from '../../components/RecentDealsCard/RecentDealsCard';
import './HomePage.css';

export default class HomePage extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xl-4">
                        <HomeCard
                            title="Today Revenue"
                            value="Rp 3,900,000"
                            icon="fa-home"
                        />
                    </div>
                    <div className="col-xl-4">
                        <HomeCard
                            title="Today Sales"
                            value="126 Items"
                            icon="fa-archway"
                        />
                    </div>
                    <div className="col-xl-4">
                        <HomeCard
                            title="To Deliver "
                            value="30 Transactions"
                            icon="fa-atlas"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <ChartCard/>
                    </div>
                    <div className="col-lg-4">
                        <RecentDealsCard/>
                    </div>
                </div>
            </div>
        );
    }
}
