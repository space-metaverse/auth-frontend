import { ChangeEvent, useCallback, useRef, useState, FormEvent } from 'react'

import { Button, TextInput } from '@space-metaverse-ag/space-ui'
import styled from 'styled-components'
import { useRouter } from 'next/router'
const Form = styled.form`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`
const FormButton = styled(Button)`
  width: 100%;
  margin: 0 auto;
  margin-top: 1rem;
`

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)

  const handleEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])
  
  const handleSubmit = (e: FormEvent<HTMLFormElement> | undefined): void => {
    e?.preventDefault()
    router.push("/")
  }
  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <TextInput
        label='Email'
        placeholder='Enter your email'
        onChange={handleEmail}
        value={email}
        required
      />

      <FormButton
        label="Send reset password link"
        size='medium'
        color="blue"
        type='submit'
      />
    </Form>
  )
}

export default ForgotPasswordForm
