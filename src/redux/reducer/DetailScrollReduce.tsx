
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

const ScrollReducer = createSlice({
    name: "Scroll",
    initialState: false,
    reducers: {
        setScroll: {
            reducer: (state: boolean, action: PayloadAction<boolean>) => {
                return (state = action.payload)
            },
            prepare: (msg: boolean) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = ScrollReducer
export const { setScroll } = actions;

export default ScrollReducer