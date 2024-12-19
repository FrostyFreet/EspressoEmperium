import { useDisclosure } from "@mantine/hooks";
import { AppShell, Box, Button, Grid, Image, Pagination } from "@mantine/core";
import NavbarComponent from "../components/NavbarComponent.tsx";
import SiderBarComponent from "../components/SideBarComponent.tsx";
import FooterComponent from "../components/FooterComponent.tsx";
import { useState } from "react";
import { dataType } from "../types.tsx";
import {Link} from "react-router";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export default function DiscountsPage() {
    const [opened, { toggle }] = useDisclosure();
    const ItemsPerPage = 4;
    const [activePage, setPage] = useState(1);
    const start = (activePage - 1) * ItemsPerPage;
    const end = activePage * ItemsPerPage;

    const fetchDiscountedItems=async()=>{
        return axios.get(`http://localhost:3000/fetchDiscounts`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }
    const {data:discountedData,isLoading,isError} = useQuery({ queryKey: ['discountedData'], queryFn: fetchDiscountedItems })
    const paginatedItems: dataType[] = discountedData ? discountedData.slice(start, end) : [];




    if (isLoading) {return <p>Loading...</p>;}
    if (isError || !discountedData) {return <p>Error loading data.</p>;}

    const discounted: boolean[] = discountedData.map((i:dataType) => i.discounted);


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
                <Box style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
                    <Box style={{ flex: 1 }}>
                        <Grid grow justify="center" align="stretch" gutter="lg">
                            {paginatedItems.map((i) => (
                                <Grid.Col span={{ base: 12, md: 6, lg: 6 }} key={`${i.type}-${i.id}`}>
                                    <Box
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            height: "100%",
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "8px",
                                            padding: "1rem",
                                        }}
                                    >
                                        <Image
                                            src={i.image_paths[0]}
                                            alt={i.name}
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Box style={{ flex: 1 }}>
                                            <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>{i.name}</h2>
                                            <p style={{ margin: "0 0 0.5rem 0", color: "#555" }}>{i.description}</p>

                                            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}>
                                                Stock:{" "}
                                                <span style={{ color: i.stock > 0 ? "green" : "red" }}>
                                                    {i.stock > 0 ? "In stock" : "Out of stock"}
                                                </span>
                                            </p>

                                            {/* Price Section */}
                                            {discounted ? (
                                                <Box style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                                                    <p style={{ fontSize: "18px", fontWeight: "bold", color: "#e74c3c", marginRight: "0.5rem" }}>
                                                        ${i.discountedprice}
                                                    </p>
                                                    <p style={{ textDecoration: "line-through", color: "#999", fontSize: "16px" }}>
                                                        ${i.price}
                                                    </p>
                                                </Box>
                                            ) : (
                                                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#27ae60", textDecoration:'none' }}>
                                                    Price: ${i.price}
                                                </p>
                                            )}

                                            {/* Button */}
                                            <Link to={`/${i.id}/${i.name}`}>
                                                <Button variant="contained" color="primary" style={{ marginTop: "1rem" }}>
                                                    Show More
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Box>

                    {/* Pagination at the bottom */}
                    <Box style={{ textAlign: "center", padding: "1rem 0", backgroundColor: "#f9f9f9" }}>
                        <Pagination
                            total={Math.ceil(discountedData.length / ItemsPerPage)}
                            value={activePage}
                            siblings={1}
                            onChange={setPage}
                            mt="sm"
                        />
                    </Box>
                </Box>
            </AppShell.Main>

            <AppShell.Footer bg={"bisque"}>
                <FooterComponent />
            </AppShell.Footer>
        </AppShell>
    );
}
