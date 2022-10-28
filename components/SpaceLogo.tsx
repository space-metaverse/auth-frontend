import styled from 'styled-components';
import Image from 'next/future/image'

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

const SpaceLogo = () => {
    return (
        <LogoWrapper>
            <Image 
                src="/space-logo.png"
                alt="space logo" 
                width={70}
                height={32}
            />
        </LogoWrapper>
    )
}

export default SpaceLogo;