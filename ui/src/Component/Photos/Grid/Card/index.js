import { CardView } from "./CardView";
import { useDispatch, useSelector } from "react-redux";
import {
  add_thumbnail_request_queue,
  fetch_thumbnail_image,
} from "../../slice";

export const GridCard = ({ path, onClick, index }) => {
  const dispatch = useDispatch();
  const { thumbnail_blob_list, thumbnail_on_request } = useSelector(
    (state) => state.photo
  );
  const callback = () => {
    if (
      (thumbnail_blob_list[path] === null ||
        thumbnail_blob_list[path] === undefined) &&
      thumbnail_on_request[path] !== true
    ) {
      dispatch(add_thumbnail_request_queue({ path: path }));
      dispatch(fetch_thumbnail_image({ path: path }));
    }
  };

  return (
    <CardView
      path={thumbnail_blob_list[path]}
      file_path={path}
      onClick={onClick}
      index={index}
      callback={callback}
    />
  );
};
