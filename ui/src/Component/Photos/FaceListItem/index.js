import { useDispatch, useSelector } from "react-redux";
import { FaceListItemView } from "./FaceListItemView";
import { useEffect, useState } from "react";
import { fetch_face, set_visibility, update_face_name } from "../slice";

export const FaceListItem = ({ index, name, id, path, x1, x2, y1, y2 }) => {
  const dispatch = useDispatch();
  const { face_blob_list } = useSelector((state) => state.photo);
  const [edit,setEdit] = useState(false)
  useEffect(() => {
    dispatch(
      fetch_face({ id: id, path: path, x1: x1, x2: x2, y1: y1, y2: y2 })
    );
  }, [path]);
  const rename = (name) =>{
    dispatch(update_face_name({id:id,name:name}))
  }
  const hide = (name) =>{
    dispatch(set_visibility({id:id,hidden:true}))
  }
  return (
    <FaceListItemView
      key={index}
      index={index}
      name={name}
      id={id}
      path={face_blob_list[id]}
      edit={edit}
      makeEditable={(state)=>{setEdit(state)}}
      rename={rename}
      hide={hide}
    />
  );
};
