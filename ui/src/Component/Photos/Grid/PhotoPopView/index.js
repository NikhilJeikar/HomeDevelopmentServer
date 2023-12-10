import { useDispatch, useSelector } from "react-redux";
import { fetch_image } from "../../slice";
import { useEffect } from "react";
import { PhotoPopupView } from "./PhotoPopupView";

export const PhotoPopup = ({
  details,
  open,
  handleClose,
  transition,
  onPrev,
  onNext,
}) => {
  const dispatch = useDispatch();
  const { picture_blob_list } = useSelector((state) => state.photo);

  useEffect(() => {
    if (picture_blob_list[details.path] == null) {
      dispatch(fetch_image({path:details.path}));
    }
  }, [details, dispatch, picture_blob_list]);

  return (
    <PhotoPopupView
      path={picture_blob_list[details.path]}
      details={details}
      open={open}
      transition={transition}
      handleClose={handleClose}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};
