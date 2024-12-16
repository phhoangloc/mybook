'use client'
import React, { useState, useEffect } from 'react'
import Parallax from './parallax'
import { ItemType } from '@/type/type'
type props = {
    data?: ItemType[]
    category?: string
}
const Footer = ({ data, category }: props) => {

    const [scrollY, setScrollY] = useState<number>(0);
    const [_innerHeight, set_innerHeight] = useState<number>(window.innerHeight);
    const [clientHieght, setclientHieght] = useState<number>(0);

    useEffect(() => {
        window.addEventListener('scroll', () => { setScrollY(window.scrollY); set_innerHeight(window.innerHeight); setclientHieght(document.body.scrollHeight) });
        return () => {
            window.removeEventListener('scroll', () => { setScrollY(window.scrollY); set_innerHeight(window.innerHeight); setclientHieght(document.body.scrollHeight) });
        };
    }, []);

    return (
        <div className={`w-full h-[100vh] fixed overflow-hidden transition-all duration-500 flex flex-col justify-end z-10  ${scrollY && scrollY + _innerHeight + 1 >= clientHieght ? "bottom-[0%] backdrop-brightness-75" : "bottom-[-100%]"} `}>
            <div className=" bg-lv-0  rounded-t-[25px] flex flex-col justify-end">
                <div className="h-12 font-bold text-center text-lg flex flex-col justify-center"> {category ? category.toUpperCase() + " RELATIVE" : ""}</div>
                <Parallax data={data ? data : []} />
            </div>
        </div>
    )
}

export default Footer