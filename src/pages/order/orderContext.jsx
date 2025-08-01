import React, { createContext } from "react";
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

export const OrdersContext = createContext();

export class OrdersContextProvider extends React.Component {
    state = {
        orders: [],
        loading: true,
        error: null,
        mode: 'light' // default theme mode
    }

    unsubscribe = null;

    componentDidMount = () => {
        this.fetchOrders();
    }

    componentWillUnmount = () => {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    fetchOrders = () => {
        this.setState({ loading: true, error: null });

        const ordersCollection = collection(fireDB, "orders");
        this.unsubscribe = onSnapshot(ordersCollection,
            (snapshot) => {
                const finalData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                this.setState({
                    orders: finalData,
                    loading: false
                });
            },
            (error) => {
                console.error("Error fetching orders:", error);
                this.setState({
                    error: "Failed to load orders",
                    loading: false
                });
            }
        );
    }

    refreshOrders = () => {
        this.fetchOrders();
    }

    cancelOrder = async (orderId) => {
        try {
            const orderRef = doc(fireDB, "orders", orderId);
            await updateDoc(orderRef, {
                orderStatus: "Cancelled",
                cancelledAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error cancelling order:", error);
            throw new Error("Failed to cancel order");
        }
    }

    render() {
        return (
            <OrdersContext.Provider value={{
                orders: this.state.orders,
                loading: this.state.loading,
                error: this.state.error,
                mode: this.state.mode,
                refreshOrders: this.refreshOrders,
                cancelOrder: this.cancelOrder
            }}>
                {this.props.children}
            </OrdersContext.Provider>
        )
    }
}