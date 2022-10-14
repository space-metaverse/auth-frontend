import styled from 'styled-components';
import Image from 'next/future/image'
import spaceLogo from '../public/space-logo.png';

const LogoWrapper = styled.div`
    background-color: white;
    border-radius: 100px;
    box-shadow: 0px 48px 48px -48px rgba(0, 0, 0, 0.24);
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.5rem;
    display: flex;
`;

const LogoImage = styled(Image)`
    height: 2rem;
    width: auto;
`;

const SpaceLogo = () => {
    return (
        <LogoWrapper>
            <LogoImage src={spaceLogo} alt="space logo" />
        </LogoWrapper>
    )
}

export default SpaceLogo;