import { GridCard } from "./Card";
import { ImageList } from "@mui/material";

export const PhotoGridView = ({ files,onClick }) => {
  return (
    <div>
    <ImageList
    variant="woven"
    cols={4}
  >
      {files.map((value, index) => {
        return (
          <GridCard
            key={index}
            index={index}
            path={value["photo"]["path"]}
            onClick={onClick}
          />
        );
      })}
    </ImageList>
    
    </div>
  );
};
