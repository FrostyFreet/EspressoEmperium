import {AppShell} from "@mantine/core";
import NavbarComponent from "../components/NavbarComponent.tsx";
import SiderBarComponent from "../components/SideBarComponent.tsx";
import MainComponent from "../components/MainComponent.tsx";
import FooterComponent from "../components/FooterComponent.tsx";
import {useDisclosure} from "@mantine/hooks";

export default function CheckoutPage(){
    const [opened, { toggle }] = useDisclosure();
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
                    <MainComponent/>
                </AppShell.Main>

                <AppShell.Footer p="md" bg={"bisque"}>
                    <FooterComponent/>
                </AppShell.Footer>

            </AppShell>
        </>
    );
};
