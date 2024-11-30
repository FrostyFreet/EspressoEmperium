import {Box, Popover, ScrollArea, TextInput} from "@mantine/core";
import {useState} from "react";
import {IconSearch} from "@tabler/icons-react";
import {dataType} from "../types.tsx";
import { Link } from "react-router";

export default function PopoverComponent({searchTerm,handleSearchTerm,filteredData}:any){
    const [opened, setOpened] = useState(false);


    return (
        <Popover
            opened={opened && searchTerm.length > 0}
            onClose={() => setOpened(false)}
            withArrow
            shadow="md"
            position="bottom"
            width="target"
        >
            <Popover.Target>
                <TextInput
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(event) => {
                        handleSearchTerm(event);
                        setOpened(event.target.value.length > 0);
                    }}
                    rightSection={
                        <button
                            style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}

                        >
                            <IconSearch stroke={1.5} />
                        </button>
                    }
                />
            </Popover.Target>

            <Popover.Dropdown>
                <ScrollArea style={{ maxHeight: 200 }}>
                    {filteredData.length > 0 ? (
                        filteredData.map((item: dataType) => (
                            <Link to={`/${item.id}`}>
                                <Box
                                        key={item.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #eee",
                                            "&:hover": { backgroundColor: "#f9f9f9" },
                                        }}
                                        onClick={() => {

                                            setOpened(false);
                                        }}
                                    >

                                    {/* Item Image */}
                                    <img
                                        src={item.image_paths[0]}
                                        alt={item.name}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "4px",
                                            objectFit: "cover",
                                            marginRight: "12px",
                                        }}
                                    />

                                    {/* Item Details */}
                                    <Box style={{ flexGrow: 1 }}>
                                        <Box
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 500,
                                                marginBottom: "4px",
                                                color: "#333",
                                            }}
                                        >
                                            {item.name}
                                        </Box>
                                        <Box style={{ fontSize: "12px", color: "#555" }}>
                                            ${item.price}
                                        </Box>
                                    </Box>
                                </Box>
                            </Link>

                        ))
                    ) : (
                        <Box style={{ padding: "8px 12px", color: "#aaa" }}>No results found</Box>
                    )}

                </ScrollArea>

            </Popover.Dropdown>
        </Popover>
    );
}
