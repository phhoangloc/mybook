
import { ItemType } from "@/type/type"
import Image from "next/image"
import { useState } from "react"

export type CardType = {
    item: ItemType,
    sx?: string,
    onClick?: () => void,
}

export const CardBook = ({ item, sx, onClick }: CardType) => {
    const [_onMouse, set_onMouse] = useState<boolean>(false)

    return (
        <div className={`w-52 md:w-60 lg:w-64 cardIn  relative select-none overflow-hidden  ${sx ? sx : ""}`} onMouseUp={() => { if (onClick) { onClick() } }}>
            <div className={`absolute top-0 left-0 w-full h-full z-[1] transition-all duration-500 flex flex-col justify-center p-4 `} onMouseEnter={() => set_onMouse(true)} onMouseLeave={() => set_onMouse(false)} >
            </div>
            <div className="w-full h-full flex flex-col justify-end p-4">
                <div className={`w-full overflow-hidden text-center border relative rounded transition-all duration-500 ${_onMouse ? "-translate-y-2 shadow-lg" : ""}`} >
                    <div className="relative overflow-hidden flex flex-col justify-center rounded" >
                        {item.cover ?

                            <Image className={`h-auto w-full m-auto`} width={500} height={500} alt='img' src={process.env.ftp_url + item.cover.name} /> :
                            <div className='aspect-square flex flex-col justify-center'></div>}
                    </div>

                </div>
            </div>
        </div>
    )
}
export const CardBlog = ({ item, sx, onClick }: CardType) => {
    const [_onMouse, set_onMouse] = useState<boolean>(false)

    return (
        <div className={`w-max cardIn   cursor-pointer relative select-none overflow-hidden h-64 lg:h-96  ${sx ? sx : ""}`} onMouseUp={() => { if (onClick) { onClick() } }}>
            <div className={`absolute top-0 left-0 w-full h-full z-[1] transition-all duration-500 flex flex-col justify-center`} onMouseEnter={() => set_onMouse(true)} onMouseLeave={() => set_onMouse(false)} >
            </div>
            <div className={`w-full h-full flex flex-col justify-end p-4 `}>
                <div className={`w-full overflow-hidden text-center relative border rounded transition-all duration-500 bg-lv-0 ${_onMouse ? "-translate-y-2 shadow-lg" : ""}`} >

                    <div className="relative overflow-hidden flex flex-col justify-center " >
                        {item.cover ?

                            <Image className={`h-32  lg:h-48 w-auto transition-all duration-500 `} width={500} height={500} alt='img' src={process.env.ftp_url + item.cover.name} priority /> :
                            <div className='aspect-square flex flex-col justify-center'></div>}
                    </div>
                    <div className={`h-24 lg:h-28 w-full relative`}>
                        <p className={`text-xs  font-semibold text-wrap  overflow-hidden text-center absolute w-full p-2`}>{item.name.toUpperCase()}</p>
                        <div className="absolute flex bottom-1 w-full">
                            {/* <p className={`w-24 text-xs font-semibold text-wrap  overflow-hidden text-center m-auto font-serif `}>{translateCategory(item.category.name).toUpperCase()}</p> */}
                            <div className="text-xs text-justify hidden lg:block h-12 w-full m-auto opacity-75 px-2 overflow-hidden" dangerouslySetInnerHTML={{ __html: item.content }} />
                        </div>
                    </div>

                    {/* <div className="h-24"></div>
                    <div className=" w-full absolute z-[0] text-left bottom-0 h-24 gap-4 p-4">
                        <p className="font-bold text-center font-serif  flex flex-col justify-center h-max m-auto ">{item.archive.toUpperCase()}<br></br><span className="text-sm border-t-2 opacity-75">{item.category.name}</span></p>
                        <div className="text-xs hidden  !font-normal line-clamp-4 h-max m-auto opacity-75" dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div> */}

                </div>
            </div>
        </div>
    )
}