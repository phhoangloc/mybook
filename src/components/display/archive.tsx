/* eslint-disable no-var */
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import moment from 'moment'
import AddIcon from '@mui/icons-material/Add';
import { UploadButton } from '../button/button';
import Image from 'next/image';
import store from '@/redux/store'
import { setAlert } from '@/redux/reducer/alertReducer';
import { ApiDeleteItem, ApiUploadFile } from '@/api/user';
import { AlertType } from '@/redux/reducer/alertReducer';
import { ModalType, setModal } from '@/redux/reducer/ModalReducer';
import { Input, InputIcon } from '../tool/input/input';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import Pagination from './pagination';
import { ItemType } from '@/app/[archive]/[slug]/page';
import { UserType } from '@/redux/reducer/UserReduce';
import { setNotice } from '@/redux/reducer/noticeReducer';
import { ImageType } from '../modal/imagemodal';
type Props = {
    archive: string,
    items: (ItemType & UserType)[],
    createItem?: (body: unknown) => void
    editItem?: (id: number, body: unknown) => void
    deleteItem?: (id: number) => void,
    page?: number,
    next?: () => void
    prev?: () => void
    endPage?: boolean
    refresh?: () => void
}
export const Archive = ({ archive, items, deleteItem, page, next, prev, endPage }: Props) => {
    const toPage = useRouter()

    return (
        <div className='bg-lv-0 dark:bg-lv-18 rounded shadow-md p-4 grid gap-2 grid-cols-1'>
            <div className='flex border-b-2 border-lv-2 dark:border-lv-17 justify-between'>
                <div className="flex h-12">
                    <h3 className='text-xl font-bold text-lv-11 dark:text-lv-0 h-full flex flex-col justify-center'>{archive.toUpperCase()} </h3>
                    <AddIcon className='!w-12 !h-full p-3 opacity-50 hover:opacity-100 cursor-pointer text-lv-11 dark:text-lv-0' onClick={() => toPage.push(archive + "/news")} />
                </div>
                {/* <SearchButton placehoder='search' func={(v) => setSearch(v)} /> */}
            </div>
            <div className="h-12 flex flex-col justify-end font-bold opacity-50">
                <h4>Title</h4>
            </div>
            {
                items.length ?
                    items.map((n: ItemType & UserType, index: number) =>
                        <div key={index} className={`h-12 flex justify-between`} >
                            <div className="flex flex-col justify-center  text-sm md:text-base cursor-pointer" style={{ width: "calc(100% - 96px)" }}>
                                <h4 title={n.name} className={`truncate font-semibold w-full hover:text-lv-11`}
                                    onClick={() => toPage.push(n.slug ? "/" + n.archive + "/" + n.slug : "/" + n.archive + "/" + n.id)}>
                                    {n.username || n.name}
                                </h4>
                                <p className="text-xs opacity-50"> {n.position || n.updateDate && moment(n.updateDate).format("MM/DD") || moment(n.createdAt).format("MM/DD")} {n.host?.username ? " - " + n.host?.username : null}</p>
                            </div>

                            <div className="w-max flex h-12">
                                <Link className='h-max m-auto' style={{ textDecoration: "none", color: "inherit" }} href={n.slug ? "/" + n.archive + "/" + n.slug : "/" + n.archive + "/" + n.id} target='_blank'>
                                    <RemoveRedEyeOutlinedIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100  text-lv-11 ' />
                                </Link>
                                <DeleteOutlineOutlinedIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11 ' onClick={() => deleteItem && deleteItem(n.id)} />
                            </div>
                        </div>

                    )
                    : <div>There is no {archive}</div>
            }
            <div className="h-12">

            </div>
            <div className='flex border-t-2 dark:border-slate-700 '>
                <Pagination page={page ? page : 0} next={() => next && next()} prev={() => prev && prev()} end={endPage ? endPage : false} />
            </div>
        </div>
    )
}
export const ArchiveCategory = ({ items, createItem, editItem, deleteItem }: Props) => {
    const [_id, set_id] = useState<number>(0)
    const [_newCategory, set_newCategory] = useState<string>("")
    const [_currentItems, set_currentItems] = useState<(ItemType & UserType)[]>([])

    useEffect(() => {
        set_currentItems(items)
    }, [items])

    return (
        <div className='bg-lv-0 dark:bg-lv-18 rounded shadow-md p-4 grid gap-2 grid-cols-1'>
            <div className='flex border-b-2 border-lv-2 dark:border-lv-17 sjustify-between'>
                <div className="flex h-12">
                    <h3 className='text-xl font-bold text-lv-11 dark:text-lv-0 h-full flex flex-col justify-center'>{"Category".toUpperCase()} </h3>
                    <InputIcon name={<AddIcon className='!w-12 !h-full p-3 opacity-50 hover:opacity-100 cursor-pointer text-lv-11 dark:text-lv-0' />}
                        onChange={(v) => set_newCategory(v)} value={_newCategory}
                        onSubmit={() => createItem && createItem({ name: _newCategory })}
                    />
                </div>
            </div>
            <div className="h-12 flex flex-col justify-end font-bold opacity-50  ">
                <h4>Title</h4>
            </div>
            {
                _currentItems.length ?
                    _currentItems.map((n: (ItemType & UserType), index: number) =>
                        <div key={index} className={`h-12 flex justify-between`} >
                            <div className="flex flex-col justify-center  text-sm md:text-base cursor-pointer" style={{ width: "calc(100% - 96px)" }}>
                                <div title={n.name} className={`truncate font-semibold w-full hover:text-lv-11`} >
                                    {n.id === _id ?
                                        <Input value={n.name} onChange={(v) => set_newCategory(v)} name=""
                                            icon1={<CheckIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11  '
                                                onClick={() => { set_id(0); if(editItem){ editItem(_id, { name: _newCategory })} }} />}
                                        />
                                        : n.name}
                                </div>
                            </div>
                            <div className="w-max flex h-12">
                                {n.id === _id ?
                                    <CloseIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11  ' onClick={() =>  set_id(0)} />
                                    :
                                    <EditIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11  ' onClick={() =>  set_id(n.id) } />}
                                <DeleteOutlineOutlinedIcon className='!w-12 !h-full p-3 m-auto opacity-50 hover:opacity-100 cursor-pointer text-lv-11  ' onClick={() => deleteItem && deleteItem(n.id)} />
                            </div>
                        </div>

                    )
                    : <div>There is no category</div>
            }
            <div className="h-12">

            </div>
            {/* <div className='flex border-t-2 dark:border-slate-700 '>
                <Pagination page={page} next={() => setPage(p => p + 1)} prev={() => setPage(p => p - 1)} end={isEnd} />
            </div> */}
        </div>
    )
}
export const ArchivePic = ({ items, page, next, prev, endPage, refresh }: Props) => {

    // console.log(items)

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const [currentAlert, setCurrentAlert] = useState<AlertType>(store.getState().alert)
    const [currentModal, setCurrentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentAlert(store.getState().alert))
        store.subscribe(() => setCurrentModal(store.getState().modal))

    }
    useEffect(() => {
        update()
    })

    //upload file
    const [file, setFile] = useState<File | undefined>()
    const [files, setFiles] = useState<FileList>()
    const [isUpload, setIsUpload] = useState<boolean>(false)


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFile = async (e: any) => {
        var files = e.target.files;
        const file: File = files[0]
        var reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async function () {
            store.dispatch(setAlert({ value: false, msg: "do you want to update this picture", open: true }))
            setIsUpload(true)
            if (files.length > 1) {
                setFiles(files)
            } else {
                setFile(file)
            }
        }
    }

    useEffect(() => {
        if (currentAlert.value && isUpload) {
            const UpdateImage = async (p: string, a: string, f: File) => {
                const result = await ApiUploadFile({ position: p, archive: a, file: f })
                if (result) {
                    setIsUpload(false)
                    store.dispatch(setAlert({ value: false, msg: "", open: false }))
                    if(refresh){
                        refresh()
                    } 
                }
            }
            if(currentUser.position && file){
                UpdateImage(currentUser.position, "pic", file)
            } 
        }
    }, [currentAlert, currentUser, isUpload, file, refresh])

    useEffect(() => {
        if (currentAlert.value && isUpload && files?.length) {
            const UpdateImage = async (p: string, a: string, f: File) => {
                const result = await ApiUploadFile({ position: p, archive: a, file: f })
                if (result) {
                    setIsUpload(false)
                    store.dispatch(setAlert({ value: false, msg: "", open: false }))
                    if(refresh){
                        refresh()
                    } 
                }
            }
            for (let index = 0; index < files.length; index++) {
                if(currentUser.position){
                    UpdateImage(currentUser.position, "pic", files[index])
                }
            }
        }
    }, [currentAlert, currentUser, isUpload, files, refresh])

    useEffect(() => {
        const deleteImage = async (p: string, a: string, id: number) => {
          const result = await ApiDeleteItem({ position: p, archive: a, id: id })
          if (result.success) {
            store.dispatch(setNotice({ open: true, success: false, msg: result.msg }))
            setTimeout(() => {
              store.dispatch(setNotice({ open: false, success: false, msg: "" }))
              store.dispatch(setModal({ value: "", data: {} as ImageType }))
              if(refresh){refresh()}
            }, 3000)
          } else {
            store.dispatch(setNotice({ open: true, success: false, msg: result.msg }))
            setTimeout(() => {
              store.dispatch(setNotice({ open: false, success: false, msg: "" }))
            }, 3000)
          }
        }
        if (currentAlert.value && currentModal.value==="viewimage_detail" && currentUser.position && currentModal.data && currentModal.data.id) {
           deleteImage(currentUser.position, currentModal.data.archive, currentModal.data.id)
        }
      }, [currentAlert, currentModal, currentUser, refresh])
      
    return (
        <div className='w-full'>
            <div className="grid grid-cols-12 gap-4">
                <div className=' relative col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2  aspect-square overflow-hidden rounded flex flex-col justify-center text-center cursor-pointer shadow-lg  bg-lv-0 dark:bg-lv-18'>
                    <UploadButton name={isUpload ? "UPLOADING" : "UPLOAD"} onClick={(e) => { getFile(e); setFile(undefined); setFiles(undefined) }} sx='!m-auto' />
                </div>
                {
                    items.map((item, index) =>
                        <div key={index} className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 relative aspect-square sm overflow-hidden rounded cursor-pointer shadow-lg bg-lv-0 dark:bg-lv-18' onClick={() => store.dispatch(setModal({ value: "viewimage_detail", data: item }))}>
                            <Image quality={100} src={process.env.ftp_url + item.name} alt='pic' fill sizes='100%' priority style={{ objectFit: "cover" }} />
                        </div>
                    )
                }
            </div>
            <div className='flex mt-4 border-t-2 dark:border-slate-700 '>
                <Pagination page={page ? page : 0} next={() => next && next()} prev={() => prev && prev()} end={endPage ? endPage : false} />
            </div>
        </div>
    )
}
