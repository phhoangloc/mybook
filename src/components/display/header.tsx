import React, { useState, useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import store from '@/redux/store';
import { setMenu } from '@/redux/reducer/MenuReduce';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { UserType } from '@/redux/reducer/UserReduce';
import { setRefresh } from '@/redux/reducer/RefreshReduce';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import { IconDivider } from '../tool/icon/icon';
import NotificationsIcon from '@mui/icons-material/Notifications';
const Header = () => {

    const params = useParams()
    const toPage = useRouter()
    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    })
    const dropDataLogin = [
        {
            name: "Profile",
            func: () => toPage.push("/admin/profile")
        },
        {
            name: "Log Out",
            func: () => { localStorage.clear(); store.dispatch(setRefresh()) }
        }]
    const dropDataLogout = [
        {
            name: "Login",
            func: () => toPage.push("/admin/login")
        },
        {
            name: "Sign Up",
            func: () => toPage.push("/admin/signup")
        }
    ]
    const notifications = currentUser.notifications.map(n => { return { name: n.notification.content, status: n.status } })
    const notificationsUnread = currentUser.notifications.filter(n => n.status === false).map(n => { return { name: n.notification.content, status: n.status } })
    return (
        <div className=" rounded h-12 flex text-lv-11 dark:text-lv-0  w-full top-0">
            <MenuIcon className="cursor-pointer !w-12 !h-12 p-2 opacity-75 hover:opacity-100 xl:!hidden" onClick={() => store.dispatch(setMenu(true))} />
            <div className="h-full w-full-12 xl:w-full gap-1 flex font-bold ">
                <Image src={"/logo.png"} width={48} height={48} alt='logo' className=' p-2 hidden xl:block' />
                <div className="h-12 font-bold text-xl flex cursor-pointer">
                    <p className='h-full flex flex-col justify-center'>{params.archive ? params.archive === "pic" ? "IMAGES" : params.archive.toString().toUpperCase() : "ADMIN"}</p>
                </div>
                <div className='h-12 w-12 ml-auto mf-0 p-2 relative '>
                    <div>
                        {notificationsUnread.length ? <p className='w-4 h-4 absolute text-xs flex flex-col justify-center text-center rounded-[50%] right-0 bg-lv-18 text-lv-1 dark:bg-lv-0 dark:text-lv-18 text'>{notificationsUnread.length}</p> : null}
                        <NotificationsIcon className='!h-full !w-full my-auto ml-auto mr-0 ' />
                    </div>
                    <div className='absolute top-12 right-0 w-[375px] bg-lv-1 dark:bg-lv-19 shadow-md border border-lv-2 dark:border-lv-17 p-2 rounded'>
                        {
                            notifications.map((n, index) =>
                                <div key={index} className='cursor-pointer text-sm font-light border-b p-1 border-lv-2 dark:border-lv-17'>
                                    {n.name}
                                </div>)
                        }
                    </div>
                </div>
                <IconDivider
                    sx='cursor-pointer'
                    icon={
                        currentUser.avata ? <Image src={process.env.ftp_url + currentUser.avata.name} width={36} height={36} alt='avata' /> : <PersonIcon className='!w-full !h-full' />
                    } data={currentUser ? dropDataLogin : dropDataLogout} />

            </div>
        </div>
    )
}

export default Header