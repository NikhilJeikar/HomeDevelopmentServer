import { ClipBoardCopyView } from "./ClipBoardCopyView";

export const ClipBoardCopy = ({ open, handleClose,message }) => {
  return <ClipBoardCopyView open={open} handleClose={handleClose} message={message}/>;
};
