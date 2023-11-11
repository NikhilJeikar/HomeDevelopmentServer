import { PopupView } from "./PopupView"

export const Popup = ({ title, open, handleClose }) =>{
    return <PopupView
        title={title}
        open={open}
        handleClose={handleClose}
    />
}