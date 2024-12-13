import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducer/UserReduce";
import RefreshReducer from "./reducer/RefreshReduce";
import MenuReducer from "./reducer/MenuReduce";
import AlertReducer from "./reducer/alertReducer";
import NoticeReducer from "./reducer/noticeReducer";
import MenuAdminReducer from './reducer/MenuAdminReduce'
import ModalReducer from "./reducer/ModalReducer";

const store = configureStore({
    reducer: {
        user: UserReducer.reducer,
        menu: MenuReducer.reducer,
        menuadmin: MenuAdminReducer.reducer,
        refresh: RefreshReducer.reducer,
        alert: AlertReducer.reducer,
        notice: NoticeReducer.reducer,
        modal: ModalReducer.reducer,
    }
})

export default store