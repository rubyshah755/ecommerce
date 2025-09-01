import React, { createContext } from "react";
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

export const ProductsContext = createContext();

export class ProductContextProvider extends React.Component {
    state = {
        products: [],
        loading: true,
        error: null,
        mode: 'light' // default theme mode
    }

    unsubscribe = null;

    componentDidMount = () => {
        this.fetchProducts();
    }

    componentWillUnmount = () => {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    fetchProducts = () => {
        this.setState({ loading: true, error: null });

        const productCollection = collection(fireDB, "products");
        this.unsubscribe = onSnapshot(productCollection,
            (snapshot) => {
                const finalData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                this.setState({
                    products: finalData,
                    loading: false
                });
            },
            (error) => {
                console.error("Error fetching products:", error);
                this.setState({
                    error: "Failed to load products",
                    loading: false
                });
            }
        );
    }

    refreshProducts = () => {
        this.fetchProducts();
    }

    cancelProducts = async (productId) => {
        try {
            const orderRef = doc(fireDB, "products", productId);
            await updateDoc(productRef, {
                productStatus: "Cancelled",
                cancelledAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error cancelling product:", error);
            throw new Error("Failed to cancel product");
        }
    }

    render() {
        return (
            <ProductsContext.Provider value={{
                products: this.state.products,
                loading: this.state.loading,
                error: this.state.error,
                mode: this.state.mode,
                refreshProducts: this.refreshProducts,
                cancelProducts: this.cancelProducts
            }}>
                {this.props.children}
            </ProductsContext.Provider>
        )
    }
}