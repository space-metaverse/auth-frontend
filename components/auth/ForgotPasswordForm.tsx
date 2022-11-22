import { useRef, useState, useEffect } from 'react'
import {
  Alert,
  TextInput,
  Modal,
  type ModalProps,
} from "@space-metaverse-ag/space-ui";
import styled from 'styled-components'
import { usePostForgotPasswordMutation } from 'api/auth'
import { useRouter } from 'next/router';
const Form = styled.form`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`

const Message = styled(Alert)`
  width: 100%;
  justify-content: center;
`;

const MessageWithMargin = styled(Message)`
  margin-top: 12px;
  margin-bottom: 12px;
`;

interface GeneralMessage {
  data: { message: string }
}

const ForgotPasswordForm: React.FC = () => {
  const [emailForgot, setEmailForgot] = useState<string>("");
  const [messageForgot, setMessageForgot] = useState<string>("");

  const modalRef = useRef<ModalProps>(null);
  const formModalRef = useRef<HTMLFormElement>(null);

  const router = useRouter()
  const { forgotPasswordModal } = router.query

  useEffect(() => {
    modalRef.current?.opened()
  }, [])

  const onClose = async () => await router.push("/login")

  const [
    postForgotPassword,
    {
      isLoading: isPostForgotPasswordLoading,
      isSuccess: isPostForgotPasswordSuccess,
      isError: isPostForgotPasswordError,
    },
  ] = usePostForgotPasswordMutation();

  return (
    <Form
      ref={formModalRef}
      onSubmit={async (e) => {
        e.preventDefault();

        await postForgotPassword({
          email: emailForgot,
        }).then((res) => {
          setMessageForgot(
            (res as GeneralMessage)?.data?.message ||
            (res as { error: GeneralMessage })?.error?.data?.message
          );
        });
      }}
    >
      <Modal
        ref={modalRef}
        actions={{
          primary: {
            color: "blue",
            label: "Send Reset Password Link",
            size: "large",
            type: "submit",
            disabled: isPostForgotPasswordLoading,
          },
        }}
        close
        outsideClick={!!forgotPasswordModal}
        shadow
        size="small"
        title="Recovery Password"
        clear={onClose}
      >
        <TextInput
          label="Email"
          required
          placeholder="email@mail.com"
          type="email"
          disabled={isPostForgotPasswordLoading}
          value={emailForgot}
          onChange={(e) => setEmailForgot(e.target.value)}
        />

        {(isPostForgotPasswordSuccess || isPostForgotPasswordError) && (
          <MessageWithMargin
            type={isPostForgotPasswordSuccess ? "success" : "error"}
            text={messageForgot}
          />
        )}
      </Modal>
    </Form>
  )
}

export default ForgotPasswordForm
