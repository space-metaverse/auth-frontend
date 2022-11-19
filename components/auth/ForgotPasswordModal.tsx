import ForgotPasswordForm from "components/auth/ForgotPasswordForm";
import { rgba } from '@space-metaverse-ag/space-ui/helpers'
import { useRouter } from "next/router";
import styled from 'styled-components'

const ModalWrapper = styled.div`
width: 23.625rem;
box-shadow: ${({ theme }) => `0px 48px 48px -48px ${rgba(theme.colors.dark[800], '.24')}`};
border-radius: ${({ theme }) => theme.radius['3xl']};
background-color: ${({ theme }) => theme.colors.white};
`

const TopSection = styled.div`
padding: 1.5rem 2rem 1rem 2rem;
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
position: relative;
`

const FormSection = styled.div`
width: 100%;
padding: 2rem 2rem 3rem 2rem;
display: flex;
flex-direction: column;
`

const CloseModalIcon = styled.span`
font-size: .6em;
position: absolute;
right: 0;
cursor: pointer
`

const ForgotPasswordModal: React.FC = () => {
    const router = useRouter()
    const { forgotPasswordModal } = router.query
    const goBack = () => router.back()

    return (
        <ModalWrapper>
            <TopSection>
                <WelcomeHeader>
                    Recovery Password {forgotPasswordModal && <CloseModalIcon onClick={goBack} >X</CloseModalIcon>}
                </WelcomeHeader>
            </TopSection>
            <FormSection>
                <ForgotPasswordForm />
            </FormSection>
        </ModalWrapper>
    )
}

export default ForgotPasswordModal