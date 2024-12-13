import React, { useState } from 'react'
import { Input } from '../tool/input/input';
import Link from 'next/link';
import { Button } from '@/components/button/button';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
type Props = {
    login: (body: {username:string,password:string}) => void
}

const LoginCard = ({ login }: Props) => {

    const [_username, set_username] = useState<string>("")
    const [_password, set_password] = useState<string>("")

    const [showPassword, setShowPassword] = useState<boolean>(false)



    return (
        <div className='bg-lv-0 dark:bg-lv-18 m-auto w-11/12 max-w-[440px] text-center p-10 shadow-md grid gap-1 rounded '>
            <div className="h-12 flex flex-col justify-center text-2xl font-bold">
                <h2>Login</h2>
            </div>
            <Input name="Username" onChange={(v) => set_username(v)} value={_username} />
            <Input name="Password" type={showPassword ? 'text' : 'password'} onChange={(v) => set_password(v)} value={_password}
                icon1={showPassword ?
                    <RemoveRedEyeIcon className='w-6 h-6 my-auto mx-1 cursor-pointer hover:text-colormain' onClick={() => setShowPassword(false)} /> :
                    <VisibilityOffIcon className='w-6 h-6 my-auto mx-1 cursor-pointer hover:text-colormain' onClick={() => setShowPassword(true)} />} />
            <div className="h-12">
            </div>
            <div className="h-12 flex flex-col justify-center">
                <p className='opacity-50 hover:opacity-100 cursor-pointer hover:text-colormain flex w-max m-auto'>Log in by google</p>
            </div>
            <div className="h-12 flex flex-col justify-center">
                <p>You do not have an account</p>
                <Link className='opacity-50 hover:opacity-100 hover:text-colormain' href={"signup"}>Sign Up!</Link>
            </div>
            <div className="h-12">
            </div>
            <Button name="Log In" onClick={() => login({ username: _username, password: _password })} sx='!w-2/3 m-auto' />

        </div>
    )
}

export default LoginCard