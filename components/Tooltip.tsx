import { rgba } from '@space-metaverse-ag/space-ui/helpers'
import type { PropsWithChildren } from 'react'
import styled from 'styled-components'

interface FieldProps {
  rule: string
  label: string
  checked: boolean
}

interface TooltipProps {
  show: boolean
  fields: FieldProps[]
}

const Wrapper = styled.div`
  display: flex;
`

const Bubble = styled.ul<Pick<TooltipProps, 'show'>>`
  gap: .5rem;
  right: 0;
  bottom: ${({ show }) => show ? '100%' : '50%'};
  display: flex;
  opacity: ${({ show }) => (show ? 1 : 0)};
  padding: 1rem;
  z-index: 99;
  position: absolute;
  min-width: 13rem;
  transition: ${({ theme }) => theme.transitions.ease};
  box-shadow: ${({ theme }) => `0px 12px 48px -12px ${rgba(theme.colors.dark[800], '.12')}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  flex-direction: column;
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  background-color: ${({ theme }) => theme.colors.white};
`

const Field = styled.li<Pick<FieldProps, 'checked'>>`
  ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme, checked }) => checked ? theme.colors.green[400] : theme.colors.dark[700]};
  display: flex;
  align-items: center;
`

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  show,
  fields,
  children
}) => (
  <Wrapper>
    <Bubble show={show}>
      {fields.map(({ label, checked }) => (
        <Field
          key={label}
          checked={checked}
        >
          {label}
        </Field>
      ))}
    </Bubble>

    {children}
  </Wrapper>
)

export default Tooltip;
