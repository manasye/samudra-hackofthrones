import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import './ChartCard.css';

const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
        {
            label: 'Penjualan',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

export default class ChartCard extends Component {
    render() {
        return (
            <div
                className="card chartcard-wrapper"
                style={{ maxHeight: '450px' }}>
                <div className="card-body">
                    <div className="card-title home-card-title">
                        Grafik Penjualan
                    </div>
                    <Line data={data} height={150} />
                </div>
            </div>
        );
    }
}
