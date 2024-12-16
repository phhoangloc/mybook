import Image from "next/image"
import moment from "moment"
import { useEffect, useState, useRef } from "react"
import { ItemType } from "@/type/type"
type TableType={
    title:string,
    content:string
}
type Props = {
    data: ItemType,
}
export const MagazineDetail = ({ data }: Props) => {

    const dangerous = useRef<HTMLDivElement>(null)

    const [_infor, set_infor] = useState<TableType[]>([])
    const [_visible, set_visible] = useState(true)


    useEffect(() => {
        if(data && data.infor){
            set_infor(JSON.parse(data?.infor))
        } 
    }, [data])


    useEffect(() => {
        setTimeout(() => {
            set_visible(false)
        }, 0);
    }, [])
    const dangerous_children  = dangerous.current?.children
    useEffect(() => {
        const handleScroll = () => {
            if (dangerous_children && dangerous_children.length) {
                for (let i = 0; i < dangerous_children.length; i++) {
                    dangerous_children[i].classList.add("opacity-0")
                    if (dangerous_children[i].getBoundingClientRect().top < (3 * window.innerHeight) / 4) {
                        dangerous_children[i].classList.add('textIn');

                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [dangerous_children])

    return (
        <div className='w-full xl:flex bg-lv-0'>
            <div className="flex w-full h-screen flex-col justify-center mx-auto p-4 gap-4 xl:sticky top-0">
                <div className={`w-full max-w-screen-md m-auto p-4 shadow-lg border rounded transition-all duration-1000 ${_visible ? "opacity-0" : "opacity-100"}`}>
                    <div className="relative overflow-hidden rounded">
                        {data?.cover?.name ?
                            <Image src={process.env.ftp_url + data?.cover.name} width={500} height={500} className={'w-full'} alt="cover" /> :
                            <div className="w-full h-full flex flex-col justify-center text-center">NO IMAGE</div>}
                    </div>
                    <div className='text-center w-full grid gap-4'>
                        <p className='font-bold max-w-screen-sm text-md md:text-xl xl:text-2xl py-2 font-serif m-auto'>{data?.name}</p>
                        <p className='opacity- text-sm'><span className='opacity-50'>Public Date:</span> {moment(data?.createdAt).format("YYYY/MM/DD")}</p>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden w-full bg-lv-1 ">
                <div className="h-screen flex flex-col justify-center text-center relative p-10">
                    <div className="h-[2px] w-[100px] absolute top-10 left-5 bg-lv-4"></div>
                    <div className="h-[2px] w-[100px] absolute top-[68px] -left-2 bg-lv-4 rotate-90"></div>
                    <div className="h-[2px] w-[100px] absolute bottom-10 right-5 bg-lv-4"></div>
                    <div className="h-[2px] w-[100px] absolute bottom-[68px] -right-2 bg-lv-4 rotate-90"></div>
                    <p className={`font-bold max-w-screen-sm text-2xl xl:text-3xl p-4 font-serif m-auto text-lv-11 transition-all duration-1000 ${_visible ? "opacity-0" : "!opacity-100"}`}>{data.name}</p>
                </div>
                <div className="h-12"></div>
                <div ref={dangerous} className='dangerous_box text-sm md:text-base text-justify p-4 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-sm xxl:max-w-screen-md m-auto'
                    dangerouslySetInnerHTML={{ __html: data?.content }} />
                {_infor.length ?
                    <div className="h-screen flex flex-col justify-center max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-sm xxl:max-w-screen-md m-auto px-4">
                        <div className="font-bold mb-4 pb-4   border-lv-4 text-xl font-serif">Infor</div>
                        {
                            _infor.map((tbl: TableType, index: number) =>
                                <div className="md:flex gap-4  mb-4 border-b   border-lv-4" key={index}>
                                    <div className="w-24 font-semibold ">{tbl.title}</div>
                                    <div className="w-full-24 text-left opacity-75 infor_box" dangerouslySetInnerHTML={{ __html: tbl.content }}></div>
                                </div>
                            )
                        }
                    </div> : null}
                <div className="h-screen"></div>
            </div>
        </div>
    )
}