import { TextField } from '@mui/material';
import useAxios from 'axios-hooks';
import {
    AlertBar,
    AlertDetails,
    Button,
    Layout,
    Title,
} from 'common/components';
import { RegisterRequest, User } from 'common/types';
import { RequestRegisterEndpoint } from 'common/utilities';
import { PasswordInput } from 'modules/auth/components/passwordInput/passwordInput';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FormContainer } from './components/form.styles';

type FormData = {
    Name: string;
    Email: string;
    Password: string;
};

const Register: NextPage = () => {
    const [alert, setAlert] = useState<AlertDetails | null>(null);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>();

    const [
        { data: response, loading: registerLoading, error },
        requestRegister,
    ] = useAxios<User, RegisterRequest>(RequestRegisterEndpoint, {
        manual: true,
    });

    useEffect(() => {
        if (error) {
            setAlert({
                message: error?.response?.data?.message,
                type: 'error',
            });
        }

        if (response) {
            setAlert({
                message: 'Successfully registered! Please login.',
                type: 'success',
            });
        }
    }, [error, response]);

    const OnRegister = async ({ Name, Email, Password }: FormData) =>
        requestRegister({
            data: {
                name: Name,
                email: Email.toLocaleLowerCase(),
                password: Password,
            },
            method: 'post',
        });

    const OnCloseAlert = () => setAlert(null);

    return (
        <Layout title="Register | Agai" loading={registerLoading}>
            {alert && <AlertBar callback={OnCloseAlert} details={alert} />}

            <Title> Register </Title>

            <FormContainer onSubmit={handleSubmit(OnRegister)}>
                <Controller
                    name="Name"
                    render={({ field }) => (
                        <TextField
                            id="Name"
                            helperText={
                                errors.Name ? errors.Name.message : null
                            }
                            label="Name"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.Name}
                        />
                    )}
                    control={control}
                    defaultValue=""
                    rules={{
                        required: {
                            value: true,
                            message: 'Name is required.',
                        },
                    }}
                />
                <Controller
                    name="Email"
                    render={({ field }) => (
                        <TextField
                            id="Email"
                            helperText={
                                errors.Email ? errors.Email.message : null
                            }
                            label="Email"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.Email}
                        />
                    )}
                    control={control}
                    defaultValue=""
                    rules={{
                        required: {
                            value: true,
                            message: 'Email is required.',
                        },
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: 'Invalid email address',
                        },
                    }}
                />
                <Controller
                    name="Password"
                    render={({ field }) => (
                        <PasswordInput
                            password={field.value}
                            onPasswordChange={field.onChange}
                            error={
                                errors.Password?.message
                                    ? errors.Password.message
                                    : null
                            }
                        />
                    )}
                    defaultValue=""
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'Password is required',
                        },
                        minLength: {
                            value: 4,
                            message: 'Minimum password length is 4',
                        },
                    }}
                />
                <Button type="submit"> Register </Button>
            </FormContainer>
        </Layout>
    );
};

export default Register;
