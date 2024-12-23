import React from 'react'
import { Input } from '@/components/tool/input/input';
import Link from 'next/link';
import { Button } from '@/components/button/button';
import { useState, useEffect } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
type Props = {
    signup: (body: { username: string, password: string, email: string }) => void,
    apicheckusername?: string
    apicheckemail?: string
}

const SignupCard = ({ signup, apicheckusername, apicheckemail }: Props) => {

    const [_username, set_username] = useState<string>("")
    const [_password, set_password] = useState<string>("")
    const [_email, set_email] = useState<string>("")


    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isError, setIsErrors] = useState<boolean>(true)

    const [Error, setErrors] = useState<{ username?: string, password?: string, email?: string }>({})


    useEffect(() => {
        const validateForm = async () => {
            const errors: { username?: string, password?: string, email?: string } = {}

            if (_username.length != 0 && 6 > _username.length) {
                errors.username = `username must be longer than 6 character`
            }
            if (_username && apicheckusername) {
                const isusername = await fetch(apicheckusername + _username)
                    .then((res) => res.json())
                    .then((data) => data)
                if (isusername) { errors.username = "username is Exited" }
            }
            if (!/\S+@\S+\.\S+/.test(_email) && _email.length != 0) {
                errors.email = 'this email is not valid';
            }
            if (_email && apicheckemail) {
                const isEmail = await fetch(apicheckemail + _email)
                    .then((res) => res.json())
                    .then((data) => data)
                if (isEmail) { errors.email = "email is existed" }
            }
            if (_password.length != 0 && _password.length < 6) {
                errors.password = `password must be longer than 6 character`;
            }

            setIsErrors(Object.keys(errors).length || _username === "" || _password === "" || _email === "" ? true : false);
            setErrors(errors)
        }
        if (validateForm) {
            validateForm();
        }
    }, [_username, _password, _email, apicheckusername, apicheckemail]);
    return (
        <div className='bg-lv-0 dark:bg-lv-18 m-auto w-11/12 max-w-[440px] text-center p-10 shadow-md grid gap-1 rounded '>
            <div className=" h-12 flex flex-col justify-center text-2xl font-bold">
                <h2>Sign Up</h2>
            </div>
            <Input name="Username" onChange={(v) => set_username(v)} value={_username} warn={Error.username} />
            <Input name="Password" type={showPassword ? 'text' : 'password'} onChange={(v) => set_password(v)} value={_password} warn={Error.password}
                icon1={showPassword ?
                    <RemoveRedEyeIcon className='w-6 h-6 my-auto mx-1 cursor-pointer' onClick={() => setShowPassword(false)} /> :
                    <VisibilityOffIcon className='w-6 h-6 my-auto mx-1 cursor-pointer' onClick={() => setShowPassword(true)} />}
            />
            <Input name="Email" onChange={(v) => set_email(v)} value={_email} warn={Error.email} />
            <div className="h-12 flex flex-col justify-center">
            </div>
            <div className="h-12 flex flex-col justify-center">
                <p className='opacity-50 hover:opacity-100 cursor-pointer hover:text-colormain flex w-max m-auto'>Log in by google</p>
            </div>
            <div className="h-12 flex flex-col justify-center">
                <p>Go back to Log In</p>
                <Link className='opacity-50 hover:opacity-100 hover:text-colormain' href={"login"}>Log In!</Link>
            </div>
            <div className="h-12"></div>
            <Button name="Sign Up" disable={isError} onClick={() => signup({ username: _username, password: _password, email: _email })} sx='!w-2/3 m-auto' />
        </div>
    )
}

export default SignupCard