import React, { Component } from 'react';
import swal from 'sweetalert';
import PaymentCard from '../../components/PaymentCard/PaymentCard';

export default class PaymentPage extends Component {
    onCardClick = () => {
        swal('Success', 'Payment Received', 'success');
    }

    render() {
        return (
            <div className="container">
                <PaymentCard
                    imageUrl="https://cdn.freebiesupply.com/logos/large/2x/visa-5-logo-png-transparent.png"
                    legend="Credit Card"
                    value="Visa"
                    onCardClick={this.onCardClick}
                />
                <PaymentCard
                    imageUrl="http://cdn2.tstatic.net/wow/foto/bank/images/go-pay-go-jek.jpg"
                    legend="E-Money"
                    value="Go-Pay"
                    onCardClick={this.onCardClick}
                />
                <PaymentCard
                    imageUrl="https://2.bp.blogspot.com/-lOAvxqPQ23s/WgO53cUvDOI/AAAAAAAAEoo/hiWQzddn0Vcu6FTQFU3iPnfe0jBqqvZowCLcBGAs/s1600/bca.jpg"
                    legend="Transfer"
                    value="Bank BCA"
                    onCardClick={this.onCardClick}
                />
                <PaymentCard
                    imageUrl="https://cdn6.aptoide.com/imgs/6/e/8/6e89719fac08a546696ba2e6875fd98e_icon.png?w=256"
                    legend="ATM"
                    value="ATM Bersama"
                    onCardClick={this.onCardClick}
                />
            </div>
        );
    }
}