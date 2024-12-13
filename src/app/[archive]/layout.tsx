import React from 'react'
import Layout from '@/components/display/layout'
import { Menu } from '@/components/display/menu'
type Props = {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    return (
        <Layout sidebar={<Menu />}>
            {children}
        </Layout>
    )
}

export default layout