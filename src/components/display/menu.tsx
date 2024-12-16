'use client'

import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { useRouter } from 'next/navigation'
import CloseIcon from '@mui/icons-material/Close';
import { setMenu } from '@/redux/reducer/MenuReduce';
import { ApiItem } from '@/api/client'
import { translateCategory } from '@/data/fuction'
import { ItemType } from '@/type/type';

export const menus = [
    {
        name: "GIỚI THIỆU",
        link: "/about"
    },
    {
        name: "LIÊN HỆ",
        link: "/contact"

    },

]

export const Menu = () => {

    const [currentMenu, setCurrentMenu] = useState<boolean>(store.getState().menu)

    const update = () => {
        store.subscribe(() => setCurrentMenu(store.getState().menu))
    }

    useEffect(() => {
        update()
    })

    const toPage = useRouter()
    const [_category, set_category] = useState<ItemType[]>([])
    const getCategory = async () => {
        const result = await ApiItem({ archive: "category" })
        if (result.success) {
            set_category(result.data)
        } else {
            set_category([])
        }
    }
    useEffect(() => {
        getCategory()
    }, [])

    return (
        <div className={`${currentMenu ? "w-screen" : "w-0"}  bg-lv-1 fixed h-screen transition-all duration-300 delay-200 z-30 overflow-auto scroll_none`}>

            <CloseIcon className='!w-12 !h-12 p-2  top-0 cursor-pointer absolute right-4' onClick={() => store.dispatch(setMenu(false))} />
            <div className="flex w-full h-full">
                <div className=" w-full max-w-screen-xs">
                    <div className=" flex pt-4 p-4">
                        <div className='flex text-2xl h-full font-bold cursor-pointer' onClick={() => {
                            store.dispatch(setMenu(false));
                            setTimeout(() => {
                                toPage.push("/")
                            }, 500);
                        }}>BuônCF</div>

                    </div>
                    <div className="grid gap-1 p-4">
                        {
                            menus.map((item, index) =>
                                <div key={index} className={`w-max p-2 flex flex-col justify-center  cursor-pointer text-sm lg:text-base text-left hover:text-lv-11`}
                                    onClick={() => {
                                        store.dispatch(setMenu(false));
                                        setTimeout(() => {
                                            if(item.link ){ toPage.push(item.link)}
                                        }, 500);
                                    }}>
                                    {item.name}
                                </div>

                            )
                        }
                    </div>
                    <div className="text-xl font-bold px-4 my-4">BLOG</div>
                    <div className="grid gap-1 p-4">
                        {
                            _category.map((item, index) =>
                                <div key={index} className={`w-max p-2 flex flex-col justify-center  cursor-pointer text-sm  lg:text-base text-left hover:text-lv-11`}
                                    onClick={() => {
                                        store.dispatch(setMenu(false));
                                        setTimeout(() => {
                                            toPage.push("/blog?category=" + item.name)
                                        }, 500);
                                    }}>
                                    {translateCategory(item.name).toUpperCase()}
                                </div>

                            )
                        }
                    </div>
                </div>
                <div className="hidden w-full-sx lg:block">

                </div>
            </div>

        </div>

    )
}