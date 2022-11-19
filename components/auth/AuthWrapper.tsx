import SpaceLogo from "components/SpaceLogo"
import { useRouter } from "next/router" 
import styled from 'styled-components'
import AuthMain from "./AuthMain"
import ForgotPasswordModal from "./ForgotPasswordModal"

const Main = styled.main`
width: 100%;
height: 100%;
display: flex;
min-height: 100vh;
align-items: center;
justify-content: center;
background-size: cover;
background-image: url("auth-background.jpg");
`

interface Props {
    selectedTab: String,
}

const AuthWrapper: React.FC<Props> = ({ selectedTab }) => {
    return (
        <Main>
            <SpaceLogo />
            <AuthMain selectedTab={selectedTab} />
        </Main>
    )
}

export default AuthWrapper