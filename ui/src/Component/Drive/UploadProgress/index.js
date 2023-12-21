import { useSelector } from "react-redux";
import { UploadProgressView } from "./UploadProgressView";
import { useEffect, useState } from "react";

export const UploadProgress = () => {
  const { files, complete } = useSelector((state) => state.upload_progress);
  const [open, setOpen] = useState(!complete ? true : false);
  useEffect(() => {
    if (!complete) {
      setOpen(true);
    } else {
      if(open){
        setInterval(() => {
          setOpen(false);
        }, 5000);
      }
      else{
        setOpen(false);
      }
    }
  }, [complete]);
  return <UploadProgressView open={open} files={files} />;
};
