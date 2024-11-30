import React from "react";

export interface burgerProps{
    toggle:() => void | boolean;
    opened:boolean;
}

export interface dataType{
    coffee_machine_id:number,
    id:number,
    description:string,
    name:string,
    type:string,
    stock:number,
    price:number,
    image_paths:string[],
    quantity:number,
    discounted:boolean,
    discountedprice:number,

}

export interface CartContextType {
    cartItem: dataType[];
    setCartItem: React.Dispatch<React.SetStateAction<dataType[]>>;
}
export interface searchTermContextType {
    searchTerm: string;
    setSearchTerm: React. Dispatch<React. SetStateAction<string>>;
}