import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";
import {
  Alert,
  Button,
  Checkbox,
  TextInput,
} from "@space-metaverse-ag/space-ui";
import analytics from 'services/segment'
import { type AuthError, type SignupResponse, usePostSignupMutation } from "api/auth";
import styled from "styled-components";

interface PostSignupProps {
  data: SignupResponse
}

const Form = styled.form`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

const Message = styled(Alert)`
  width: 100%;
  justify-content: center;
`;

const FormButton = styled(Button)`
  width: 100%;
  margin: 0 auto;
  margin-top: 1rem;
`;

interface SignupFormProps {
  finishSignup: () => void
}

const SignupForm = ({ finishSignup }: SignupFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [readTerms, setReadTerms] = useState<boolean>(false);
  const [receiveMarketingEmails, setReceiveMarketingEmails] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [
    postSignup,
    {
      isLoading: isPostSignupLoading,
      isSuccess: isPostSignupSuccess,
      isError: isPostSignupError,
      error: postSignupError,
    },
  ] = usePostSignupMutation();

  useEffect(() => {
    if (isPostSignupSuccess) {
      setTimeout(() => {
        finishSignup();
      }, 5000);
    }
  }, [isPostSignupSuccess, finishSignup]);

  const handleSignup = useCallback(async () => {
    if (password === passwordConfirm && readTerms) {
      const response = await postSignup({
        email,
        username,
        password,
        receiveMarketingEmails,
      }) as PostSignupProps;

      if (response.data) {
        analytics.identify({
          id: response.data.accountId,
          email,
          username,
        })

        analytics.track({
          id: response.data.accountId,
          event: 'Signup'
        })
      }
    }
  }, [postSignup, username, email, password, passwordConfirm, receiveMarketingEmails]);

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  const handleReadTerms = (e: ChangeEvent<HTMLInputElement>) => {
    setReadTerms((prev) => !prev);
  };

  const handleReceiveMarketing = (e: ChangeEvent<HTMLInputElement>) => {
    setReceiveMarketingEmails((prev) => !prev);
  };

  // hack the form to submit on enter press, we have nested inputs
  useEffect(() => {
    const ref = formRef.current;
    if (ref) {
      const keyDownHandler = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
          handleSignup();
        }
      };
      ref.addEventListener("keypress", keyDownHandler);
      return () => ref?.removeEventListener("keypress", keyDownHandler);
    }
  }, [formRef, handleSignup]);

  return (
    <Form ref={formRef}>
      <TextInput
        label="Email"
        placeholder="example@mail.com"
        type="email"
        value={email}
        onChange={handleEmail}
      />
      <TextInput
        label="Username"
        placeholder="Choose a username"
        type="text"
        value={username}
        onChange={handleUsername}
      />
      <TextInput
        label="Password"
        placeholder="Use strong password"
        type="password"
        value={password}
        onChange={handlePassword}
      />
      <TextInput
        label="Re-enter password"
        placeholder="Confirm password"
        type="password"
        value={passwordConfirm}
        onChange={handlePasswordConfirm}
      />
      {isPostSignupError && (
        <Message
          type="error"
          text={
            (postSignupError as AuthError)?.data?.message ?? "Error with Signup"
          }
        />
      )}
      {isPostSignupSuccess && (
        <Message type="success" text={"Signup successful, please login..."} />
      )}
      <>
        <Checkbox
          label={
            <>
              I have read and agreed to the
              <a
                href="https://www.tryspace.com/legal/terms"
                target="_blank"
                rel="noreferrer noopener"
              >
                Space Terms
              </a>
            </>
          }
          onChange={handleReadTerms}
          isChecked={readTerms}
        />

        <Checkbox
          label="I want to receive marketing emails"
          onChange={handleReceiveMarketing}
          isChecked={receiveMarketingEmails}
        />
      </>
      <FormButton
        label="Sign-up"
        size="medium"
        color="blue"
        onClick={handleSignup}
        disabled={
          isPostSignupLoading ||
          !username ||
          !password ||
          password !== passwordConfirm ||
          !readTerms
        }
      />
    </Form>
  );
};

export default SignupForm;
