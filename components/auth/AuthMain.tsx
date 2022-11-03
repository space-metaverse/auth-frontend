import { useState } from 'react'
import { Tabs } from '@space-metaverse-ag/space-ui'
import { rgba } from '@space-metaverse-ag/space-ui/helpers'
import styled from 'styled-components'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

const ModalWrapper = styled.div`
  width: 23.625rem;
  box-shadow: ${({ theme }) => `0px 48px 48px -48px ${rgba(theme.colors.dark[800], '.24')}`};
  border-radius: ${({ theme }) => theme.radius['3xl']};
  background-color: ${({ theme }) => theme.colors.white};
`

const TopSection = styled.div`
  padding: 1.5rem 2rem 0 2rem;
  box-shadow: ${({ theme }) => `0px 0px 48px ${rgba(theme.colors.dark['800'], '.24')}`};
  border-radius: ${({ theme }) => `${theme.radius['3xl']} ${theme.radius['3xl']} 0 0`};
  background-color: ${({ theme }) => theme.colors.white};
`

const WelcomeHeader = styled.div`
  ${({ theme }) => theme.fonts.size['2xl']}
  color: ${({ theme }) => theme.colors.dark['700']};
  text-align: center;
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  margin-bottom: 1rem;
`

const FormSection = styled.div`
  width: 100%;
  padding: 2rem 2rem 3rem 2rem;
  display: flex;
  flex-direction: column;
`

enum AuthTabs {
  Login = 'Login',
  Signup = 'Signup',
}

const AuthMain = () => {
  const [activeTab, setActiveTab] = useState(AuthTabs.Login)

  const handleTabChange = (tab: string) => {
    setActiveTab((tab as AuthTabs))
  }

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
