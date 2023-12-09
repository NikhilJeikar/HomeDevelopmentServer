import {
  CircularProgress,
  ImageListItem,
} from "@mui/material";
import LazyLoad from "react-lazy-load";

export const CardView = ({ path,onClick,index }) => {
  return (
    <LazyLoad offset={300}>
        <ImageListItem onClick={()=>{onClick(index)}}>
          <img src={path} alt=<CircularProgress/>/>
        </ImageListItem>
    </LazyLoad>
  );
};
