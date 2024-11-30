import  {Divider, Group, Text} from "@mantine/core"
import {useContext, useEffect, useState} from "react";
import { CiDiscount1 } from "react-icons/ci";
import { MdCoffeeMaker } from "react-icons/md";
import { PiCoffeeBeanFill } from "react-icons/pi";
import {searchTermContext} from "../App.tsx";
import axios from "axios";
import {dataType} from "../types.tsx";
import PopoverComponent from "./PopoverComponent.tsx";



export default function SiderBarComponent(){
    const [isHoveredDiscounts, setIsHoveredDiscounts] = useState(false);
    const [isHoveredCoffeeBeans, setIsHoveredCoffeeBeans] = useState(false);
    const [isHoveredCoffeeMachines, setIsHoveredCoffeeMachines] = useState(false);

    const hoverStyleDiscounts = {textDecoration: isHoveredDiscounts ? 'underline 2px solid black' : 'none', cursor: 'pointer',};
    const hoverStyleCoffeeBeans = {textDecoration: isHoveredCoffeeBeans ? 'underline 2px solid black' : 'none', cursor: 'pointer',};
    const hoverStyleCoffeeMachines = {textDecoration: isHoveredCoffeeMachines ? 'underline 2px solid black' : 'none', cursor: 'pointer',};

    const[data,setData]=useState<dataType[]>([]);
    const[filteredDate,setFilteredData]=useState<dataType[]>([]);
    useEffect(()=>{
        axios.get('http://localhost:3000/fetchData')
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => {
                // Handle any errors here
                console.error('Error fetching data:', error);
            });
    },[])
    const {searchTerm,setSearchTerm}=useContext(searchTermContext)!

    const handleSearchTerm=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value=e.target.value
        setSearchTerm(value)
        const filteredItems=data.filter((i)=>i.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setFilteredData(filteredItems)
    }

    return (
        <>
            <PopoverComponent  handleSearchTerm={handleSearchTerm} searchTerm={searchTerm} filteredData={filteredDate} />
                <Divider my={"lg"} size={"sm"}/>

                    <Group>
                        <Group>
                            <CiDiscount1 />
                            <Text  size={"md"} mt={"5px"} style={hoverStyleDiscounts} onMouseEnter={() => setIsHoveredDiscounts(true)} onMouseLeave={() => setIsHoveredDiscounts(false)}>Discounts</Text>
                        </Group>
                        <Group>
                            <PiCoffeeBeanFill />
                            <Text size={"md"} mt={"5px"} style={hoverStyleCoffeeMachines} onMouseEnter={() => setIsHoveredCoffeeMachines(true)} onMouseLeave={() => setIsHoveredCoffeeMachines(false)}>Coffee Machines</Text>
                        </Group>
                        <Group>
                            <MdCoffeeMaker />
                            <Text size={"md"} mt={"5px"} style={hoverStyleCoffeeBeans} onMouseEnter={() => setIsHoveredCoffeeBeans(true)} onMouseLeave={() => setIsHoveredCoffeeBeans(false)}>Coffee Beans</Text>
                        </Group>
                    </Group>

        </>
    );
};
