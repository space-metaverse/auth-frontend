import AuthWrapper from 'components/auth/AuthWrapper'
import type { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'

const Page = styled.div`
  width: 100%;
  height: 100%;
`
const Home: NextPage = () => (
  <Page>
    <Head>
      <title>Auth | SPACE</title>
      <meta name='description' content='Login / Signup into SPACE!' />
    </Head>
    <AuthWrapper  selectedTab="Login"/>
  </Page>
)

export default Home
