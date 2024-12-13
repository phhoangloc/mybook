'use client'
import React, { useEffect, useState } from 'react'
import { EditDetailbyId, EditDetailbySlug } from '@/components/display/detail'
import store from '@/redux/store'
import { ApiItemUser, ApiCreateItem, ApiUpdateItem } from '@/api/user'
import { setNotice } from '@/redux/reducer/noticeReducer'
import { useRouter, useParams } from 'next/navigation'
import { UserType } from '@/redux/reducer/UserReduce'
export type ItemType={
    id:number,
    archive:string
    name:string
    slug:string
    coverId:number,
    cover:{
        name:string,
    }
    host:{
        username:string,
    }
    categoryId:number,
    category:{
        name:string,
    }
    content:string
    infor:string
    createdAt:Date,
    updateDate:Date,
}
const Page = () => {
    const params = useParams<{ archive: string, slug: string }>()
    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    })

    const [_item, set_item] = useState<ItemType & UserType>()

    const toPage = useRouter()
    //get Item
    useEffect(() => {
        const getItems = async (position: string, archive: string, slug: string) => {
            const result = archive === "user" ? await ApiItemUser({ position, archive, id: Number(slug) }) : await ApiItemUser({ position, archive, slug })
            if (result.success) {
                set_item(result.data[0])
            } else {
                set_item(undefined)
            }
        }
        getItems(currentUser.position, params.archive, params.slug)
    }, [currentUser.position, params.archive, params.slug])

    //create Item
    const createNewItem = async (p: string, g: string, body: ItemType) => {
        if (body.name && body.slug) {
            const result = await ApiCreateItem({ position: p, archive: g }, body)
            if (result.success) {
                store.dispatch(setNotice({ success: false, msg: result.message, open: true }))
                setTimeout(() => {
                    toPage.push("/" + params.archive + "/" + body.slug)
                    store.dispatch(setNotice({ success: false, msg: "", open: false }))
                }, 3000)
            } else {
                store.dispatch(setNotice({ success: false, msg: result.message, open: true }))
            }
        } else {
            store.dispatch(setNotice({ success: false, msg: "you must input title and slug", open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        }
    }

    //update Item
    const updateAnItem = async (p: string, g: string, id: number, body: ItemType) => {
        const result = await ApiUpdateItem({ position: p, archive: g, id: id }, body)
        if (result.success) {
            store.dispatch(setNotice({ success: true, msg: result.message, open: true }))
            setTimeout(() => {
                toPage.push("/" + params.archive + "/" + body.slug)
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        } else {
            store.dispatch(setNotice({ success: false, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: false, msg: "", open: false }))
            }, 3000)
        }
    }
    switch (params.archive) {
        case "user":
            return <EditDetailbyId archive={params.archive} slug={params.slug} item={_item} />
        default:
            return <EditDetailbySlug archive={params.archive} slug={params.slug} item={_item}
                createItem={(body) => createNewItem(currentUser.position, params.archive, body)}
                updateItem={(id, body) => updateAnItem(currentUser.position, params.archive, id, body)} />
    }

}

export default Page