import React from 'react'

type Props = {
    page: number,
    name?: string,
    next: () => void,
    prev: () => void,
    end?: boolean
}

const Pagination = ({ page, name, next, prev, end }: Props) => {

    return (
        <div className='w-max flex mx-auto  '>
            {page === 0 ?
                <div className='w-12 h-12 flex flex-col justify-center text-center' /> :
                <div className='w-12 h-12 flex flex-col justify-center text-center cursor-pointer opacity-50 hover:opacity-100 hover:text-lv-11' onClick={() => prev()}>
                    {`<<`}
                </div>}
            <div className='w-12 h-12 flex flex-col justify-center text-center'>
                {name ? name : page + 1}
            </div>
            {end ?
                <div className='w-12 h-12 flex flex-col justify-center text-center' /> :
                <div className='w-12 h-12 flex flex-col justify-center text-center cursor-pointer opacity-50 hover:opacity-100 hover:text-lv-11' onClick={() => next()}>
                    {`>>`}

                </div>
            }
        </div>
    )
}

export default Pagination