import {useDisclosure} from "@mantine/hooks";
import {AppShell, Box, Button, Grid, Image, Pagination} from "@mantine/core";
import NavbarComponent from "../components/NavbarComponent.tsx";
import SiderBarComponent from "../components/SideBarComponent.tsx";
import FooterComponent from "../components/FooterComponent.tsx";
import {dataType} from "../types.tsx";
import {Link} from "react-router";
import {useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";

export default function CoffeeMachinesPage(){
    const [opened, { toggle }] = useDisclosure();
    const ItemsPerPage = 4;
    const [activePage, setPage] = useState(1);

    const fetchCoffeeMachines=async()=>{
        return axios.get(`http://localhost:3000/fetchCoffeeMachines`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }
    const {data,isLoading,isError} = useQuery({ queryKey: ['data'], queryFn: fetchCoffeeMachines })

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError || !data) {
        return <p>Error loading data.</p>;
    }

    const start = (activePage - 1) * ItemsPerPage;
    const end = activePage * ItemsPerPage;
    const paginatedItems = data.slice(start, end);
    return (
        <>
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
                    <Box style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
                        {/* Main content */}
                        <Box style={{ flex: 1 }}>
                            <Grid grow justify="center" align="stretch" gutter="lg">
                                {paginatedItems.map((item:dataType) => (
                                    <Grid.Col span={{ base: 12, md: 6, lg: 6 }} key={`${item.type}-${item.id}`}>
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
                                                src={item.image_paths[0]}
                                                alt={item.name}
                                                style={{
                                                    width: "150px",
                                                    height: "150px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Box style={{ flex: 1 }}>
                                                <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>{item.name}</h2>
                                                <p style={{ margin: "0 0 0.5rem 0", color: "#555" }}>{item.description}</p>
                                                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}>
                                                    Stock:{" "}
                                                    {item.stock > 0 ?
                                                        <span style={{color:"green" }}>In Stock</span>
                                                        :
                                                        <span style={{color:"red"}}>Out of Stock</span>
                                                    }

                                                </p>

                                                {/* Price Section */}
                                                {item.discounted ? (
                                                    <>
                                                        <p style={{ margin: "0 0 1rem 0", fontWeight: "bold", color: 'red' }}>
                                                            Price: ${item.discountedprice}
                                                        </p>
                                                        <p style={{
                                                            textDecoration: "line-through",
                                                            color: "#999",
                                                            fontSize: "16px"
                                                        }}>
                                                            Original Price: ${item.price}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p style={{ margin: "0 0 1rem 0", fontWeight: "bold" }}>
                                                        Price: ${item.price}
                                                    </p>
                                                )}

                                                <Link to={`/${item.id}`}>
                                                    <Button variant="contained" color="primary">
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
                                total={Math.ceil(data.length / ItemsPerPage)}
                                value={activePage}
                                siblings={1}
                                onChange={setPage}
                                mt="sm"
                            />
                        </Box>
                    </Box>
                </AppShell.Main>

                <AppShell.Footer p="md" bg={"bisque"}>
                    <FooterComponent/>
                </AppShell.Footer>

            </AppShell>
        </>
    )
}