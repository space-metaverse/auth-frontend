import { useCallback, useState } from 'react'

import { Tabs } from '@space-metaverse-ag/space-ui'
import { rgba } from '@space-metaverse-ag/space-ui/helpers'
import styled from 'styled-components'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

const ModalWrapper = styled.div`
  width: 30rem;
  box-shadow: ${({ theme }) => `0px 48px 48px -48px ${rgba(theme.colors.dark[800], '.24')}`};
  border-radius: ${({ theme }) => theme.radius['2xl']};
  background-color: ${({ theme }) => theme.colors.white};
`

const TopSection = styled.div`
  padding: 2rem 2rem 0 2rem;
  border-radius: ${({ theme }) => theme.radius['2xl']};
  background-color: ${({ theme }) => theme.colors.white};
`

const WelcomeHeader = styled.div`
  color: ${({ theme }) => theme.colors.dark['700']};
  font-size: 2rem;
  text-align: center;
  padding-bottom: 1rem;
`

const FormSection = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  border-radius: ${({ theme }) => `0 0 ${theme.radius['2xl']} ${theme.radius['2xl']}`};
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.dark['100']};
`

enum AuthTabs {
  Login = 'Login',
  Signup = 'Signup',
}

const AuthMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState(AuthTabs.Login)

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab((tab as AuthTabs))
  }, [])

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

export default AuthMain
