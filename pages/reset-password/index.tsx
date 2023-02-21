import styled from 'styled-components'
import SpaceLogo from "components/SpaceLogo";
import ResetPasswordForm from 'components/auth/ResetPasswordForm';

const Main = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-image: url("auth-background.png");
`

const ForgotPassword: React.FC = () => {
    return (
        <Main>
            <SpaceLogo />
            <ResetPasswordForm />
        </Main>
    )
}

export default ForgotPassword