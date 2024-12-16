'use client'
import { ApiItem } from '@/api/client'
import { MagazineDetail } from '@/components/display/detail'
import Footer from '@/components/display/footer'
import React, { useEffect, useState } from 'react'
import { ItemType } from '@/type/type'
import { useParams } from 'next/navigation'


const Page = () => {

    const params=useParams<{archive:string,slug:string}>()
    const [data, setData] = useState<ItemType>()
    const [_category, set_category] = useState<string>("")
    const [dataFooter, setDataFooter] = useState<ItemType[]>()


    useEffect(() => {
        const getItemBySlug = async () => {
            const result = await ApiItem({ archive: params.archive, slug: params.slug })
            if (result.success && result.data[0]) {
                setData(result.data[0])
                set_category(result.data[0].category?.name)
            } else {
                setData(undefined)
            }
        }
        getItemBySlug()
    }, [params])
    useEffect(() => {
        const getItemRest = async (category: string) => {
            const result = await ApiItem({ archive: params.archive, category, limit: 10 })
            if (result.success) {
                setDataFooter(result.data)
    
            } else {
                setDataFooter([])
            }
        }
        if(_category){
            getItemRest(_category)
        }  
    }, [_category, params.archive])

    return (
        <div>
            <MagazineDetail data={data?data:{} as ItemType} />
            <Footer category={_category} data={dataFooter} />
        </div>
    )
}

export default Page