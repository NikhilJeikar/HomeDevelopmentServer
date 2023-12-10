import { useSelector } from "react-redux";
import { PhotoGridView } from "./GridView";
import { useEffect, useState } from "react";
import { PhotoPopup } from "./PhotoPopView";

export const PhotoGrid = () => {
  const { photo_list } = useSelector((state) => state.photo);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const OpenPopup = (index) => {
    setIndex(index);
    setOpen(true);
  };

  const OnNext = () => {
    if (photo_list.length > index + 1) {
      setIndex(index + 1);
    }
  };
  const OnPrev = () => {
    if (index - 1 >= 0) {
      setIndex(index - 1);
    }
  };
  const HandleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setIndex(0);
  }, [photo_list]);
  if (photo_list.length !== 0) {
    return (
      <div>
        <PhotoGridView files={photo_list} onClick={OpenPopup} />
        <PhotoPopup
          open={open}
          details={
            index >= photo_list.length
              ? photo_list[0].photo
              : photo_list[index].photo
          }
          onNext={OnNext}
          onPrev={OnPrev}
          handleClose={HandleClose}
        />
      </div>
    );
  }
};
