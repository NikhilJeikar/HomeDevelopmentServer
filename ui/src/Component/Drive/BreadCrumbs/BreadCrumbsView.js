import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { Chip } from "@mui/material";
import { Folder, Home } from "@mui/icons-material";
import { file_list } from "../slice";

export const CollapsedBreadcrumbsView = () => {
  const dispatch = useDispatch();
  const { path_list } = useSelector((state) => state.drive);
  const handleClick = (event) => {
    event.preventDefault();
    dispatch(
      file_list({
        current_path: path_list.slice(0, event.target.getAttribute("index")),
      })
    );
  };
  return (
    <Breadcrumbs maxItems={5} aria-label="breadcrumb" >
      <Chip
        key={0}
        sx={{ display: "flex", alignItems: "center" }}
        onClick={handleClick}
        index={0}
        label="Home"
        icon={<Home fontSize="small" />}
      />
      {path_list.map((value, index) => {
        return (
          <Chip
            key={index + 1}
            index={index + 1}
            sx={{ display: "flex", alignItems: "center" }}
            onClick={handleClick}
            icon={<Folder fontSize="inherit" />}
            label={value}
            />
        );
      })}
    </Breadcrumbs>
  );
};
