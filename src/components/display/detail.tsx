'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import store from '@/redux/store';
import { Input } from '../tool/input/input';
import { Button } from '../button/button';
import EditPicture, { EditAvatar } from '../tool/picture/editPicture'
import { ModalType, setModal } from '@/redux/reducer/ModalReducer';
import { TextAreaTool } from '../tool/input/textarea';
import moment from 'moment';
import { ApiItemUser } from '@/api/user';
import Link from 'next/link'
import { DividerSelect } from '../tool/divider/divider';
import { ApiItem } from '@/api/client';
import { InputTable } from '../tool/input/inputTable';
import { ItemType } from '@/app/[archive]/[slug]/page';
import { UserType } from '@/redux/reducer/UserReduce';

type Props = {
    archive: string,
    slug: string,
    item?: (ItemType & UserType),
    createItem?: (body: (ItemType & UserType)) => void
    updateItem?: (id: number, body: (ItemType & UserType)) => void

}

export const EditDetailbySlug = ({ archive, slug, item, createItem, updateItem }: Props) => {

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const [currentModal, setCurrentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentModal(store.getState().modal))
    }

    useEffect(() => {
        update()
    })

    const [_id, set_id] = useState<number>(0)
    const [_isCoverId, set_isCoverId] = useState<boolean>(false)
    const [_coverId, set_coverId] = useState<number>(0)
    const [_categoryId, set_categoryId] = useState<number>(0)
    const [_category, set_category] = useState<{name:string}>()
    const [_coverName, set_coverName] = useState<string>("")
    const [_name, set_name] = useState<string>("")
    const [_slug, set_slug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_infor, set_infor] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    const [_createdDate, set_createdDate] = useState<Date>()
    const [_updateDate, set_updateDate] = useState<Date>()


    const body= {
        name: _name,
        slug: _slug,
        categoryId: _categoryId,
        coverId: _coverId,
        infor: _infor,
        content: _newContent || _content,
        updateDate: new Date()
    } as (ItemType & UserType)

    const toPage = useRouter()

    useEffect(() => {
        if(item){
            set_id(item.id)
            set_name(item.name)
            set_slug(item.slug)
            set_category(item.category)
            set_categoryId(item.categoryId)
            set_coverId(item.coverId)
            set_content(item.content)
            set_infor(item.infor)
            set_createdDate(item.createdAt)
            set_updateDate(item.updateDate)
        }

    }, [item])

            // get image from id
    useEffect(() => {
        const getImageById = async (id: number) => {
        const result = await ApiItemUser({ position: currentUser.position, archive: "pic", id: id })
        if (result.success) {
            set_coverName(result.data[0].name)
        }
    }
        if(_coverId ){
            getImageById(_coverId)
        } 
    }, [_coverId, currentUser.position])

    //get cover id from modal
    useEffect(() => {
        if (_isCoverId && currentModal.id) {
            set_coverId(currentModal.id);
            set_isCoverId(false);
        }
    }, [_isCoverId, currentModal.id])


    const [_categories, set_categories] = useState<ItemType[]>([])
    // get Category
    const getAllCategory = async (archive: string) => {
        const result = await ApiItem({ archive })
        if (result.success) {
            set_categories(result.data)
        }
    }
    useEffect(() => {
        if(archive === "blog"){
            getAllCategory("category")
        } 
    }, [archive])

    return (
        <div className='flex flex-wrap gap-4 '>
            <div className='w-full bg-lv-0 dark:bg-lv-18 shadow-md rounded h-12 flex flex-col justify-center px-2'>
                <div className='flex'>
                    <p onClick={() => toPage.push(`/admin/`)} className="hover:text-lv-11 cursor-pointer" >admin</p>
                    <p className="px-1"> / </p>
                    <p onClick={() => toPage.push(`/admin/${archive}/`)} className="hover:text-lv-11 cursor-pointer" >{archive}</p>
                </div>
            </div>
            <div className='w-full bg-lv-0 dark:bg-lv-18 shadow-md rounded h-12 flex flex-col justify-center px-2'>
                <Link href={"/" + archive + "/" + archive + "_preview"} target='__blank'><p className='truncate'> <span className='opacity-50'>Preview : </span><span className='opacity-75 hover:opacity-100'>{"/" + archive + "/" + slug + "_preview"} </span> </p></Link>
            </div>
            <div className="w-full flex flex-wrap gap-4 xl:flex-nowrap flex-row-reverse ">
                <div className='w-full xl:w-3/12 bg-lv-0 dark:bg-lv-18 shadow-md rounded flex flex-col justify-center p-2 h-max'>
                    <div className='w-full  h-max bg-lv-0 dark:bg-lv-18 rounded hidden xl:block'>
                        <EditPicture src={_coverName ? process.env.ftp_url + _coverName : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); set_isCoverId(true) }} />
                    </div>
                    <div className="flex h-12 gap-1 ml-auto mr-0">
                        <Button name="cancel" onClick={() => toPage.back()} sx="!m-auto !w-24 !h-6  !text-sm" />
                        <Button name={slug === "news" ? "create" : "save"} onClick={() => slug !== "news" ? updateItem && updateItem(_id, body) : createItem && createItem(body)} sx="!m-0 !m-auto !w-24 !h-6  !text-sm"  />
                    </div>
                    {_createdDate ?
                        <div className='flex flex-wrap max-w-sm ml-auto gap-1 h-6 flex-col justify-center'>
                            <p className='opacity-50 text-sm'>Created Date :</p>
                            <p >{moment(_createdDate).format("YYYY/MM/DD")}</p>
                        </div> : null}
                    {_updateDate ? <div className='flex flex-wrap max-w-sm ml-auto gap-1 h-6 flex-col justify-center'>
                        <p className='opacity-50 text-sm'>Update Date :</p>
                        <p >{moment(_updateDate).format("YYYY/MM/DD")}</p>
                    </div> : null}
                </div>
                <div className="w-full grid gap-4 xl:w-9/12">
                    <EditPicture sx='border-2 border-lv-2 dark:border-lv-17 rounded shadow-md  xl:hidden' cover src={_coverName ? process.env.ftp_url + _coverName : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); set_isCoverId(true) }} />
                    <div className="relative">
                        <div className='w-full grid  h-max bg-lv-0 dark:bg-lv-18 shadow-md rounded p-2 gap-2'>
                            <Input name="title" onChange={(v) => set_name(v)} value={_name} />
                            <Input name="slug" onChange={(v) => set_slug(v)} value={_slug} />
                            {archive === "blog" ?
                                <>
                                    <p className='text-sm px-2'>category</p>
                                    <DividerSelect name={_category?.name} data={_categories} valueReturn={(v) => {if(v){set_categoryId(Number(v))}else{set_categoryId(Number(_categoryId))}} }/>
                                </>
                                : null}
                            <TextAreaTool value={_content} onChange={(v) => set_newContent(v)} sx='min-h-screen' />
                            <InputTable table={_infor ? JSON.parse(_infor) : []} exportTable={tbl => set_infor(JSON.stringify(tbl))} />
                        </div >
                        <div className="flex h-12">
                            <Button name={slug === "news" ? "create" : "save"} onClick={() => slug !== "news" ? updateItem && updateItem(_id, body) : createItem && createItem(body)} sx="!my-auto !w-24 !h-6  !text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export const EditDetailbyId = ({ slug, item ,updateItem}: Props) => {

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const [currentModal, setCurrentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentModal(store.getState().modal))
    }

    useEffect(() => {
        update()
    })

    const toPage = useRouter()
    const [_username, set_username] = useState<string>("")
    const [_email, set_email] = useState<string>("")
    const [_active, set_active] = useState<boolean>(false)
    const [_position, set_position] = useState<string>("")
    const [_avataId, set_avataId] = useState<number>(0)
    const [_avataName, set_avataName] = useState<string>("")
    const [_coverId, set_coverId] = useState<number>(0)
    const [_coverName, set_coverName] = useState<string>("")

    const [_isAvataId, set_isAvataId] = useState<boolean>(false)
    const [_isCoverId, set_isCoverId] = useState<boolean>(false)

    const body = {
        coverId: _coverId || undefined,
        avataId: _avataId || undefined,
        username: _username,
        position: _position,
        active: _active
    } as (ItemType & UserType)

    useEffect(() => {
        if(item){
            set_username(item.username)
            set_email(item.email)
            set_active(Boolean(item.active))
            set_position(item.position)
            set_avataId(item.avataId)
            set_coverId(item.coverId)
        }
    }, [item])

console.log(_position)

    useEffect(() => {
        const getImageById = async (type: string, id: number) => {
            const result = await ApiItemUser({ position: currentUser.position, archive: "pic", id: id })
            console.log(result)
    
            if (result.success && result.data.length) {
                if(type === "avata"){
                    set_avataName(result.data[0].name)
                }
                if(type === "cover"){
                    set_coverName(result.data[0].name)
                }
            }
        }
        if(_avataId){getImageById("avata", _avataId)}
        if(_coverId){getImageById("cover", _coverId)}
    }, [_avataId, _coverId, currentUser.position])

    useEffect(() => {
        if (_isAvataId && currentModal.id) {
            set_avataId(currentModal.id);
            set_isAvataId(false);
            set_isCoverId(false)
        }
        if (_isCoverId && currentModal.id) {
            set_coverId(currentModal.id);
            set_isCoverId(false);
            set_isAvataId(false)
        }
    }, [_isAvataId, _isCoverId, currentModal.id])


    return (
        <div className='grid gap-4'>

            <div className="  ">
                <div className='bg-bglight dark:bg-bgdark shadow-md rounded'>
                    <EditPicture src={_coverName ? process.env.ftp_url + _coverName : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); set_isCoverId(true) }} cover={true} />
                    <div className="mt-[-150px] h-max">
                        <EditAvatar src={_avataName ? process.env.ftp_url + _avataName : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); set_isAvataId(true) }} cover={true} />
                    </div>
                    <div className="w-max m-auto py-10 text-center">
                        <h2 className='font-bold text-xl mb-1'>{_username}</h2>
                        <h3 className='font-bold text-lg mb-1 opacity-75'>{_position}</h3>
                    </div>
                </div>
                <div className='bg-bglight dark:bg-bgdark  shadow-md rounded '>
                    <div className='max-w-screen-md m-auto p-4'>
                        <Input name="username" onChange={(v) => set_username(v)} value={_username} />
                        <Input name="email" onChange={(v) => set_username(v)} value={_email} disabled={true} />
                    </div>
                    <div className='max-w-screen-md m-auto p-4'>
                        {currentUser.position === "admin" &&
                            <div className="flex mb-4">
                                <div className='flex flex-col justify-center w-24 text-center'>position</div>
                                <DividerSelect data={
                                    [{
                                        name: "admin",
                                    },
                                    {
                                        name: "user",
                                    },]
                                }
                                    name={_position}
                                    sx="!w-24"
                                    valueReturn={(v) => v && set_position(v.toString())}
                                />
                            </div>}
                        {currentUser.position === "admin" &&
                            <div className="flex mb-4">
                                <div className='flex flex-col justify-center w-24 text-center'>active</div>
                                <DividerSelect data={
                                    [{
                                        name: "true",
                                    },
                                    {
                                        name: "false",
                                    },]
                                }
                                    name={_active.toString()}
                                    sx="!w-24"
                                    valueReturn={(v) => set_active(Boolean(v))}
                                />
                            </div>}

                    </div>
                </div>
            </div>
            <div className='bg-bglight dark:bg-bgdark shadow-md rounded'>
                <div className="flex h-12 gap-1 ml-auto mr-4 w-max">
                    <Button name="cancel" onClick={() => toPage.back()} sx="!m-auto !w-24 !h-6  !text-sm" />
                    <Button name={"save"} onClick={() => {if(updateItem ) {updateItem(Number(slug), body)}}} sx="!m-0 !m-auto !w-24 !h-6  !text-sm" />
                </div>
            </div>
        </div>
    )
}