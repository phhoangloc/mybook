
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

const ChangePageReducer = createSlice({
    name: "ChangePage",
    initialState: false,
    reducers: {
        setChangePage: {
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

export const { actions, reducer } = ChangePageReducer
export const { setChangePage } = actions;

export default ChangePageReducer