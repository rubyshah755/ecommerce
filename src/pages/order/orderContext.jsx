import React, { createContext } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
//import { ref } from "firebase/storage";
//import { onValue } from "firebase/database";

//declearation of context must start with initial uppercase
export const OrdersContext = createContext();

export class OrdersContextProvider extends React.Component {

    //defining an initial state
    state = {
        orders: []
    }

    componentDidMount = async () => {
        var orderData = collection(fireDB, "orders");
        var result = await getDocs(orderData);
        //console.log(result, 'result');
        const finalData = result.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        //console.log(finalData,'finaldata')
        this.setState({
            ordersData: finalData
        });
    }

    render() {
        return (
            <OrdersContext.Provider value={{ orders: { ...this.state.ordersData } }}>
                {this.props.children}
            </OrdersContext.Provider>
        )
    }
}