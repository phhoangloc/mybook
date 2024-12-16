'use client'
import React, { useState, useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import store from '@/redux/store';
import { setMenu } from '@/redux/reducer/MenuReduce';
import { useRouter } from 'next/navigation';
import { menus } from './menu';



const Header = () => {
    const [currentMenu, setCurrentMenu] = useState<boolean>(store.getState().menu)
    const update = () => {
        store.subscribe(() => setCurrentMenu(store.getState().menu))
    }
    useEffect(() => {
        update()
    })
    const [, setScrollY] = useState<number>(0);
    const [scrollUp, setScrollUp] = useState<boolean>(false);
    const [, setOuterHeight] = useState<number>();

    const handleWheel = (event: WheelEvent) => {
        if (event.deltaY > 0) {
            setScrollUp(true);
        } else {
            setScrollUp(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', () => { setScrollY(window.scrollY); setOuterHeight(window.outerHeight) });
        window.addEventListener('wheel', (e) => handleWheel(e));
        return () => {
            window.removeEventListener('wheel', (e) => handleWheel(e));
            window.removeEventListener('scroll', () => { setScrollY(window.scrollY); setOuterHeight(window.outerHeight) });
        };
    }, []);

    const toPage = useRouter()

    return (
        <div className={` fixed w-screen top-0 left-0  transition-all duration-500 z-10 text-lv-11 ${scrollUp ? "-translate-y-full opacity-0" : "translate-y-0 opacity-1"}`}>
            <div className={`rounded flex justify-between max-w-screen-xxl m-auto px-2`}>
                <div className='h-12 flex'>
                    <MenuIcon className='!w-12 !h-12 p-2 md:!hidden cursor-pointer' onClick={() => store.dispatch(setMenu(true))} />
                    <div className='flex text-xl h-full font-bold cursor-pointer flex-col justify-center text-lv-11' onClick={() => toPage.push("/")}>BuônCF</div>
                </div>
                <div className="hidden md:flex rounded gap-x-2 px-2">
                    {
                        menus.map((item, index) =>
                            < div key={index} className={`h-12 w-24 flex flex-col justify-center font-bold transition-all duration-100 cursor-pointer opacity-75 hover:opacity-100 text-sm text-center `}
                                onClick={(e) => { e.stopPropagation(); if(item.link) { toPage.push(item.link)}  }}>
                                {item.name}
                            </div>

                        )
                    }
                    <MenuIcon className='!w-12 !h-12 p-3 hidden md:block  top-0 cursor-pointer ' onClick={() => store.dispatch(setMenu(!currentMenu))} />

                </div>
            </div>
        </div>
    )
}

export default Header
