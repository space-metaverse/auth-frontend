import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

import AuthMain from '../components/auth/AuthMain'
import SpaceLogo from '../components/SpaceLogo'

const Page = styled.div`
  width: 100%;
  height: 100%;
`

const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-image: url("auth-background.jpg");
`

const Home: NextPage = () => (
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

export default Home
