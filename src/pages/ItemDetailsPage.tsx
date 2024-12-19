import { useContext, useMemo, useState } from "react";
import NavbarComponent from "../components/NavbarComponent.tsx";
import FooterComponent from "../components/FooterComponent.tsx";
import SiderBarComponent from "../components/SideBarComponent.tsx";
import { useDisclosure } from "@mantine/hooks";
import '@mantine/carousel/styles.css';
import {AppShell, Box, Button, Card, Grid, Group, Image, Loader, NumberInput, Stack, Text} from "@mantine/core";
import {dataType} from "../types.tsx";
import { Carousel } from '@mantine/carousel';
import { cartContext } from "../App.tsx";
import {useQuery} from "@tanstack/react-query";

import axios from "axios";
import {useParams} from "react-router";

export default function ItemDetailsPage() {
    const [opened, { toggle }] = useDisclosure();
    const [quantity, setQuantity] = useState<number>(1);
    const reviews_count = Math.floor(Math.random() * 500);
    const { cartItem, setCartItem } = useContext(cartContext)!;
    const { id, name } = useParams();
    const fetchItemDetails=async()=>{
        return await axios.get(`http://localhost:3000/fetchCoffeeMachines/${id}/${name}`)
            .then((response) => response.data)

            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }
    const fetchPopulerItems=async()=>{
        return await axios.get(`http://localhost:3000/fetchPopularCoffeeMachines`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }


    // Fetch the clicked item details
    const {isLoading:isItemLoading,data:itemData} = useQuery({ queryKey: ['itemDetails'], queryFn: fetchItemDetails })
    // Fetch popular coffee machines
    const {data:popularItemsData } = useQuery({ queryKey: ['popularItems'], queryFn: fetchPopulerItems })
    const cachedValue = useMemo(() => reviews_count, [itemData]);

    // Handle quantity change
    const handleQuantityChange = (value: number) => { setQuantity(value); };

    // Add item to cart
    const handleAddToCart = () => {
        const contains = cartItem.findIndex((i) => i.id === itemData[0].id && i.name===itemData[0].name);

        if (contains !== -1) {
            // Item already in cart, update its quantity and price
            const updateCart = [...cartItem];
            updateCart[contains].quantity += quantity;

            // Check if the item has a discount
            if (updateCart[contains].discounted) {
                // Update the discounted price based on the new quantity
                updateCart[contains].discountedprice = Number(updateCart[contains].discountedprice) + (quantity * Number(itemData[0].discountedprice));
                updateCart[contains].price = Number(updateCart[contains].discountedprice); // Set total price to discounted price
            } else {
                // Update regular price if no discount is applied
                updateCart[contains].price += quantity * Number(itemData[0].price);
            }

            setCartItem(updateCart);
        } else {
            // Item not in cart, add it with the correct price
            const newItem = {
                ...itemData[0],
                price: itemData[0].discounted ? itemData[0].discountedprice * quantity : itemData[0].price * quantity,
                quantity,
            };

            setCartItem((prevState) => [...prevState, newItem]);
        }
    };
    const handlePopularCartAdd = (id: number,name:string,) => {
        const contains = cartItem.findIndex((i:dataType) => i.id === id);
        const found = popularItemsData.find((i:dataType) => i.id === id && i.name===name) ;

        if (found) {
            if (contains !== -1) {
                const updateCart = [...cartItem];
                updateCart[contains].quantity += quantity;
                updateCart[contains].price += quantity * Number(found.price);
                setCartItem(updateCart);
            } else {
                setCartItem((prevState) =>
                    [...prevState, { ...found, quantity, price: found.price * quantity }]
                );
            }
        } else {
            console.error(`Item with id ${id} not found in popularData`);
        }
    };


    return (
        <>
            <AppShell
                header={{ height: { base: 48, sm: 60 } }}
                navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                padding={{ base: 10, sm: 15, lg: "xl" }}
                footer={{ height: 60 }}
            >
                <AppShell.Header bg={"bisque"}>
                    <NavbarComponent toggle={toggle} opened={opened} />
                </AppShell.Header>

                <AppShell.Navbar p="md">
                    <SiderBarComponent />
                </AppShell.Navbar>

                <AppShell.Main>
                    {isItemLoading ? (
                        <Loader />
                    ) : (
                        <Group gap="md" dir="column" align="stretch">
                            {/* Product Image Carousel */}
                            <Carousel
                                controlsOffset="md"
                                slideGap="md"
                                dragFree
                                withIndicators
                                style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    borderRadius: '8px',
                                    paddingTop: '75px',
                                    loading:'eager'
                                }}
                            >
                                {itemData && itemData.length > 0 && itemData[0]?.image_paths.map((image: string, index: number) => (
                                    <Carousel.Slide key={`${itemData.id}-${index}`}>
                                        <Image
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            height={300}
                                            fit="contain"
                                            style={{ width: '100%' }}
                                        />
                                    </Carousel.Slide>
                                ))}
                            </Carousel>

                            <Stack gap="sm" style={{ flex: 1 }}>
                                <Text fw={500} style={{ fontSize: 32 }}>{itemData[0].name}</Text>

                                {/* Rating */}
                                <Group align="center">
                                    <Text c="#FFD700" style={{ fontSize: 18 }}>★★★★★</Text>
                                    <Text style={{ fontSize: 18 }}>({cachedValue} reviews)</Text>
                                </Group>

                                {/* Price and Stock */}
                                {itemData.map((i:dataType) => (
                                    i.discounted ? (
                                        <Box style={{ display: "flex", alignItems: "center" }} key={i.id}>
                                            <Text
                                                style={{
                                                    fontSize: "24px",
                                                    fontWeight: "bold",
                                                    color: "#e74c3c",
                                                    marginRight: "0.5rem"
                                                }}
                                            >
                                                ${i.discountedprice}
                                            </Text>
                                            <Text
                                                style={{
                                                    textDecoration: "line-through",
                                                    color: "#999",
                                                    fontSize: "20px"
                                                }}
                                            >
                                                ${i.price}
                                            </Text>
                                        </Box>
                                    ) : (
                                        <Text style={{ fontSize: 24, color: "black" }} key={i.id}>
                                            Price: ${i.price}
                                        </Text>
                                    )
                                ))}

                                <Text size="sm" style={{ fontSize: 24,}}>{itemData[0]?.description}</Text>

                                {/* Stock */}
                                <Text size="sm" style={{ fontSize: 24 }}><b>Stock:</b> {itemData[0]?.stock}</Text>

                                {/* Quantity Input and Add to Cart */}
                                <Group align="center">
                                    <NumberInput
                                        value={quantity}
                                        min={1}
                                        style={{ width: '80px' }}
                                        onChange={handleQuantityChange}
                                    />
                                    <Button variant="filled" color="blue" onClick={handleAddToCart}>
                                        Add to Cart
                                    </Button>
                                </Group>
                            </Stack>

                            {/* Popular Items */}
                            <Grid style={{ width: '100%', marginTop: '40px', justifyContent: 'center' }}>
                                {popularItemsData.map((item:dataType,index:number) => (
                                    <Grid.Col span={4} key={`${item.type}-${item.id}-${index}`}>
                                        <Card
                                            shadow="sm"
                                            padding="md"
                                            bg='rgba(0, 0, 0, 0.05)'
                                            style={{ maxHeight: '350px', overflow: 'hidden' }}
                                        >
                                            <Image
                                                src={item.image_paths[2]}
                                                alt={item.name}
                                                height={160}
                                                width="100%"
                                                fit="contain"
                                            />
                                            <Text mt="md" style={{ fontSize: 16, fontWeight: 500, textAlign: 'center' }}>
                                                {item.name}
                                            </Text>
                                            <Text style={{ fontSize: 14, textAlign: 'center' }}>${item.price}</Text>
                                            <Group mt="md" style={{ justifyContent: 'center' }}>
                                                <Button variant="outline" color="blue" onClick={() => handlePopularCartAdd(item.id,item.name)}>
                                                    Add to Cart
                                                </Button>

                                            </Group>
                                        </Card>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Group>
                    )}
                </AppShell.Main>

                <AppShell.Footer p="md" bg={"bisque"}>
                    <FooterComponent />
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
