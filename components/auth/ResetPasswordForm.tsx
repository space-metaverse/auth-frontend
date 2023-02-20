import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/router";
import { Alert, Button, TextInput } from "@space-metaverse-ag/space-ui";
import Tooltip from "components/Tooltip";
import { Info as IconInfo } from "@space-metaverse-ag/space-ui/icons";
import styled from "styled-components";
import { useOutsideClick } from "@space-metaverse-ag/space-ui/hooks";
import { rgba } from "@space-metaverse-ag/space-ui/helpers";
import { type AuthError, usePostResetPasswordMutation } from "api/auth";

const Container = styled.div`
  width: 23.625rem;
  box-shadow: ${({ theme }) =>
    `0px 48px 48px -48px ${rgba(theme.colors.dark[800], ".24")}`};
  border-radius: ${({ theme }) => theme.radius["3xl"]};
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2rem 2rem 3rem 2rem;
`;

const Header = styled.div`
  ${({ theme }) => theme.fonts.size["2xl"]}
  color: ${({ theme }) => theme.colors.dark["700"]};
  text-align: center;
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  margin-bottom: 1.5rem;
`;

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

const WrapperPassword = styled.div`
  position: relative;

  .password-info {
    top: -0.25rem;
    right: 0;
    cursor: pointer;
    position: absolute;

    path {
      stroke: ${({ theme }) => theme.colors.dark[600]};
      transition: ${({ theme }) => theme.transitions.ease};
    }

    &:hover path {
      stroke: ${({ theme }) => theme.colors.blue[400]};
    }
  }
`;

const rules = [
  {
    rule: "UPPERCASE",
    label: "Contain one uppercase letter",
    checked: false,
  },
  {
    rule: "LOWERCASE",
    label: "Contain one lowercase letter",
    checked: false,
  },
  {
    rule: "NUMERIC",
    label: "Contain one numeric character",
    checked: false,
  },
  {
    rule: "SPECIAL_CHARACTER",
    label: "Contain one special character (e.g.  !, %, @, #)",
    checked: false,
  },
  {
    rule: "GREATER_THAN_8",
    label: "Be at least 8 characters long",
    checked: false,
  },
];

const ResetPasswordForm = () => {
  const router = useRouter();

  const [tooltip, setTooltip] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [mismatchPassword, setMismatchPassword] = useState(false);
  const [credentialError, setCredentialError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);

  const { username, token, redirect } = router.query;

  const [
    resetPassword,
    {
      isLoading,
      isSuccess: isRequestSuccess,
      isError: isRquestError,
      error: requestError,
    },
  ] = usePostResetPasswordMutation();

  const checkRules = useMemo(() => {
    if (password) {
      const type = {
        NUMERIC: /\d/.test(password),
        UPPERCASE: /[A-Z]/.test(password),
        LOWERCASE: /[a-z]/.test(password),
        GREATER_THAN_8: password.length >= 8,
        SPECIAL_CHARACTER: /\W/.test(password),
      };

      const check = rules.map(({ rule, ...rest }) => {
        return {
          rule,
          ...rest,
          checked: type[rule as keyof typeof type],
        };
      });

      return {
        rules: check,
        concluded: check.filter(({ checked }) => checked).length >= 5,
      };
    }

    return {
      rules,
      concluded: false,
    };
  }, [password]);

  const handleSubmit = useCallback(async () => {
    if (password !== passwordConfirm) {
      setMismatchPassword(true);
      return;
    }

    if (!checkRules.concluded) {
      setTooltip(true);

      return;
    }

    if (!username || !token) {
      setCredentialError(true);
      return;
    }

    setMismatchPassword(false);
    setCredentialError(false);

    await resetPassword({
      username: username as string,
      password,
      token: token as string,
    });
  }, [
    password,
    passwordConfirm,
    checkRules.concluded,
    username,
    token,
    resetPassword,
  ]);

  const goToLogin = async () =>
    await router.push(
      `/login?redirect=${encodeURIComponent(redirect as string)}`
    );

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  // hack the form to submit on enter press, we have nested inputs
  useEffect(() => {
    const ref = formRef.current;
    if (ref) {
      const keyDownHandler = (event: KeyboardEvent): void => {
        if (event.key === "Enter") {
          handleSubmit();
        }
      };
      ref.addEventListener("keypress", keyDownHandler);
      return () => ref?.removeEventListener("keypress", keyDownHandler);
    }
  }, [formRef, handleSubmit]);

  useOutsideClick(passwordRef, () => setTooltip(false));

  return (
    <Container>
      <Header>Reset Password</Header>
      <Form ref={formRef}>
        <TextInput
          label="Username"
          placeholder={(username as string) || "username"}
          type="text"
          disabled
        />
        <WrapperPassword ref={passwordRef}>
          <TextInput
            label="Password"
            placeholder="Use strong password"
            type="password"
            value={password}
            onChange={handlePassword}
          />

          <Tooltip show={tooltip} fields={checkRules.rules}>
            <IconInfo
              width={20}
              height={20}
              onClick={() => setTooltip((prev) => !prev)}
              className="password-info"
            />
          </Tooltip>
        </WrapperPassword>
        <TextInput
          label="Re-enter password"
          placeholder="Confirm password"
          type="password"
          value={passwordConfirm}
          onChange={handlePasswordConfirm}
        />

        {credentialError && (
          <Message text="Username or token does not exist" type="error" />
        )}
        {mismatchPassword && (
          <Message text="Passwords do not match" type="error" />
        )}

        {isRquestError && (
          <Message
            text={
              (requestError as AuthError)?.data?.message ?? "Error with Signup"
            }
            type="error"
          />
        )}

        {isRequestSuccess && (
          <Message type="success" text="Reset successful, please login..." />
        )}

        <FormButton
          label={isRequestSuccess ? "Go to login" : "Submit"}
          size="medium"
          color="blue"
          onClick={isRequestSuccess ? goToLogin : handleSubmit}
          disabled={isLoading || !password || !passwordConfirm}
        />
      </Form>
    </Container>
  );
};

export default ResetPasswordForm;
