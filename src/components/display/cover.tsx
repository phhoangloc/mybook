import React, { useState, useEffect } from 'react'
import { ItemType } from '@/type/type'
import Image from 'next/image'
import { ApiItem } from '@/api/client'
import { useRouter } from 'next/navigation'
const Cover = () => {
    const [_book, set_book] = useState<ItemType>()

    const getBooks = async (archive: string, limit: number) => {
        const result = await ApiItem({ archive, limit })
        if (result.success) {
            set_book(result.data[0])
        } else {
            set_book(undefined)
        }
    }
    useEffect(() => {
        getBooks("book", 1)
    }, [])
    const toPage = useRouter()
    return (
        <div className='w-full m-auto h-[520px] bg-lv-1 shadow-md relative flex '>
            <div className="w-full xl:w-2/3 h-full sm:flex relative z-[1]">
                <div className='w-1/3 p-4 md:p-8 h-max m-auto'>
                    {_book ?
                        <Image src={process.env.ftp_url + _book.cover.name} width={500} height={500} className='w-full max-w-40 m-auto shadow-[12px_4px_4px_0px_rgba(0,0,0,0.25)]' alt='bookshelf' /> :
                        <Image src="https://image.buoncf.jp/mybook/image/2024.12.19_10-17-56_cd5d64edb967403901f6043c0291162e.jpg" width={500} height={500} className='w-full max-w-40 m-auto shadow-[12px_4px_4px_0px_rgba(0,0,0,0.25)]' alt='bookshelf' />}
                </div>
                <div className='sm:w-2/3 p-8 flex flex-col justify-center m-auto'>
                    {
                        _book ?
                            <>
                                <div className='text-2xl font-bold mb-4 text-lv-13'>{_book.name.toUpperCase()}</div>
                                <div className='text-justify line-clamp-3 opacity-75' dangerouslySetInnerHTML={{ __html: _book.content }}>
                                </div>
                                <div className='text w-max h-max py-1 px-4 my-4 mx-auto bg-lv-13 text-lv-0 rounded-lg cursor-pointer' onClick={() => toPage.push("/book/" + _book.slug)}>read more</div>
                            </>
                            :
                            <>
                                <div className='text-2xl font-bold mb-4 text-lv-13'>DOC HET TRAI TIM</div>
                                <div className='text-justify line-clamp-3 opacity-75'>
                                    Quyển sách hay dành cho doanh nhân và mọi giám đốc hay lãnh đạo công ty. Tác giả đồng thời là người sáng lập của thương hiệu Starbucks, chia sẻ câu chuyện đầy cảm hứng về cuộc đời của ông từ khi còn đi học đến khi trở thành CEO của một thương hiệu nổi tiếng trên toàn thế giới...
                                </div>
                                <div className='text w-max h-max py-1 px-4 my-4 mx-auto bg-lv-13 text-lv-0 rounded-lg'>read more</div></>

                    }

                </div>

            </div>
            <div className='w-1/3 hidden xl:flex flex-col justify-end opacity-75'>
                <Image src="/image/bookshelf.png" width={500} height={500} className='w-full h-auto' alt='bookshelf' />
                <Image src="/image/bookshelf.png" width={500} height={500} className='w-full h-auto' alt='bookshelf' />
            </div>
            <div className='w-1/2 lg:w-1/4 absolute bottom-0 flex z-0 opacity-50'>
                <Image src="/image/book.png" width={500} height={500} className='w-full h-auto' alt='bookshelf' />
                <Image src="/image/book.png" width={500} height={500} className='w-full h-auto' alt='bookshelf' />
            </div>


        </div>
    )
}

export default Cover