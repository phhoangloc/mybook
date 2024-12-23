'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import store from '@/redux/store';
import { Input } from '../tool/input/input';
import { Button, UploadButton } from '../button/button';
import EditPicture, { EditAvatar } from '../tool/picture/editPicture'
import { ModalType, setModal } from '@/redux/reducer/ModalReducer';
import { TextAreaTool } from '../tool/input/textarea';
import moment from 'moment';
import { ApiItemUser, ApiUploadFile, ApiDeleteItem } from '@/api/user';
import Link from 'next/link'
import { DividerSelect } from '../tool/divider/divider';
import { ApiItem } from '@/api/client';
import { InputTable } from '../tool/input/inputTable';
import { ItemType } from '@/app/[archive]/[slug]/page';
import { UserType } from '@/redux/reducer/UserReduce';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
export type ChapterType = {
    id: number,
    index: number,
    name: string,
    slug: string,
    content: string
}
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
    const [_coverName, set_coverName] = useState<string>("")
    const [_fileId, set_fileId] = useState<number | null>(null)
    const [_fileName, set_fileName] = useState<string>("")
    const [_categoryId, set_categoryId] = useState<number>(0)
    const [_category, set_category] = useState<{ name: string }>()

    const [_name, set_name] = useState<string>("")
    const [_slug, set_slug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_infor, set_infor] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    const [_createdDate, set_createdDate] = useState<Date>()
    const [_updateDate, set_updateDate] = useState<Date>()

    const [_isUploadFile, set_isUploadFile] = useState<boolean>(false)

    const [_chapters, set_chapters] = useState<ChapterType[]>([])

    const body = {
        name: _name,
        slug: _slug,
        categoryId: _categoryId,
        coverId: _coverId,
        fileId: _fileId,
        infor: _infor,
        content: _newContent || _content,
        updateDate: new Date(),
        chapter: _chapters
    } as (ItemType & UserType)

    const toPage = useRouter()

    useEffect(() => {
        if (item) {
            set_id(item.id)
            set_name(item.name)
            set_slug(item.slug)
            set_category(item.category)
            set_categoryId(item.categoryId)
            set_coverId(item.coverId)
            set_fileId(item.fileId)
            set_fileName(item.file?.name)
            set_content(item.content)
            set_infor(item.infor)
            set_createdDate(item.createdAt)
            set_updateDate(item.updateDate)
            set_chapters(item.chapter ? item.chapter : [])
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
        if (_coverId) {
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
        if (archive === "book") {
            getAllCategory("category")
        }
    }, [archive])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFile = async (e: any) => {
        set_isUploadFile(true)
        const files = e.target.files;
        const file: File = files[0]
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async function () {
            const result = await ApiUploadFile({ position: currentUser.position, archive: "file", file: file })
            if (result && result.data) {
                set_isUploadFile(false)
                set_fileName(result.data.name)
                set_fileId(result.data.id)
            }
        }
    }
    const deleteFile = async (id: number) => {
        set_isUploadFile(true)
        const result = await ApiDeleteItem({ position: currentUser.position, archive: "file", id })
        if (result.success) {
            set_isUploadFile(false)
            set_fileName("")
            set_fileId(null)
        }
    }

    const [_isChapter, set_isChapter] = useState<boolean>(false)
    const [_chapter_index, set_chapter_index] = useState<number>(-1)
    const [_chapter_id, set_chapter_id] = useState<number>(0)
    const [_chapter_name, set_chapter_name] = useState<string>("")
    const [_chapter_slug, set_chapter_slug] = useState<string>("")
    const [_chapter_content, set_chapter_content] = useState<string>("")

    const body_chapter: ChapterType = {
        id: _chapter_id,
        index: _chapter_index,
        name: _chapter_name,
        slug: _chapter_slug,
        content: _chapter_content,
    }
    useEffect(() => {
        if (_chapter_index >= 0) {
            set_chapter_id(_chapters[_chapter_index].id)
            set_chapter_name(_chapters[_chapter_index].name)
            set_chapter_slug(_chapters[_chapter_index].slug)
            set_chapter_content(_chapters[_chapter_index].content)
        }
    }, [_chapter_index, _chapters])

    const createChapter = () => {
        set_chapters(chapter => [...chapter, { name: "newchapter", slug: "slug_" + moment(new Date()).format("YYYYMMDDhhmmss"), content: "" } as ChapterType])
        set_chapter_name("new chapter")
        set_chapter_slug("slug_" + moment(new Date()).format("YYYYMMDDhhmmss"))
        set_chapter_content("")
        set_chapter_index(_chapters.length)
    }

    const updateChapter = (index: number) => {
        const _newcChapter = _chapters
        _newcChapter[index] = body_chapter
        set_chapters(_newcChapter)
        set_chapter_index(-1)
    }
    const deleteChapter = (index: number) => {
        const _newcChapter = _chapters
        _newcChapter.splice(index, 1)
        set_chapters(_newcChapter)
        set_chapter_index(-1)
    }

    const [draggedItem, setDraggedItem] = useState<number>(-1);
    const [_onMouseDown, set_onMouseDown] = useState<boolean>(false)
    const [startY, setStartY] = useState<number>(0)
    const [event, setEvent] = useState<HTMLDivElement>()
    const [_chapter_indexForward, set_chapter_indexForward] = useState<number>(-1)

    const [refresh_chapter, setRefresh_chapter] = useState<string>("")
    const handleMouseDown = (index: number) => {
        set_onMouseDown(true)
        setDraggedItem(index)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        if (index !== draggedItem) { set_chapter_indexForward(index) }
        if (event) { event.style.transform = `translate(0px, ${e.pageY - startY}px)` }

    }
    useEffect(() => {
        const saveTable = (draggedItem: number, index: number) => {
            if (index !== -1 && draggedItem !== index) {
                const _newcChapter = [..._chapters].filter((i, ind) => ind != draggedItem)
                _newcChapter.splice(index, 0, _chapters[draggedItem])
                if (event) { event.style.transform = `translate(0px, 0px)` }
                set_chapters(_newcChapter.map((nch: ChapterType, index: number) => { return { ...nch, index: index } }))
            }
            setDraggedItem(-1)
        }
        if (!_onMouseDown && draggedItem !== -1) { saveTable(draggedItem, _chapter_indexForward); setRefresh_chapter(n => n + "a") }
    }, [_chapters, _chapter_indexForward, _onMouseDown, draggedItem, event])

    console.log(_chapters)
    return (
        <div className='flex flex-wrap gap-4 '>
            <div className='w-full bg-lv-0 dark:bg-lv-18 shadow-md rounded h-12 flex flex-col justify-center px-2'>
                <div className='flex'>
                    <p onClick={() => toPage.push(`/`)} className="hover:text-lv-11 cursor-pointer" >admin</p>
                    <p className="px-1"> / </p>
                    <p onClick={() => toPage.push(`/${archive}/`)} className="hover:text-lv-11 cursor-pointer" >{archive}</p>
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
                        <Button name={slug === "news" ? "create" : "save"} onClick={() => slug !== "news" ? updateItem && updateItem(_id, body) : createItem && createItem(body)} sx="!m-0 !m-auto !w-24 !h-6  !text-sm" />
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
                    <EditPicture sx='border-2 border-lv-2 dark:border-lv-17 rounded shadow-md  xl:hidden' cover={archive === "book" ? false : true} src={_coverName ? process.env.ftp_url + _coverName : undefined} setPictureModal={() => { store.dispatch(setModal({ value: "viewimage" })); set_isCoverId(true) }} />
                    <div className="relative">
                        <div className="flex">
                            <div className={`${_isChapter === false ? "bg-lv-0 dark:bg-lv-18  rounded-t-xl" : ""} px-5 cursor-pointer`} onClick={() => set_isChapter(false)}>detail</div>
                            {archive === "book" && <div className={`${_isChapter === true ? "bg-lv-0 dark:bg-lv-18  rounded-t-xl" : ""} px-5 cursor-pointer`} onClick={() => set_isChapter(true)}>chapter</div>}
                        </div>
                        {!_isChapter ?
                            <div className='w-full grid  h-max bg-lv-0 dark:bg-lv-18 shadow-md p-2 gap-2'>
                                <Input name="title" onChange={(v) => set_name(v)} value={_name} />
                                <Input name="slug" onChange={(v) => set_slug(v)} value={_slug} />
                                {archive === "book" ?
                                    <>
                                        <p className='text-sm px-2'>category</p>
                                        <DividerSelect name={_category?.name} data={_categories} valueReturn={(v) => { if (v) { set_categoryId(Number(v)) } else { set_categoryId(Number(_categoryId)) } }} />
                                    </>
                                    : null}
                                {archive === "book" ?
                                    <>
                                        <p className='text-sm px-2'>PDF file</p>
                                        <div className='flex'>
                                            <p className='flex flex-col justify-center p-2 opacity-50 text-sm'>{_fileName ? _fileName : "choose file"}</p>
                                            {
                                                _isUploadFile ?
                                                    <RefreshIcon className=" !h-11 !w-11 p-2 flex flex-col justify-center text-center refresh_action rounded cursor-pointer" /> :
                                                    _fileId ?
                                                        <CloseIcon className=" !h-11 !w-11 p-2 flex flex-col justify-center text-center bg-lv-11 text-white rounded cursor-pointer" onClick={() => deleteFile(_fileId)} /> :
                                                        <UploadButton name={<FileUploadIcon />} onClick={(e) => getFile(e)} />}
                                        </div>
                                    </>
                                    : null}
                                <TextAreaTool value={_content} onChange={(v) => set_newContent(v)} sx='min-h-screen text-sm md:text-base' />
                                <InputTable table={_infor ? JSON.parse(_infor) : []} exportTable={tbl => set_infor(JSON.stringify(tbl))} />
                            </div > :
                            <div className='w-full min-h-screen bg-lv-0 dark:bg-lv-18 shadow-md p-2 gap-2'>
                                <div className="flex justify-between h-12 col-span-12">
                                    <div className='h-full flex flex-col justify-center p-2'>Chapter</div>
                                    <AddIcon className='!w-12 !h-12 p-3 cursor-pointer' onClick={() => createChapter()} />
                                </div>
                                <div className={`h-64 overflow-scroll scroll_none bg-lv-1 dark:bg-lv-19 border border-lv-4 dark:border-lv-17 rounded p-2 `}
                                    key={refresh_chapter}>
                                    {
                                        _chapters.sort((a, b) => a.index - b.index).map((chapter: ChapterType, index: number) =>
                                            <div className={` flex justify-between ${_onMouseDown && _chapter_index === index ? "relative z-[0] shadow-md rounded" : "relative z-[1]"}`} key={index}>
                                                <div className="flex"
                                                    onMouseDown={(e) => { handleMouseDown(index); set_chapter_index(index); setStartY(e.pageY); setEvent(e.currentTarget) }}
                                                    onMouseUp={() => { set_onMouseDown(false) }}
                                                    onMouseMove={(e) => _onMouseDown && handleMouseMove(e, index)}>
                                                    <DragIndicatorIcon className='!w-12 !h-12 p-3 hover:cursor-grab active:cursor-grabbing' />
                                                    <div className='h-12 flex flex-col justify-center cursor-pointer hover:text-lv-11 border-b border-lv-4 dark:border-lv-17' onClick={(e) => { e.stopPropagation(); set_chapter_index(index); set_chapter_id(chapter.id) }}>
                                                        {chapter?.name}
                                                    </div>
                                                </div>
                                                <DeleteIcon className='!w-12 !h-12 p-3' onClick={(e) => { e.stopPropagation(); deleteChapter(index) }} />
                                            </div>
                                        )
                                    }
                                </div>
                                {_chapter_index > -1 ?
                                    <div key={_chapter_index}>
                                        <Input name="title" onChange={(v) => set_chapter_name(v)} value={_chapters[_chapter_index]?.name || _chapter_name} />
                                        <Input name="slug" onChange={(v) => set_chapter_slug(v)} value={_chapters[_chapter_index]?.slug || _chapter_slug} />
                                        <TextAreaTool value={_chapters[_chapter_index] ? _chapters[_chapter_index].content : ""} onChange={(v) => set_chapter_content(v)} sx='min-h-screen text-sm md:text-base' />
                                        <div className=" w-max mt-2 ml-auto mr-0"><Button name="update" onClick={() => updateChapter(_chapter_index)} sx='!w-max h-max py-0 px-4 text-sm ' /></div>
                                    </div> : null}
                            </div >}
                        <div className="flex h-12">
                            <Button name={slug === "news" ? "create" : "save"} onClick={() => slug !== "news" ? updateItem && updateItem(_id, body) : createItem && createItem(body)} sx="!my-auto !w-24 !h-6  !text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export const EditDetailbyId = ({ slug, item, updateItem }: Props) => {

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
        if (item) {
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
                if (type === "avata") {
                    set_avataName(result.data[0].name)
                }
                if (type === "cover") {
                    set_coverName(result.data[0].name)
                }
            }
        }
        if (_avataId) { getImageById("avata", _avataId) }
        if (_coverId) { getImageById("cover", _coverId) }
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
                    <Button name={"save"} onClick={() => { if (updateItem) { updateItem(Number(slug), body) } }} sx="!m-0 !m-auto !w-24 !h-6  !text-sm" />
                </div>
            </div>
        </div>
    )
}