import { createSlice, createSlice } from "@reduxjs/toolkit";

const initialState = [];

const createSlice = createSlice({
    name: 'cart',
    initialState,
    reducers : {
        addToCart(State, action){
            state.push(action.payload)
        },
        deleteFromCart(state,action){
            return state.filter(item => item.id != action.payload.id);
        }
    }
})

export const {addToCart, deleteFromCart} = cartSlice.actions;

export dafault cartSlice.reducer;