
import { Auth } from '@supabase/auth-ui-react';
import {useEffect, useState} from "react";
import {createClient} from "@supabase/supabase-js";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {useNavigate} from "react-router";
const supabase = createClient(import.meta.env.VITE_URL,import.meta.env.VITE_ANON_KEY)

function LoginPage() {
    const [session, setSession] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {

                navigate('/')
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate])

    return (
        <>

            <h2 style={{textAlign:"center"}}>Login to Espresso Emperium</h2>
            {!session && (
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    showLinks={true}
                />
            )}



        </>
    );
}

export default LoginPage;
