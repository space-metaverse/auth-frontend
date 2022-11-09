import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  Button,
  Checkbox,
  CheckboxStyles,
  TextInput,
  Modal,
  type ModalProps,
} from "@space-metaverse-ag/space-ui";
import { AuthError, usePostLoginMutation } from "api/auth";
import styled from "styled-components";

const Form = styled.form`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

const FormButton = styled(Button)`
  width: 100%;
  margin: 0 auto;
  margin-top: 1rem;
`;

const Message = styled(Alert)`
  width: 100%;
  justify-content: center;
`;

const ForgotLabel = styled(CheckboxStyles.Label)`
  text-decoration: underline;
`;

const RememberAndForgot = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<ModalProps>(null);
  const formModalRef = useRef<HTMLFormElement>(null);

  const [
    postLogin,
    {
      isLoading: isPostLoginLoading,
      isSuccess: isPostLoginSuccess,
      isError: isPostLoginError,
      data: postLoginData,
      error: postLoginError,
    },
  ] = usePostLoginMutation();

  const handleLogin = useCallback(async () => {
    await postLogin({
      username,
      password,
    });
  }, [postLogin, username, password]);

  const handleUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handlePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleRememberMe = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe((prev) => !prev);
  }, []);

  // if the login was successful: set the cookie with accessToken, redirect the browser with loginCode, set or clear localStorage
  useEffect(() => {
    if (isPostLoginSuccess) {
      const token = postLoginData?.AuthenticationResult?.AccessToken;
      const maxAge = postLoginData?.AuthenticationResult?.ExpiresIn;
      const loginCode = postLoginData?.loginCode;
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=${
          maxAge ?? 3600
        }; secure;`;
      }
      if (loginCode) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const redirect = urlSearchParams.get("redirect");
        if (redirect) {
          window.location.href = `${redirect}/?loginCode=${loginCode}`;
        }
      }
      if (rememberMe) {
        window.localStorage.setItem("username", username);
        window.localStorage.setItem("password", password);
      } else {
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("password");
      }
    }
  }, [
    isPostLoginSuccess,
    postLoginData?.AuthenticationResult?.AccessToken,
    postLoginData?.AuthenticationResult?.ExpiresIn,
    postLoginData?.loginCode,
    rememberMe,
    username,
    password,
  ]);

  // onload: check localStorage for username / password - "Remember Me" functionality
  useEffect(() => {
    const username = window.localStorage.getItem("username");
    const password = window.localStorage.getItem("password");
    if (username && password) {
      setUsername(username);
      setPassword(password);
      setRememberMe(true);
    }
  }, []);

  // hack the form to submit on enter press, we have nested inputs
  useEffect(() => {
    const ref = formRef.current;
    if (ref != null) {
      const keyDownHandler = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
          handleLogin();
        }
      };
      ref.addEventListener("keypress", keyDownHandler);

      return () => ref?.removeEventListener("keypress", keyDownHandler);
    }
  }, [formRef, handleLogin]);

  return (
    <>
      <Form ref={formRef} onSubmit={handleLogin}>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          onChange={handleUsername}
          value={username}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          onChange={handlePassword}
          value={password}
        />
        {isPostLoginError && (
          <Message
            type="error"
            text={
              (postLoginError as AuthError)?.data?.message ?? "Error with login"
            }
          />
        )}
        {isPostLoginSuccess && (
          <Message type="success" text={"Login Successful!"} />
        )}
        <RememberAndForgot>
          <Checkbox
            label="Remember me"
            onChange={handleRememberMe}
            isChecked={rememberMe}
          />
          <ForgotLabel onClick={() => modalRef.current?.opened()}>
            Forgot password?
          </ForgotLabel>
        </RememberAndForgot>
        <FormButton
          label="Login"
          size="medium"
          color="blue"
          onClick={handleLogin}
          disabled={isPostLoginLoading || !username || !password}
        />
      </Form>

      <Form
        ref={formModalRef}
        onSubmit={(e) => {
          e.preventDefault();
          alert("sent");
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
            },
          }}
          close
          outsideClick
          shadow
          size="small"
          title="Recovery Password"
        >
          <TextInput
            label="Email"
            required
            placeholder="email@mail.com"
            type="email"
          />
        </Modal>
      </Form>
    </>
  );
};

export default LoginForm;
