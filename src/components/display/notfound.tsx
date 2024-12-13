import React from 'react'

type Props = {
    sx?: string
}

const Notfound = (props: Props) => {
    return (
        <div className={`h-screen flex flex-col justify-center text-center ${props.sx}`}>
            <div>OPP!</div>
            <div>THIS PAGE NOT FOUND</div>
        </div>
    )
}

export default Notfound