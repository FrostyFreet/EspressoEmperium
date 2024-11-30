import { useParams } from "react-router";
import { useContext, useEffect, useMemo, useState } from "react";
import NavbarComponent from "../components/NavbarComponent.tsx";
import FooterComponent from "../components/FooterComponent.tsx";
import SiderBarComponent from "../components/SideBarComponent.tsx";
import { useDisclosure } from "@mantine/hooks";
import '@mantine/carousel/styles.css';
import {AppShell, Box, Button, Card, Grid, Group, Image, Loader, NumberInput, Stack, Text} from "@mantine/core";
import { dataType } from "../types.tsx";
import axios from "axios";
import { Carousel } from '@mantine/carousel';
import { cartContext } from "../App.tsx";

export default function ItemDetailsPage() {
    const [opened, { toggle }] = useDisclosure();
    const params = useParams();
    const [data, setData] = useState<dataType[]>([]);
    const [popularData, setPopularData] = useState<dataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const reviews_count = Math.floor(Math.random() * 500);
    const cachedValue = useMemo(() => reviews_count, [data]);
    const { cartItem, setCartItem } = useContext(cartContext)!;

    // Fetch the clicked item details
    useEffect(() => {
        axios.get(`http://localhost:3000/fetchCoffeeMachines/${params.id}`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }).finally(() => setLoading(false));
    }, [params.id]);

    // Fetch popular coffee machines
    useEffect(() => {
        axios.get(`http://localhost:3000/fetchPopularCoffeeMachines`)
            .then((response) => {
                setPopularData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }).finally(() => setLoading(false));
    }, [params.id]);

    // Handle quantity change
    const handleQuantityChange = (value: number) => { setQuantity(value); };

    // Add item to cart
    const handleAddToCart = () => {
        const contains = cartItem.findIndex((i) => i.id === data[0].id);
        if (contains !== -1) {
            const updateCart = [...cartItem];
            updateCart[contains].quantity += quantity;
            updateCart[contains].price = Number(updateCart[contains].price) + quantity * Number(data[0].price);
            setCartItem(updateCart);
        } else {
            setCartItem((prevState: dataType[]) =>
                [...prevState, { ...data[0], price: data[0].price * quantity, quantity }]
            );
        }
    };

    // Handle adding popular items to cart
    const handlePopularCartAdd = (id: number) => {
        const contains = cartItem.findIndex((i) => i.id === id);
        const found = popularData.find((i) => i.id === id);

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
                    {loading ? (
                        <Loader />
                    ) : (
                        <Group gap="md" direction="column" align="stretch">
                            {/* Product Image Carousel */}
                            <Carousel
                                controlsOffset="md"
                                height={350}
                                slideGap="md"
                                dragFree
                                withIndicators
                                style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    borderRadius: '8px',
                                    padding: '10px',
                                }}
                            >
                                {data[0]?.image_paths.map((image: string, index: number) => (
                                    <Carousel.Slide key={index}>
                                        <Image
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            height={350}
                                            width="100%"
                                            fit="contain"
                                            style={{ width: '100%' }}
                                        />
                                    </Carousel.Slide>
                                ))}
                            </Carousel>

                            <Stack gap="sm" style={{ flex: 1 }}>
                                <Text fw={500} style={{ fontSize: 32 }}>{data[0].name}</Text>

                                {/* Rating */}
                                <Group align="center">
                                    <Text c="#FFD700" style={{ fontSize: 18 }}>★★★★★</Text>
                                    <Text style={{ fontSize: 18 }}>({cachedValue} reviews)</Text>
                                </Group>

                                {/* Price and Stock */}
                                {data.map((i) => (
                                    i.discounted ? (
                                        <Box style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }} key={i.id}>
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

                                {/* Stock */}
                                <Text size="sm" style={{ fontSize: 24 }}>Stock: {data[0]?.stock}</Text>

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
                                {popularData.map((item, index) => (
                                    <Grid.Col span={4} key={index}>
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
                                                <Button variant="outline" color="blue" onClick={() => handlePopularCartAdd(item.id)}>
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
