import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Tabs } from '@space-metaverse-ag/space-ui';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const ModalWrapper = styled.div`
    background-color: white;
    border-radius: 25px;
    width: 30rem;
    box-shadow: 0px 48px 48px -48px rgba(0, 0, 0, 0.24);
`;

const TopSection = styled.div`
    background-color: white;
    border-radius: 25px;
    padding: 2rem 2rem 0 2rem;
`;

const WelcomeHeader = styled.div`
    font-family: Aeroport Bold;
    color: #1B1B1F;
    font-size: 2rem;
    text-align: center;
    padding-bottom: 1rem;
`;

const FormSection = styled.div`
    background-color: #f7f7f7;
    width: 100%;
    padding: 2rem;
    border-radius: 0 0 25px 25px;
    display: flex;
    flex-direction: column;
`;

enum AuthTabs {
    Login = 'Login',
    Signup = 'Signup',
}

const AuthMain = () => {
    const [activeTab, setActiveTab] = useState(AuthTabs.Login);

    const handleTabChange = useCallback((tab: string) => {
        console.log("heheheheh");
        setActiveTab((tab as AuthTabs));
    }, []);

    return (
        <ModalWrapper>
            <TopSection>
                <WelcomeHeader>Welcome to Space</WelcomeHeader>
                <Tabs tabs={['Login', 'Signup']} onChange={tab => handleTabChange(tab)} activeTab={activeTab} />
            </TopSection>
            <FormSection>
                {activeTab === AuthTabs.Login && <LoginForm />}
                {activeTab === AuthTabs.Signup && <SignupForm finishSignup={() => setActiveTab(AuthTabs.Login)} />}
            </FormSection>
        </ModalWrapper>
    )
}

export default AuthMain;