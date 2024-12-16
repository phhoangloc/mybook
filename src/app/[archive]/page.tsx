'use client'
import React, { useState, useEffect } from 'react'
import {  ApiItem } from '@/api/client'
import Parallax from '@/components/display/parallax'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/display/loading'
import Notfound from '@/components/display/notfound'
import { MagazineDetail } from '@/components/display/detail'
import { ItemType } from '@/type/type'
import { useParams } from 'next/navigation'

const Page = () => {
    const params=useParams<{archive:string}>()
    const [notFound, setNotFound] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const query = useSearchParams()
    const useCategory = query.get("category")
    const [_items, set_items] = useState<ItemType[]>([])
    const [_item, set_item] = useState<ItemType>()
    const [_category, set_category] = useState<string>(useCategory || "")
    const geItem = async (archive: string, category: string) => {
        setLoading(true)
        const pages = await ApiItem({ archive: "page", slug: archive })
        if (pages.success && pages.data.length) {
            setLoading(false)
            set_item(pages.data[0])
        } else {
            const items = await ApiItem({ archive, category })
            if (items.error) {
                setNotFound(true)
            }
            if (items.success) {
                setLoading(false)
                set_items(items.data)
            } else {
                setLoading(false)
                set_item(undefined)
            }
        }

    }

    useEffect(() => {
        geItem(params.archive, _category)
    }, [_category, params.archive])

    useEffect(() => {
        if(useCategory) {set_category(useCategory)}else{set_category("")}  
    }, [useCategory])

    switch (params.archive) {
        case "blog":
            return (
                loading ? <Loading /> :
                    notFound ? <Notfound /> :
                        <Parallax data={_items} />
            )
        default:
            return (
                loading ? <Loading /> :
                    notFound ? <Notfound /> :
                        <MagazineDetail data={_item?_item:{}as ItemType} />
            )
    }
}

export default Page