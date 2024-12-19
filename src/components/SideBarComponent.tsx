import  {Divider, Group, Text} from "@mantine/core"
import {useContext, useState} from "react";
import { CiDiscount1 } from "react-icons/ci";
import { MdCoffeeMaker } from "react-icons/md";
import { PiCoffeeBeanFill } from "react-icons/pi";
import {searchTermContext} from "../App.tsx";
import axios from "axios";
import {dataType} from "../types.tsx";
import PopoverComponent from "./PopoverComponent.tsx";
import { Link } from "react-router";
import {useQuery} from "@tanstack/react-query";



export default function SiderBarComponent(){
    const [isHoveredDiscounts, setIsHoveredDiscounts] = useState(false);
    const [isHoveredCoffeeBeans, setIsHoveredCoffeeBeans] = useState(false);
    const [isHoveredCoffeeMachines, setIsHoveredCoffeeMachines] = useState(false);

    const hoverStyleDiscounts = {textDecoration: isHoveredDiscounts ? 'underline 2px solid black' : 'none', cursor: 'pointer',};
    const hoverStyleCoffeeBeans = {textDecoration: isHoveredCoffeeBeans ? 'underline 2px solid black' : 'none', cursor: 'pointer',};
    const hoverStyleCoffeeMachines = {textDecoration: isHoveredCoffeeMachines ? 'underline 2px solid black' : 'none', cursor: 'pointer',};


    const[filteredData,setFilteredData]=useState<dataType[]>([]);

    const fetchFilteredData=async()=>{
        return await axios.get(`http://localhost:3000/fetchAllData`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }
    const {data} = useQuery({ queryKey: ['filteredData'], queryFn: fetchFilteredData })

    const {searchTerm,setSearchTerm}=useContext(searchTermContext)!

    const handleSearchTerm=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value=e.target.value
        setSearchTerm(value)
        const filteredItems=data.filter((i:dataType)=>i.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setFilteredData(filteredItems)
    }

    return (
        <>
            <PopoverComponent  handleSearchTerm={handleSearchTerm} searchTerm={searchTerm} filteredData={filteredData} />
                <Divider my={"lg"} size={"sm"}/>

                    <Group>
                        <Group>
                            <CiDiscount1 />
                            <Link to={"/discounts"} style={{color:'black',textDecoration:'none'}}>
                                <Text  size={"md"} mt={"5px"} style={hoverStyleDiscounts} onMouseEnter={() => setIsHoveredDiscounts(true)} onMouseLeave={() => setIsHoveredDiscounts(false)}>Discounts</Text>
                            </Link>
                        </Group>
                        <Group>
                            <PiCoffeeBeanFill />
                            <Link to={"/coffeemachines"} style={{color:'black',textDecoration:'none'}}>
                                <Text size={"md"} mt={"5px"} style={hoverStyleCoffeeMachines} onMouseEnter={() => setIsHoveredCoffeeMachines(true)} onMouseLeave={() => setIsHoveredCoffeeMachines(false)}>Coffee Machines</Text>
                            </Link>
                        </Group>
                        <Group>
                            <MdCoffeeMaker />
                            <Link to={"/coffeebeans"} style={{color:'black',textDecoration:'none'}}>
                                 <Text size={"md"} mt={"5px"} style={hoverStyleCoffeeBeans} onMouseEnter={() => setIsHoveredCoffeeBeans(true)} onMouseLeave={() => setIsHoveredCoffeeBeans(false)}>Coffee Beans</Text>
                            </Link>
                        </Group>
                    </Group>

        </>
    );
};
