'use cliemt'
import React, { useState, useEffect } from 'react'
import { ItemType } from '@/type/type'
import { ApiItem } from '@/api/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Loading from './loading'
import moment from 'moment'
type Props = {
    archive: string
}

const Archive = ({ archive }: Props) => {
    const [_categories, set_categories] = useState<ItemType[]>([])
    const [_category_name, set_category_name] = useState<string>("")
    const getCategories = async (archive: string) => {
        const result = await ApiItem({ archive })
        if (result.success) {
            set_categories(result.data)
        } else {
            set_categories([])
        }
    }
    useEffect(() => {
        getCategories("category")
    })
    const [_books, set_books] = useState<ItemType[]>([])
    const [_loading, set_loading] = useState<boolean>(false)
    const getBooks = async (archive: string, category: string | null, limit: number) => {
        set_loading(true)
        const result = await ApiItem({ archive, category: category ? category : undefined, limit })
        if (result.success) {
            set_loading(false)
            set_books(result.data)
        } else {
            set_loading(false)
            set_books([])
        }
    }
    useEffect(() => {
        getBooks(archive, _category_name, 12)
    }, [_category_name, archive])
    const toPage = useRouter()

    const [_cateOpen, set_cateOpen] = useState<boolean>(false)
    return (
        <div>
            <div className="h-[600px] bg-lv-1 flex flex-col justify-center text-center text-2xl font-bold" style={{ background: "rgba(255,255,255,0.5) url(/image/wallpaper.png) center", backgroundRepeat: "none", backgroundSize: "cover", backgroundBlendMode: "color" }}>
            </div>
            <div className="h-24"></div>
            <div className="max-w-screen-xl m-auto flex relative">
                <div className={`${_cateOpen ? "w-full" : "w-0"} absolute top-12 left-0 z-[1] lg:relative max-w-48 overflow-hidden transition-all duration-300 bg-white rounded shadow-lg border lg:w-full lg:shadow-none lg:border-none`}>
                    <div className="flex w-48 justify-between pl-3"><div className='h-12  flex flex-col justify-center font-bold'>THỂ LOẠI</div><CloseIcon className='!h-12 !w-12 p-3 cursor-pointer lg:!hidden' onClick={() => set_cateOpen(false)} /></div>
                    <div className='h-12 w-48 flex flex-col justify-center cursor-pointer px-3' onClick={() => set_category_name("")} >Tất cả</div>
                    {_categories.map((category, index) => <div className='h-12 w-48 flex flex-col justify-center cursor-pointer px-3' onClick={() => set_category_name(category.name)} key={index}>{category.name}</div>)}
                </div>
                <div className='w-full lg:w-full-48'>
                    <div className='flex justify-between h-12'>
                        <div className='h-12 flex flex-col justify-center'><MenuIcon className='!w-6 !h-6 m-auto cursor-pointer lg:!hidden' onClick={() => set_cateOpen(true)} /></div>
                        <div className='h-12 flex flex-col justify-center text-2xl font-bold'>BOOK</div>
                        <div className='h-12 flex flex-col justify-center'></div>
                    </div>
                    <div className="h-12"></div>
                    {_loading ? <Loading /> : _books.length ?
                        <div className=" grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 ">
                            {_books.map((book: ItemType, index: number) =>
                                <div key={index} className="col-span-1 w-full p-4 flex flex-col justify-end" onClick={() => toPage.push("/book/" + book.slug)}>
                                    <Image src={process.env.ftp_url + book.cover.name} width={500} height={500} alt="cover" className="w-full h-auto shadow-[12px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer transition-all duration-500 hover:-translate-y-4" />
                                </div>
                            )}
                        </div> : <div className="p-4">No Book</div>}
                </div>

            </div>

        </div>
    )
}

export default Archive

export const ArchiveBlog = ({ archive }: Props) => {

    const [_items, set_items] = useState<ItemType[]>([])
    const [_loading, set_loading] = useState<boolean>(false)
    const getBooks = async (archive: string, limit: number) => {
        set_loading(true)
        const result = await ApiItem({ archive, limit })
        if (result.success) {
            set_loading(false)
            set_items(result.data)
        } else {
            set_loading(false)
            set_items([])
        }
    }
    useEffect(() => {
        getBooks(archive, 12)
    }, [archive])
    const toPage = useRouter()

    return (
        <div>
            <div className="h-[600px] bg-lv-1 flex flex-col justify-center text-center text-2xl font-bold" style={{ background: "rgba(255,255,255,0.5) url(/image/wallpaper.png) center", backgroundRepeat: "none", backgroundSize: "cover", backgroundBlendMode: "color" }}>
            </div>
            <div className="h-24"></div>
            <div className="max-w-screen-xl m-auto flex relative">
                <div className='w-full lg:w-full-48'>
                    <div className='flex justify-between h-12'>
                        <div className='h-12 flex flex-col justify-center text-2xl font-bold'>{archive.toLocaleUpperCase()}</div>
                    </div>
                    <div className="h-12"></div>
                    {_loading ? <Loading /> : _items.length ?
                        <div className="">
                            {_items.map((item: ItemType, index: number) =>
                                <div key={index} className="h-12 w-full flex gap-4 border-b-2 pb-2" onClick={() => toPage.push("/" + item.archive + "/" + item.slug)}>
                                    <div className='flex flex-col justify-end'>{moment(item.createdAt).format("YYYY/MM/DD")}</div>
                                    <p className='flex flex-col justify-end text-lg font-semibold'>{item.name}</p>
                                </div>
                            )}
                        </div> : <div className="p-4">No {archive}</div>}
                </div>

            </div>

        </div>
    )
}