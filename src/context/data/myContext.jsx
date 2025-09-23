import React, { createContext, useState } from "react";

const myContext = createContext();

export const MyProvider = ({ children }) => {
    const [mode, setMode] = useState("light");

    // Example product data (replace with your real data or API)
    const [product] = useState([
        { id: 1, name: "Laptop", category: "Electronics", price: "1000" },
        { id: 2, name: "Phone", category: "Electronics", price: "500" },
        { id: 3, name: "Shoes", category: "Fashion", price: "100" },
        { id: 4, name: "Chair", category: "Furniture", price: "200" },
    ]);

    // Filters
    const [searchKey, setSearchKey] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterPrice, setFilterPrice] = useState("");

    // Derived filtered products
    const filteredProducts = product.filter((item) => {
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchKey.toLowerCase());
        const matchesCategory = filterType ? item.category === filterType : true;
        const matchesPrice = filterPrice ? item.price === filterPrice : true;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <myContext.Provider
            value={{
                mode,
                product,
                filteredProducts,
                searchKey,
                setSearchKey,
                filterType,
                setFilterType,
                filterPrice,
                setFilterPrice,
            }}
        >
            {children}
        </myContext.Provider>
    );
};

export default myContext;
