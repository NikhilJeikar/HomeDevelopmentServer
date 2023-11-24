import { SharePopupView } from "./SharePopupView";


export const SharePopup = ({ open, handleClose,fileName,popupStatus}) =>{
    return <SharePopupView
        open={open}
        handleClose={handleClose}
        fileName={fileName}
        popupStatus={popupStatus}
    />
}