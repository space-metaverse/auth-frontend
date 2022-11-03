import { rgba } from '@space-metaverse-ag/space-ui/helpers'
import Image from 'next/future/image'
import styled from 'styled-components'

const LogoWrapper = styled.div`
  top: 1rem;
  left: 1rem;
  padding: 0.5rem;
  display: flex;
  position: absolute;
  box-shadow: ${({ theme }) => `0px 48px 48px -48px ${rgba(theme.colors.dark[800], '.24')}`};
  border-radius: ${({ theme }) => theme.radius['3xl']};
  background-color: ${({ theme }) => theme.colors.white};
`

const SpaceLogo = () => (
  <LogoWrapper>
    <Image
      src="/space-logo.png"
      alt="space logo"
      width={68}
      height={28}
    />
  </LogoWrapper>
)

export default SpaceLogo
