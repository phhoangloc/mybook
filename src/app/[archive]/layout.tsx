
import Header from '@/components/display/header'
import React from 'react'
import { ApiItem } from '@/api/client'


type Props = {
    children: React.ReactNode
    params: Promise<{ archive: string }>
}
export const generateMetadata = async ({ params }: Props) => {

    const archive = (await params).archive
    const result = archive == "blog" ? await ApiItem({ archive: archive }) : await ApiItem({ archive: "page", slug: archive })

    if(result.data[0]){
        return {
            title: archive == "blog" ? result.data[0].archive : result.data[0].name,
            openGraph: {
                title: archive == "blog" ? result.data[0].archive.toUpperCase() : result.data[0].name.toUpperCase(),
                type: 'website',
                url: 'https://buoncf.jp' + result.data[0].archive,
                images: [{
                    url: process.env.ftp_url + result.data[0].cover.name,
                    width: 800,
                    height: 600,
                    type: "image/jpeg"
                }]
            },
        }
    }else{
        return {
            title: "Buôn Cà Phê",
        }
    }
}

const layout = ({ children }: Props) => {
    return (
        <div className="bg-lv-0 h-screen">
            <Header />
            {children}
        </div>
    )
}

export default layout