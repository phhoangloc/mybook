import React from 'react'

type Props = {
    sx?: string
}

const Notfound = (props: Props) => {
    return (
        <div className={`h-screen flex flex-col justify-center text-center ${props.sx}`}>NOT FOUND</div>
    )
}

export default Notfound