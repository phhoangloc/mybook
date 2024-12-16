import React from 'react'
import { ApiItem } from '@/api/client'
import { translateCategory } from '@/data/fuction'
type Props = {
    children: React.ReactNode,
    params: Promise<{archive:string, slug: string }>
}
export const generateMetadata = async ({ params }: Props) => {

    const archive = (await params).archive
    const slug = (await params).slug
    const result = await ApiItem({ archive:archive, slug: slug })

    return {
        title: result.data[0].name,
        description: result.data[0].name,
        openGraph: {
            title: translateCategory(result.data[0].category.name).toUpperCase(),
            description: result.data[0].name,
            type: 'website',
            url: 'https://buoncf.jp' + result.data[0].archive + "/" + result.data[0].slug,
            images: [{
                url: process.env.ftp_url + result.data[0].cover.name,
                width: 800,
                height: 600,
                type: "image/jpeg"
            }]
        },
    }
}
const layout = ({ children }: Props) => {
    return children

}

export default layout