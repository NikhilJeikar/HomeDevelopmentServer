import { useSelector } from "react-redux";
import { UploadProgressView } from "./UploadProgressView";
import { useEffect, useState } from "react";

export const UploadProgress = () => {
  const { files, complete } = useSelector((state) => state.upload_progress);
  const [open, setOpen] = useState(files.length === 0 && !complete ? false : true);
  useEffect(() => {
    if (!complete && files.length === 0) {
      setOpen(true);
    } else {
      setInterval(() => {
        setOpen(false);
      }, 5000);
    }
  }, [complete, files]);
  useEffect(() => {
    if (!complete) {
      setOpen(true);
    }
  }, [complete]);
  return <UploadProgressView open={open} files={files} />;
};
