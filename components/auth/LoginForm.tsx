import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Alert, Button, Checkbox, TextInput } from '@space-metaverse-ag/space-ui';
import { AuthError, usePostLoginMutation } from '../../api/auth';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Message = styled(Alert)`
    width: 100%; 
    justify-content: center;
`;

const LoginForm = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const formRef = useRef<HTMLFormElement>(null);

    const [postLogin, {
        isLoading: isPostLoginLoading,
        isSuccess: isPostLoginSuccess,
        isError: isPostLoginError,
        data: postLoginData,
        error: postLoginError
    }] = usePostLoginMutation();

    const handleLogin = useCallback(() => {
        postLogin({
            username,
            password
        })
    }, [postLogin, username, password]);

    const handleUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }, []);

    const handlePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    // set the cookie with token if the login was successful
    useEffect(() => {
        if (isPostLoginSuccess) {
            const token = postLoginData?.AuthenticationResult?.AccessToken;
            const maxAge = postLoginData?.AuthenticationResult?.ExpiresIn;
            const loginCode = postLoginData?.loginCode;
            if (token) {
                document.cookie = `token=${token}; path=/; max-age=${maxAge || 3600}; secure;`;
            }
            if (loginCode) {
                const urlSearchParams = new URLSearchParams(window.location.search);
                const redirect = urlSearchParams.get('redirect');
                if (redirect) {
                    window.location.href = `${redirect}/?loginCode=${loginCode}`;
                }
            }
        }
    }, [isPostLoginSuccess, postLoginData?.AuthenticationResult?.AccessToken, postLoginData?.AuthenticationResult?.ExpiresIn, postLoginData?.loginCode])

    // hack the form to submit on enter press, we have nested inputs
    useEffect(() => {
        if (formRef?.current) {
            const keyDownHandler = (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    handleLogin()
                }
            };
            formRef.current.addEventListener('keypress', keyDownHandler);
            return () => formRef.current?.removeEventListener('keypress', keyDownHandler);
        }
    }, [formRef, handleLogin])

    return (
        <Form ref={formRef} onSubmit={handleLogin}>
            <TextInput
                label='Username'
                placeholder='Enter your username'
                onChange={handleUsername}
            />
            <TextInput
                label='Password'
                placeholder='Enter your password'
                type="password"
                onChange={handlePassword}
            />
            {
                isPostLoginError && (
                    <Message type='error' text={(postLoginError as AuthError)?.data?.message || 'Error with login'} />
                )
            }
            {
                isPostLoginSuccess && (
                    <Message type='success' text={'Login Successful!'} />
                )
            }
            <Checkbox label='Remember me' />
            <Button
                label="Login"
                size='medium'
                color="blue"
                style={{ margin: '0 auto', width: '100%' }}
                onClick={handleLogin}
                disabled={isPostLoginLoading || (!username || !password)}
            />
        </Form>
    )
}

export default LoginForm;