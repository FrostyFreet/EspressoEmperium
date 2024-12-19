import '@mantine/core/styles.css';
import MainPage from "./pages/MainPage.tsx";
import {Route, Routes} from 'react-router';
import ItemDetailsPage from "./pages/ItemDetailsPage.tsx";
import {createContext, useState} from "react";
import {CartContextType, dataType, searchTermContextType} from "./types.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import DiscountsPage from "./pages/DiscountsPage.tsx";
import CoffeeMachinesPage from "./pages/CoffeeMachinesPage.tsx";
import CoffeeBeansPage from "./pages/CoffeeBeansPage.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()
export const cartContext=createContext<CartContextType | undefined>(undefined);
export const searchTermContext=createContext<searchTermContextType|null>(null);
function App() {
    const[cartItem,setCartItem]=useState<dataType[]>([])
    const[searchTerm,setSearchTerm]=useState<string>("")
    return (
        <>
            <QueryClientProvider client={queryClient}>
                    <cartContext.Provider value={{cartItem,setCartItem}}>
                        <searchTermContext.Provider value={{searchTerm,setSearchTerm}}>
                            <Routes>
                                <Route path="/" element={<MainPage/>}/>
                                <Route path="/:id/:name" element={<ItemDetailsPage/>}/>
                                <Route path="/checkout" element={<CheckoutPage/>}/>
                                <Route path="/discounts" element={<DiscountsPage/>}/>
                                <Route path="/coffeemachines" element={<CoffeeMachinesPage/>}/>
                                <Route path="/coffeebeans" element={<CoffeeBeansPage/>}/>
                            </Routes>
                        </searchTermContext.Provider>
                    </cartContext.Provider>
            </QueryClientProvider>
        </>
)
}

export default App
