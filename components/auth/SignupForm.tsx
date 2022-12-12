import {
  useRef,
  useMemo,
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
import Tooltip from 'components/Tooltip'
import { Info as IconInfo } from "@space-metaverse-ag/space-ui/icons"
import { type AuthError, type SignupResponse, usePostSignupMutation } from "api/auth";
import styled from "styled-components";
import { useOutsideClick } from "@space-metaverse-ag/space-ui/hooks"

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

const WrapperPassword = styled.div`
  position: relative;

  .password-info {
    top: -.25rem;
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
`

const rules = [
  {
    rule: 'UPPERCASE',
    label: 'Contain one uppercase letter',
    checked: false,
  },
  {
    rule: 'LOWERCASE',
    label: 'Contain one lowercase letter',
    checked: false,
  },
  {
    rule: 'NUMERIC',
    label: 'Contain one numeric character',
    checked: false,
  },
  {
    rule: 'SPECIAL_CHARACTER',
    label: 'Contain one special character (e.g.  !, %, @, #)',
    checked: false,
  },
  {
    rule: 'GREATER_THAN_8',
    label: 'Be at least 8 characters long',
    checked: false,
  }
]

interface SignupFormProps {
  finishSignup: () => void
}

const SignupForm = ({ finishSignup }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [tooltip, setTooltip] = useState(false)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [readTerms, setReadTerms] = useState<boolean>(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [receiveMarketingEmails, setReceiveMarketingEmails] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);

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

  const checkRules = useMemo(() => {
    if (password) {
      const type = {
        NUMERIC: /\d/.test(password),
        UPPERCASE: /[A-Z]/.test(password),
        LOWERCASE: /[a-z]/.test(password),
        GREATER_THAN_8: password.length >= 8,
        SPECIAL_CHARACTER: /\W/.test(password)
      }

      const check = rules.map(({ rule, ...rest }) => {
        return ({
          rule,
          ...rest,
          checked: type[rule as keyof typeof type]
        })
      })

      return ({
        rules: check,
        concluded: check.filter(({ checked }) => checked).length >= 5
      })
    }

    return ({
      rules,
      concluded: false
    })
  }, [password])

  const handleSignup = useCallback(async () => {
    if (!checkRules.concluded) {
      setTooltip(true)

      return
    }

    const userId = global.analytics?.user?.()?.id();
    const anonymousId = global.analytics?.user?.()?.anonymousId()

    if (password === passwordConfirm && readTerms) {
      await postSignup({
        email,
        username,
        password,
        segmentAliasId: userId || anonymousId || Date.now(),
        receiveMarketingEmails,
      }) as PostSignupProps;
    }
  }, [postSignup, username, email, password, passwordConfirm, receiveMarketingEmails, readTerms, checkRules.concluded]);

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

  useOutsideClick(passwordRef, () => setTooltip(false))

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
      <WrapperPassword ref={passwordRef}>
        <TextInput
          label="Password"
          placeholder="Use strong password"
          type="password"
          value={password}
          onChange={handlePassword}
        />

        <Tooltip
          show={tooltip}
          fields={checkRules.rules}
        >
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
