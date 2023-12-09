import { GridCard } from "./Card";
import { ImageList, Toolbar } from "@mui/material";
import { Filter } from "./Filter";

export const PhotoGridView = ({ files, onClick }) => {
  return (
    <div
      style={{
        display: "flex",
        "flexDirection": "column",
        overflow: "hidden",
        height: "97vh",
      }}
    >
      <Toolbar variant="dense"></Toolbar>
      <Filter />
      <div
        style={{ flex: 1, overflow: "scroll", marginTop: 10 }}
        onScroll={(event) => {
          const target = event.target;
          if (
            target.scrollHeight - target.scrollTop - target.clientHeight <
            100
          ) {
          }
        }}
      >
        <ImageList variant="masonry" cols={4} style={{ marginTop: 0 }}>
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
    </div>
  );
};
