import { Button } from '@mui/material';
import Head from 'next/head';
import styled from 'styled-components'
import {auth, provider} from "../firebase"

function Login() {

    const signIn = () => {
        // signInWithPopup() allows the google sign in 
        // catch(alert) will popup alert if user sign-ins
        auth.signInWithPopup(provider).catch(alert)
    }

    return (
        <Container>
            <Head>
                <title>Login</title> 
            </Head>
            <LoginContainer>
                <Logo src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'/>
                <Button style={{color: 'black', border: '1px solid gray', 
                    borderRadius: '3px', boxShadow: '0px 0.8px 0.5px 0px'}} 
                    onClick={signIn} variant="outlined">
                    Sign in with Google
                </Button>
            </LoginContainer>
        </Container>
    )
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color:whitesmoke;
`;
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
    background-color:white;
    border-radius:5px;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`;
const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;
