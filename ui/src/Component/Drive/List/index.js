import { useState } from "react";
import { ListView } from "./ListView";
import { SharePopup } from "./SharePopup";
import { ClipBoardCopy } from "./ClipBoardCopy";
import { UploadProgress } from "../UploadProgress";

export const ListWindow = () => {
  const [filePath, setFilePath] = useState();
  const [clipBoardOpen,setClipboardOpen] = useState('');
  return (
    <div>
      <ListView
        setPath={(path) => {
          setFilePath(path);
        }}
      />
      <SharePopup
        open={filePath != null}
        handleClose={() => {
          setFilePath(null);
        }}
        fileName={filePath}
        popupStatus={(message)=>{setClipboardOpen(message)}}
      />
      <ClipBoardCopy
        open={clipBoardOpen.length !== 0}
        handleClose={()=>{setClipboardOpen('')}}
        message = {clipBoardOpen}
      />
      <UploadProgress/>
    </div>
  );
};
