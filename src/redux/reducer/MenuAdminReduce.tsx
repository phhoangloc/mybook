
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

const MenuAdminReducer = createSlice({
    name: "MenuAdmin",
    initialState: false,
    reducers: {
        setMenuAdmin: {
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

export const { actions, reducer } = MenuAdminReducer
export const { setMenuAdmin } = actions;

export default MenuAdminReducer