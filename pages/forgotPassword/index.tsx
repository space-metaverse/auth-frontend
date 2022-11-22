import styled from 'styled-components'
import SpaceLogo from "components/SpaceLogo";
import ForgotPasswordForm from 'components/auth/ForgotPasswordForm';

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

const ForgotPassword: React.FC = () => {
    return (
        <Main>
            <SpaceLogo />
            <ForgotPasswordForm />
        </Main>
    )
}

export default ForgotPassword