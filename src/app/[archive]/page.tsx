'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import store from '@/redux/store'
import { AlertType, setAlert } from '@/redux/reducer/alertReducer'
import { UserType } from '@/redux/reducer/UserReduce'
import { ApiItemUser, ApiCreateItem, ApiUpdateItem, ApiDeleteItem } from '@/api/user'
import { ApiLogin, ApiSignup } from '@/api/client'
import { setNotice } from '@/redux/reducer/noticeReducer'
import { setRefresh } from '@/redux/reducer/RefreshReduce'
import LoginCard from '@/components/card/loginCard'
import SignupCard from '@/components/card/signupCard'
import { Archive, ArchivePic, ArchiveCategory } from '@/components/display/archive'
import Notfound from '@/components/display/notfound'
import { ItemType } from './[slug]/page'
const Page = () => {

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const [currentAlert, setCurrentAlert] = useState<AlertType>(store.getState().alert)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentAlert(store.getState().alert))
    }

    useEffect(() => {
        update()
    })

    const params = useParams<{ archive: string }>()
    const archive = params.archive
    const [_id, set_Id] = useState<number>(0)
    const [items, setItems] = useState<(ItemType & UserType)[]>([])
    const [notFound, setNotFound] = useState<boolean>(false)

    const [_refresh, set_refresh] = useState<number>(0)

    //page
    const limit: number = params.archive === "pic" ? 23 : 20
    const currentPage = Number(useSearchParams().get("page"))

    //get Item //
    const getItems = async (position: string, archive: string, page: number, limit: number) => {
        const result = await ApiItemUser({ position, archive, skip: page * limit, limit })

        if (result.success) {
            setItems(result.data)
        } else {
            setNotFound(true)
        }

    }

    useEffect(() => {
        if (archive !== "login" && archive !== "signup") {
            getItems(currentUser.position, archive, currentPage, limit)
        }
    }, [archive, _refresh, currentPage, currentUser.position, limit])

    // useRouter //
    const toPage = useRouter()
    //login //
    const login = async (data: { username: string, password: string }) => {
        const result = await ApiLogin(data)
        if (result.success) {
            store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
                localStorage.token = "bearer " + result.result
                store.dispatch(setRefresh())
                toPage.push("/")
            }, 3000)
        } else {
            store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
            }, 3000)
        }
    }
    //signup //
    const signup = async (body: { username: string, password: string, email: string }) => {
        const result = await ApiSignup(body)
        if (result.success) {
            store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
                toPage.push("/login")
            }, 3000)
        } else {
            store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
            }, 3000)
        }
    }
    //create Item //
    const createItem = async (position: string, archive: string, body: unknown) => {
        const result = await ApiCreateItem({ position, archive }, body)
        if (result.success) {
            set_refresh(n => n + 1)
        }
    }
    //update Item //
    const updateItem = async (position: string, archive: string, id: number, body: unknown) => {
        const result = await ApiUpdateItem({ position, archive, id }, body)
        if (result.success) {
            set_refresh(n => n + 1)
        }
    }
    // delete Item //
    const deleteItem = async (position: string, archive: string, id: number) => {
        const result = await ApiDeleteItem({ position, archive, id })
        if (result.success) {
            set_refresh(n => n + 1)
            store.dispatch(setAlert({ open: false, value: false, msg: "" }))
            set_Id(0)
        }
    }
    useEffect(() => {
        if (_id !== 0 && currentAlert.value) { deleteItem(currentUser.position, params.archive, _id) }
    }, [_id, currentAlert.value, currentUser.position, params.archive])


    //route//
    switch (params.archive) {
        case "login":
            return (
                <div className='h-full-12 relative flex flex-col justify-center'>
                    <LoginCard login={(body) => login(body)} />
                </div>
            )
        case "signup":
            return (
                <div className='h-full-12 relative flex flex-col justify-center'>
                    <SignupCard signup={(body) => signup(body)} apicheckemail={process.env.api_url + "api/checkuser?email="} apicheckusername={process.env.api_url + "api/checkuser?username="} />
                </div>
            )
        case "pic":
            return (
                <ArchivePic archive={params.archive}
                    items={items}
                    refresh={() => set_refresh(n => n + 1)}
                    page={currentPage}
                    next={() => toPage.push(`?page=${currentPage + 1}`)}
                    prev={() => toPage.push(`?page=${currentPage - 1}`)}
                    endPage={items.length < limit} />

            )
        case "category":
            return (
                <ArchiveCategory archive={params.archive} items={items}
                    createItem={(body) => createItem(currentUser.position, params.archive, body)}
                    editItem={(id, body) => updateItem(currentUser.position, params.archive, id, body)}
                    deleteItem={(id) => { store.dispatch(setAlert({ open: true, value: false, msg: "are you sure to delete this Category" })); set_Id(id) }} />
            )
        default:
            return (
                // notFound ? <Notfound sx='h-full-20' /> :
                notFound ?
                    <Notfound sx="!h-full-12" /> :
                    <Archive items={items} archive={params.archive}
                        deleteItem={(id) => deleteItem(currentUser.position, params.archive, id)}
                        page={currentPage}
                        next={() => toPage.push(`?page=${currentPage + 1}`)}
                        prev={() => toPage.push(`?page=${currentPage - 1}`)}
                        endPage={items.length < limit}
                    />
            )
    }

}

export default Page