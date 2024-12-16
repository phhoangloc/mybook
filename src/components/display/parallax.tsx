'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardBlog } from './cards'
import { ItemType } from '@/type/type'

type Props = {
    data: ItemType[],
    sx?: string,
    subsx?: string,
}

const Parallax = ({ data, sx, subsx }: Props) => {

    const parallax = useRef<HTMLDivElement>(null)
    const parallaxChild =  useRef<HTMLDivElement>(null)
    const [isScroll, setIsScroll] = useState<boolean>(false)
    const [mouseDown, setMouseDown] = useState<boolean>(false)
    const [startX, setStartX] = useState<number>(0)
    const [startY, setStartY] = useState<number>(0)
    const [scrollTop, setScrollTop] = useState<number>(0)
    const [scrollLeft, setScrollLeft] = useState<number>(0)

    const onHandleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsScroll(true)
        if(parallax.current){
            parallax.current.scrollLeft = scrollLeft - ((e.pageX - startX))
            parallax.current.scrollTop = scrollTop - ((e.pageY - startY))
        }
    }

    useEffect(() => {
        if(parallaxChild.current && parallaxChild.current.clientWidth &&  parallax.current ){
            parallax.current.scrollLeft = (parallaxChild.current.clientWidth - window.innerWidth) / 2
            parallax.current.scrollTop = (parallaxChild.current?.clientHeight - window.innerHeight) / 2 

            // parallaxChild.current?.clientWidth ? parallax.current.scrollLeft = `${(parallaxChild.current.clientWidth - window.innerWidth) / 2}` : null
            // parallaxChild.current?.clientHeight ? parallax.current.scrollTop = `${(parallaxChild.current?.clientHeight - window.innerHeight) / 2}` : null
        }
    }, [])

    const toPage = useRouter()
    return (
        <div ref={parallax}
            className={`w-full h-full scroll_none overflow-scroll cursor-grab active:cursor-grabbin ${sx}`}
            onMouseDown={(e) => { setMouseDown(true); setStartX(e.pageX); setStartY(e.pageY); setScrollTop(e.currentTarget.scrollTop); setScrollLeft(e.currentTarget.scrollLeft) }}
            onMouseMove={(e) => { if(mouseDown){  onHandleMouseMove(e)} }}
            onMouseUp={() => { setMouseDown(false); setIsScroll(false) }}
            onMouseLeave={() => { setMouseDown(false); setIsScroll(false) }}>
            <div ref={parallaxChild} className={`w-[4000px] flex flex-wrap justify-center z-[1] md:gap-x-4 lg:gap-x-8  relative bg-gradient-to-b from-lv-0 to-lv-1  bg-repeat bg-auto-64 lg:bg-auto-96 ${subsx}`} >
                {data.length ?
                    data.map((item, index) =>
                        <CardBlog item={item} key={index} onClick={() => isScroll ? null : toPage.push("/" + item.archive + "/" + item.slug)} />) :
                    <div> no data</div>}
            </div>
        </div >
    )

}

export default Parallax