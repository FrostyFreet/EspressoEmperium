import {AppShell} from "@mantine/core";
import NavbarComponent from "../components/NavbarComponent.tsx";
import SiderBarComponent from "../components/SideBarComponent.tsx";

import FooterComponent from "../components/FooterComponent.tsx";

import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {supabase} from "../App.tsx";
import axios from "axios";

export default function OrdersPage(){
    const [opened, { toggle }] = useDisclosure();
    const [orders,setOrders]=useState([])
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data) {
                setUser(data.user?.id);
                console.log("id: "+data.user?.id);
            }
        };
        fetchUser();

    }, []);
    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    console.error('Error fetching user:', error);
                    return;
                }

                const response = await axios.get(`http://localhost:3000/fetchUserOrders/${user.id}`);
                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };


        fetchOrders();
    }, []);

    return(
        <AppShell
            header={{ height: { base: 48, sm: 60 } }}
            navbar={{width: 200, breakpoint: 'sm', collapsed: { mobile: !opened }}}
            padding={{ base: 10, sm: 15, lg:"xl" }}
            footer={{height:60}}>
            <AppShell.Header bg={"bisque"}>
                <NavbarComponent toggle={toggle} opened={opened}/>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <SiderBarComponent/>
            </AppShell.Navbar>

            <AppShell.Main>
                {orders.length>0 && user!=null?
                orders.map((i) =>
                    <li key={i.order_id}>
                        <strong>Product:</strong> {i.product_name} |
                        <strong> Quantity:</strong> {i.quantity} |
                        <strong> Price:</strong> ${i.total_price} |
                        <strong> Order date:</strong> {i.order_date}

                    </li>
                ):(
                    <p>No orders yet</p>
                    )

                }
            </AppShell.Main>

            <AppShell.Footer p="md" bg={"bisque"}>
                <FooterComponent/>
            </AppShell.Footer>

        </AppShell>
    )
}