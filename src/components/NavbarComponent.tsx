import {ActionIcon, Avatar, Box, Burger, Button, Divider, Flex, Group, Image, Menu, Select, Text} from '@mantine/core';
import logo from '/images/logo.png'
import { FaShoppingCart } from "react-icons/fa";
import {useContext, useState} from "react";
import {burgerProps} from "../types.tsx";
import { Link } from 'react-router';
import {cartContext} from "../App.tsx";
import {IconTrash} from '@tabler/icons-react';
import {useAuth0} from "@auth0/auth0-react";

export default function NavbarComponent({toggle,opened}:burgerProps){
    const [isHoveredLogin, setIsHoveredLogin] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    //const cartRef = useRef(null)
    const hoverStyleLogin = {textDecoration: isHoveredLogin ? 'underline 2px solid black' : 'none', cursor: 'pointer',};
    const {cartItem,setCartItem}=useContext(cartContext)!
    const { isAuthenticated,user, loginWithRedirect, logout } = useAuth0();
    const handleRemoveItem=(id:number)=>{
        const updatedCart = cartItem.filter(item => item.id !== id);
        setCartItem(updatedCart)
        console.log(updatedCart)
    }


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
                            {!isAuthenticated ? (
                                <Text
                                    onClick={loginWithRedirect}
                                    size="md"
                                    mr={"md"}
                                    onMouseEnter={() => setIsHoveredLogin(true)}
                                    onMouseLeave={() => setIsHoveredLogin(false)}
                                    style={hoverStyleLogin}
                                >
                                    Login
                                </Text>
                            ) : (
                                <Menu  style={{ marginRight: "15px" }}>
                                    <Menu.Target>
                                        <Avatar
                                            src={user?.picture}
                                            alt={user?.name}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>{user?.name}</Menu.Label>
                                        <Menu.Item component={Link} to="/profile">Profile</Menu.Item>
                                        <Menu.Item component={Link} to="/orders">Orders</Menu.Item>
                                        <Divider />
                                        <Menu.Item color="red" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</Menu.Item>
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
