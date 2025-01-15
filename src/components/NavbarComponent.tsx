import {ActionIcon, Avatar, Box, Burger, Divider, Flex, Group, Image, Menu, Text} from '@mantine/core';
import logo from '/images/logo.png'
import { FaShoppingCart } from "react-icons/fa";
import {useContext, useEffect, useState} from "react";
import {burgerProps} from "../types.tsx";
import { Link,useNavigate } from 'react-router';
import {cartContext} from "../App.tsx";
import {IconTrash} from '@tabler/icons-react';
import {supabase} from "../App.tsx";

export default function NavbarComponent({toggle,opened}:burgerProps){
    const [isHoveredLogin, setIsHoveredLogin] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const hoverStyleLogin = {textDecoration: isHoveredLogin ? 'underline 2px solid black' : 'none', cursor: 'pointer',};
    const {cartItem,setCartItem}=useContext(cartContext)!
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const handleRemoveItem=(id:number)=>{
        const updatedCart = cartItem.filter(item => item.id !== id);
        setCartItem(updatedCart)
        console.log(updatedCart)
    }
    const [session, setSession] = useState<any>(null)

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                if (session) {
                    setUser(session.user);
                } else {
                    setUser(null);
                }
            });


            return () => subscription.unsubscribe();
        };

        fetchSession();
    }, [])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error.message);
        } else {
            setSession(null);
        }
    };
    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <>
            <Flex justify="space-between" maw="100%" p={"3px 1px"} >

                        <Group style={{ml:{base:0,md:"10px",lg:"10px"},mt:{base:0,md:"5px",lg:"5px"}}}>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                            <Link to={"/"}>
                             <Image src={logo} h={"40px"} />
                            </Link>
                            <Text size="xl" fw="bold">Espresso Emperium</Text>
                        </Group>

                        {/*Login and Cart*/}
                        <Group mr={"10px"} mt={"8px"}>
                            {!session ? (
                                <Text
                                    onClick={handleLoginClick}
                                    size="md"
                                    mr={"md"}
                                    onMouseEnter={() => setIsHoveredLogin(true)}
                                    onMouseLeave={() => setIsHoveredLogin(false)}
                                    style={hoverStyleLogin}
                                >
                                    Login
                                </Text>
                            ) :  (
                                <Menu mr="15px">
                                    <Menu.Target>
                                        <Avatar
                                            src={session?.user?.user_metadata?.avatar_url}
                                            alt={session?.user?.email}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        {session && user?.id==="6c02f97a-3426-488e-8816-f3a86d970a3e" ?  (
                                            <>
                                                <Menu.Label>{session?.user?.user_metadata?.name || session?.user?.email}</Menu.Label>
                                                <Menu.Item component={Link} to="/orders">Orders</Menu.Item>
                                                <Menu.Item component={Link} to="/adminpage">Admin</Menu.Item>
                                                <Divider />
                                                <Menu.Item color="red" onClick={handleLogout}>Logout</Menu.Item>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <Menu.Label>{session?.user?.user_metadata?.name || session?.user?.email}</Menu.Label>
                                                <Menu.Item component={Link} to="/orders">Orders</Menu.Item>
                                                <Divider />
                                                <Menu.Item color="red" onClick={handleLogout}>Logout</Menu.Item>
                                            </>
                                        )
                                        }

                                    </Menu.Dropdown>
                                </Menu>
                            )}

                            <Menu position="bottom-start" opened={openMenu} onChange={setOpenMenu} arrowPosition="center">
                                <Menu.Target>
                                    <Box>
                                        <FaShoppingCart size={"20px"}  style={{ cursor: 'pointer', marginTop:"8px", marginRight:"8px"}}  />
                                    </Box>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label style={{fontSize:18}}>
                                        Cart Items
                                    </Menu.Label>
                                    {cartItem.length > 0 ? (
                                        cartItem.map((item, index) => (
                                            <Group key={(item.id+index)} style={{ padding: '10px', borderBottom: '1px solid #f1f1f1', display: "flex",
                                                justifyContent: "space-between", alignItems: "center"}}>
                                                <Group>
                                                    <Image src={item.image_paths[0]} alt={item.name} width={40} height={40} fit="cover" style={{ borderRadius: '8px' }} />
                                                    <div>
                                                        <Text size="sm" fw={500}>{item.name}</Text>
                                                        <Text size="xs" c="dimmed">${item.price}</Text>
                                                        <Text size="xs" c="dimmed">Qty: {item.quantity}</Text>
                                                    </div>
                                                </Group>
                                                <ActionIcon color="red"  onClick={() => handleRemoveItem(item.id)} style={{alignSelf: "center"}}>
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        ))
                                    ) : (
                                        <Text size="sm" c="dimmed" text-align="center">Your cart is empty</Text>
                                    )}
                                    <Divider my="sm" />
                                <Link to={"/checkout"}>
                                    <Menu.Item style={{fontSize:18,fontWeight:"bold", textAlign:"center"}}>Checkout</Menu.Item>
                                </Link>
                                </Menu.Dropdown>
                            </Menu>

                        </Group>

                    </Flex>


        </>
    );
};
