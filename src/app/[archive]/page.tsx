'use client'
import React, { useState, useEffect } from 'react'
import { ApiItem } from '@/api/client'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/display/loading'
import Notfound from '@/components/display/notfound'
import { MagazineDetail } from '@/components/display/detail'
import { ItemType } from '@/type/type'
import { useParams } from 'next/navigation'
import Archive, { ArchiveBlog } from '@/components/display/archive'

const Page = () => {
    const params = useParams<{ archive: string }>()
    const [notFound, setNotFound] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const query = useSearchParams()
    const useCategory = query.get("category")
    const [_item, set_item] = useState<ItemType>()
    const [_category, set_category] = useState<string>(useCategory || "")
    const geItem = async (archive: string) => {
        setLoading(true)
        const pages = await ApiItem({ archive: "page", slug: archive })

        if (pages.success && pages.data.length != 0) {
            setLoading(false)
            set_item(pages.data[0])
        } else {
            const items = await ApiItem({ archive })

            if (items.error) {
                setNotFound(true)
            } else {
                setLoading(false)
            }
        }

    }

    useEffect(() => {
        geItem(params.archive)
    }, [_category, params.archive])

    useEffect(() => {
        if (useCategory) { set_category(useCategory) } else { set_category("") }
    }, [useCategory])

    switch (params.archive) {
        case "book":
            return (
                loading ? <Loading /> :
                    notFound ? <Notfound /> :
                        <Archive archive={params.archive} />
            )
        case "blog":
            return (
                loading ? <Loading /> :
                    notFound ? <Notfound /> :
                        <ArchiveBlog archive={params.archive} />
            )
        default:
            return (
                loading ? <Loading /> :
                    notFound ? <Notfound /> :
                        <MagazineDetail data={_item ? _item : {} as ItemType} />
            )
    }
}

export default Page