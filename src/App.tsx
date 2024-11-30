import '@mantine/core/styles.css';
import MainPage from "./pages/MainPage.tsx";
import {Route, Routes} from 'react-router';
import ItemDetailsPage from "./pages/ItemDetailsPage.tsx";
import {createContext, useState} from "react";
import {CartContextType, dataType, searchTermContextType} from "./types.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";

export const cartContext=createContext<CartContextType | undefined>(undefined);
export const searchTermContext=createContext<searchTermContextType|null>(null);
function App() {
    const[cartItem,setCartItem]=useState<dataType[]>([])
    const[searchTerm,setSearchTerm]=useState<string>("")
    return (
        <>
            <cartContext.Provider value={{cartItem,setCartItem}}>
                <searchTermContext.Provider value={{searchTerm,setSearchTerm}}>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/:id" element={<ItemDetailsPage/>}/>
                        <Route path="/checkout" element={<CheckoutPage/>}/>
                    </Routes>
                </searchTermContext.Provider>
            </cartContext.Provider>
        </>
)
}

export default App
