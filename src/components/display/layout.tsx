import Image from 'next/image'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div className='grid grid-cols-12'>
            <div className='hidden xl:block col-span-2'>
                <div className="h-screen sticky top-0 flex flex-col justify-between w-11/12 m-auto  ">
                    <Image src={"/image/hanging_light.png"} width={500} height={500} className=' w-1/3 mx-auto ' alt="cover" />
                    <Image src={"/image/bookshelf_v2.png"} width={400} height={400} className=' w-11/12 mx-auto opacity-75' alt="cover" />
                </div>
            </div>
            <div className='w-full col-span-12 xl:col-span-8'>
                {children}
            </div>
            <div className='hidden xl:block col-span-2'>
                <div className="h-screen sticky top-0 flex flex-col justify-between w-12/12 m-auto ">
                    <Image src={"/image/hanging_light.png"} width={500} height={500} className=' w-1/4 mx-auto ' alt="cover" />
                    <Image src={"/image/picture_frame.png"} width={500} height={500} className=' w-5/6 mx-auto ' alt="cover" />
                    <Image src={"/image/potted_plant.png"} width={500} height={500} className='w-full' alt="cover" />
                </div>
            </div>
        </div>
    )
}

export default Layout