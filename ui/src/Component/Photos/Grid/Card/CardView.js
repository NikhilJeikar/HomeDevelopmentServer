import {
  ImageListItem,
} from "@mui/material";

export const CardView = ({ path,onClick,index }) => {
  return (
        <ImageListItem onClick={()=>{onClick(index)}}>
          <img src={path} />
        </ImageListItem>

  );
};
