import { useSelector } from "react-redux";
import { PhotoGridView } from "./GridView";
import { useState } from "react";
import { PhotoPopup } from "./PhotoPopView";

export const PhotoGrid = () => {
  const { photo_list } = useSelector((state) => state.photo);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  if (photo_list.length !== 0) {
    return (
      <div>
        <PhotoGridView
          files={photo_list}
          onClick={(index) => {
            setIndex(index);
            setOpen(true)
          }}
        />
        <PhotoPopup
          open={open}
          details={photo_list[index].photo}
          onNext={() => {
            if (photo_list.length > index + 1) {
              setIndex(index + 1);
            }
          }}
          onPrev={() => {
            if (index - 1 >= 0) {
              setIndex(index - 1);
            }
          }}
          handleClose={() => {
            setOpen(false);
          }}
        />
      </div>
    );
  }
};
