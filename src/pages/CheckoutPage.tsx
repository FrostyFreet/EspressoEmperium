import { AppShell, Box, Button, Divider, Grid, Group, Paper, ScrollArea, Title, Text, Image, TextInput } from "@mantine/core";
import NavbarComponent from "../components/NavbarComponent.tsx";
import SiderBarComponent from "../components/SideBarComponent.tsx";
import FooterComponent from "../components/FooterComponent.tsx";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import { cartContext } from "../App.tsx";
import { dataType, orderType } from "../types.tsx";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define validation schema
const schema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().min(1, "Zip Code is required"),
});

export default function CheckoutPage() {
    const [opened, { toggle }] = useDisclosure();
    const { cartItem,setCartItem } = useContext(cartContext)!;
    const { register, formState: { errors }, handleSubmit } = useForm<orderType>({
        resolver: zodResolver(schema)
    });

    const subtotal = cartItem.reduce((acc, item) => acc + item.price,0);
    const shippingCost = 10.0;
    const total = subtotal + shippingCost;

    const onSubmit: SubmitHandler<orderType> = async (data) => {
        try {
            const orderData = { ...data, cartItems: cartItem };
            await axios.post('http://localhost:3000/sendOrder', orderData);
            setCartItem([]);

        } catch (e) {
            console.log(e);
        }

    };

    console.log(cartItem)
    return (
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Title order={1} mb="lg" ta="center">Checkout</Title>

                        <Grid gutter="lg">
                            {/* Cart Items Section */}
                            <Grid.Col span={{ base: 12, md: 8 }}>
                                <Paper withBorder shadow="sm" p="md" radius="md">
                                    <Title order={3} mb="md" ta={"center"}>Your Cart</Title>
                                    <ScrollArea h={600}>
                                        {cartItem.map((item: dataType) => (
                                            <div key={`${item.type}-${item.id}`}>
                                                <Group justify="space-between" mb="md" align="center">
                                                    <Group mt={"lg"}>
                                                        <Image
                                                            src={item.image_paths[0]}
                                                            alt={item.name}
                                                            width={100}
                                                            height={100}
                                                            radius="sm"
                                                        />
                                                        <Box>
                                                            <Text fw={700}>{item.name}</Text>
                                                            <Text size="sm" c="dimmed">Quantity: {item.quantity}</Text>
                                                        </Box>
                                                    </Group>
                                                    <Text fw={700} mr={"lg"}>
                                                        Price: ${(item.price)}
                                                    </Text>
                                                </Group>
                                                {/* Divider after each item */}
                                                <Divider mb="xl"/>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </Paper>
                            </Grid.Col>

                            {/* Checkout Summary Section */}
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Paper withBorder shadow="sm" p="md" radius="md">
                                    <Title order={3} ta={"center"} mb="md">Summary</Title>
                                    <Divider mb="md" />
                                    <Group justify="space-between" mb="xs">
                                        <Text>Subtotal:</Text>
                                        <Text fw={700}>${subtotal.toFixed(2)}</Text>
                                    </Group>
                                    <Group justify="space-between" mb="xs">
                                        <Text>Shipping:</Text>
                                        <Text fw={700}>${shippingCost.toFixed(2)}</Text>
                                    </Group>
                                    <Divider mb="xs" />
                                    <Group justify="space-between" mb="md">
                                        <Text>Total:</Text>
                                        <Text fw={700} size="lg">${total.toFixed(2)}</Text>
                                    </Group>

                                    {/* Shipping Address Inputs */}
                                    <Box mt="md">
                                        {/* Name Input */}
                                        <TextInput
                                            {...register('name')}
                                            placeholder="Your Name"
                                            label="Name"
                                            error={errors.name?.message}
                                            required
                                        />
                                        {/* Address Input */}
                                        <TextInput
                                            {...register('address')}
                                            placeholder="Address"
                                            label="Address"
                                            error={errors.address?.message}
                                            required
                                        />
                                        {/* City Input */}
                                        <TextInput
                                            {...register('city')}
                                            placeholder="City"
                                            label="City"
                                            error={errors.city?.message}
                                            required
                                        />
                                        {/* Zip Code Input */}
                                        <TextInput
                                            {...register('zipCode')}
                                            placeholder="Zip Code"
                                            label="Zip Code"
                                            error={errors.zipCode?.message }
                                            required
                                        />
                                    </Box>

                                    {/* Submit Button */}
                                    <Button fullWidth color="teal" size="md" type={"submit"} mt={"md"}>
                                        Proceed to Payment
                                    </Button>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </form>
            </AppShell.Main>

            <AppShell.Footer p="md" bg={"bisque"}>
                <FooterComponent />
            </AppShell.Footer>
        </AppShell>
    );
};
