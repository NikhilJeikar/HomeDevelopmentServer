import { CardView } from "./CardView";
import { useDispatch, useSelector } from "react-redux";
import { fetch_thumbnail_image } from "../../slice";
import { useEffect } from "react";

export const GridCard = ({ path, onClick,index }) => {
  const dispatch = useDispatch();
  const { thumbnail_blob_list } = useSelector((state) => state.photo);
  useEffect(() => {
    if(thumbnail_blob_list[path] === null ||thumbnail_blob_list[path] === undefined){
      dispatch(fetch_thumbnail_image({path:path}));
    }
  }, [path,dispatch]);
  return (
    <CardView
      path={thumbnail_blob_list[path]}
      onClick={onClick}
      index={index}
    />
  );
};
