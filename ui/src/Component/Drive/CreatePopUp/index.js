import { PopupView } from "./PopupView"

export const Popup = ({ title, open, handleClose, buttonText,onSubmit }) =>{
    return <PopupView
        title={title}
        buttonText={buttonText}
        open={open}
        handleClose={handleClose}
        onSubmit={onSubmit}
    />
}