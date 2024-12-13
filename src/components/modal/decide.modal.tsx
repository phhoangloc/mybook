'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { AlertType, setAlert } from '@/redux/reducer/alertReducer'

const DecideModal = () => {

  const [currentAlert, setCurrentAlert] = useState<AlertType>(store.getState().alert)

  const update = () => {
    store.subscribe(() => setCurrentAlert(store.getState().alert))
  }
  useEffect(() => {
    update()
  })


  return (
    <div className={`fixed w-full m-auto h-6 flex flex-col justify-center  transition-all delay-500  text-center ${currentAlert.open ? "translate-y-0" : "translate-y-[-100vh]"} text-white bg-sky-500 z-30`}>
      <div className='flex w-max m-auto '>
        <p className='mx-4 text-sm'>{currentAlert.msg}</p>
        {currentAlert.open ?
          <div className='w-max flex m-auto '>
            <p className='text-sm opacity-75 hover:opacity-100 px-1 cursor-pointer' onClick={() => store.dispatch(setAlert({ value: true, open: false, msg: "" }))}>yes</p>
            <p className='text-sm opacity-75 hover:opacity-100 px-1 cursor-pointer' onClick={() => store.dispatch(setAlert({ value: false, open: false, msg: "" }))} >no</p>
          </div> : null}
      </div>
    </div>

  )
}

export default DecideModal