import styled from 'styled-components';
import { Alert, Button, TextInput } from '@space-metaverse-ag/space-ui';
import { AuthError, usePostConfirmSignupMutation, usePostSignupMutation } from '../../api/auth';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Message = styled(Alert)`
    width: 100%; 
    justify-content: center;
`;

interface SignupFormProps {
    finishSignup: () => void;
}

const SignupForm = ({ finishSignup }: SignupFormProps) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const [isConfirming, setIsConfirming] = useState<boolean>(false);
    const [confirmCode, setConfirmCode] = useState<string>('');

    const formRef = useRef<HTMLDivElement>(null);

    const [postSignup, {
        isLoading: isPostSignupLoading,
        isSuccess: isPostSignupSuccess,
        isError: isPostSignupError,
        data: postSignupData,
        error: postSignupError
    }] = usePostSignupMutation();

    const [postConfirmSignup, {
        isLoading: isPostConfirmSignupLoading,
        isSuccess: isPostConfirmSignupSuccess,
        isError: isPostConfirmSignupError,
        data: postConfirmSignupData,
        error: postConfirmSignupError
    }] = usePostConfirmSignupMutation();

    useEffect(() => {
        if (isPostSignupSuccess) {
            setIsConfirming(true);
        }
    }, [isPostSignupSuccess])

    useEffect(() => {
        if (isPostConfirmSignupSuccess) {
            setTimeout(() => {
                finishSignup();
            }, 5000);
        }
    }, [isPostConfirmSignupSuccess])

    const handleSignup = useCallback(() => {
        if (password === passwordConfirm) {
            postSignup({
                username,
                email,
                password,
            })
        }
    }, [postSignup, username, email, password, passwordConfirm]);

    const handleConfirmSignup = useCallback(() => {
        postConfirmSignup({
            username,
            otp: confirmCode,
        })
    }, [postSignup, username, confirmCode]);

    const handleEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handleUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }, []);

    const handlePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handlePasswordConfirm = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(e.target.value);
    }, []);

    const handleConfirmCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setConfirmCode(e.target.value);
    }, []);

    // hack the form to submit on enter press, we have nested inputs
    useEffect(() => {
        if (formRef?.current) {
            const keyDownHandler = (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    isConfirming ? handleConfirmSignup() : handleSignup();
                }
            };
            formRef.current.addEventListener('keypress', keyDownHandler);
            return () => formRef.current?.removeEventListener('keypress', keyDownHandler);
        }
    }, [formRef, isConfirming, handleSignup, handleConfirmSignup]);

    return (
        <>
            {
                isConfirming ? (
                    <Form ref={formRef}>
                        {isPostConfirmSignupSuccess ? (
                            <Message type="success" text="Signup confirmed! Please login." />
                        ) : (
                            <>
                                <TextInput
                                    label='Verify your Email'
                                    placeholder='Enter verfication code'
                                    type="text"
                                    value={confirmCode}
                                    onChange={handleConfirmCode}
                                />
                                {
                                    isPostConfirmSignupError && (
                                        <Message type='error' text={(postConfirmSignupError as AuthError)?.data?.message || 'Error with Confirmation'} />
                                    )
                                }
                                <Button
                                    label="Confirm Code"
                                    size='medium'
                                    color="blue"
                                    onClick={handleConfirmSignup}
                                    disabled={isPostConfirmSignupLoading || !confirmCode}
                                    style={{ margin: '0 auto', width: '100%' }}
                                />
                            </>
                        )}
                    </Form>
                ) : (
                    <Form ref={formRef}>
                        <TextInput
                            label='Email'
                            placeholder='example@mail.com'
                            type="email"
                            value={email}
                            onChange={handleEmail}
                        />
                        <TextInput
                            label='Username'
                            placeholder='Choose a username'
                            type="text"
                            value={username}
                            onChange={handleUsername}
                        />
                        <TextInput
                            label='Password'
                            placeholder='Use strong password'
                            type="password"
                            value={password}
                            onChange={handlePassword}
                        />
                        <TextInput
                            label='Re-enter password'
                            placeholder='Confirm password'
                            type="password"
                            value={passwordConfirm}
                            onChange={handlePasswordConfirm}
                        />
                        {
                            isPostSignupError && (
                                <Message type='error' text={(postSignupError as AuthError)?.data?.message || 'Error with Signup'} />
                            )
                        }
                        <Button
                            label="Sign-up"
                            size='medium'
                            color="blue"
                            onClick={handleSignup}
                            disabled={isPostSignupLoading || (!username || !password) || (password !== passwordConfirm)}
                            style={{ margin: '0 auto', width: '100%' }}
                        />
                    </Form>
                )
            }
        </>
    )
}

export default SignupForm;