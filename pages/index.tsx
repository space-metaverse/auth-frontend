import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import AuthMain from '../components/auth/AuthMain';
import SpaceLogo from '../components/SpaceLogo';

const Page = styled.div`
    height: 100%;
    width: 100%;
`;

const Main = styled.main`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("auth-background.jpg");
`;

const Home: NextPage = () => {
    return (
        <Page>
            <Head>
                <title>Auth | SPACE</title>
                <meta name='description' content='Login / Signup into SPACE!' />
            </Head>
            <Main>
                <SpaceLogo />
                <AuthMain />
            </Main>
        </Page>
    )
}

export default Home;
