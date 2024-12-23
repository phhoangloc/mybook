import { ChapterType } from "@/components/display/detail"

export type ItemType = {
    id: number,
    archive: string
    name: string
    slug: string
    coverId: number,
    cover: {
        name: string,
    }
    host: {
        username: string,
    }
    categoryId: number,
    category: {
        name: string,
    },
    file: {
        name: string,
    }
    content: string
    infor: string
    chapter: ChapterType[]
    createdAt: Date,
    updateDate: Date,
}