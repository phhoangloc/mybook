
import { ImageType } from "@/components/modal/imagemodal"
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"
export type ModalType = {
    value?: string,
    id?: number,
    data?: ImageType,
}
const ModalReducer = createSlice({
    name: "Modal",
    initialState: { value: "", open: false, id: 0, data: {} as ImageType } as ModalType,
    reducers: {
        setModal: {
            reducer: (state: ModalType, action: PayloadAction<ModalType>) => {
                return (state = action.payload)
            },
            prepare: (msg: ModalType) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = ModalReducer
export const { setModal } = actions;

export default ModalReducer