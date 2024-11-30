import {Box, Button, Grid, Pagination,Image} from "@mantine/core";
import {Link} from "react-router";
import {useEffect, useState} from "react";

import {dataType} from "../types.tsx";
import axios from "axios";
export default function MainComponent(){
    const[data,setData]=useState<dataType[]>([]);
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
    const ItemsPerPage=4
    const [activePage, setPage] = useState(1);
    const start = (activePage - 1) * ItemsPerPage;
    const end = activePage * ItemsPerPage;

    const paginatedItems:dataType[] = data.slice(start, end);
    console.log(data)


    return (
        <Box style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
            {/* Main content */}
            <Box style={{ flex: 1 }}>
                <Grid grow justify="center" align="stretch" gutter="lg">
                    {paginatedItems.map((i) => (
                        <Grid.Col span={{ base: 12, md: 6, lg: 6 }} key={i.id}>
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
                                        <span style={{ color: i.stock > 0 ? "green" : "red" }}>{i.stock}</span>
                                    </p>
                                    <p style={{ margin: "0 0 1rem 0", fontWeight: "bold" }}>Price: ${i.price}</p>
                                    <Link to={`/${i.id}`}>
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
    );
}