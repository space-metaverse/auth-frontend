import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  TextInput,
} from "@space-metaverse-ag/space-ui";
import { AuthError, usePostSignupMutation } from "api/auth";
import styled from "styled-components";

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
  finishSignup: () => void;
}

const SignupForm = ({ finishSignup }: SignupFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [readTerms, setReadTerms] = useState<boolean>(false);
  const [receiveMarketingEmails, setReceiveMarketingEmails] =
    useState<boolean>(false);

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

  const handleSignup = useCallback(() => {
    if (password === passwordConfirm) {
      postSignup({
        username,
        email,
        password,
        receiveMarketingEmails,
      });
    }
  }, [postSignup, username, email, password, passwordConfirm]);

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

  const handleReadTerms = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setReadTerms((prev) => !prev);
  }, []);

  const handleReceiveMarketing = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setReceiveMarketingEmails((prev) => !prev);
    },
    []
  );

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
          password !== passwordConfirm
        }
      />
    </Form>
  );
};

export default SignupForm;
