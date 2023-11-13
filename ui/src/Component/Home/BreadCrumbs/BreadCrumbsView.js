import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { file_list } from "./../slice";
import { Link } from "@mui/material";

export const CollapsedBreadcrumbsView = () => {
  const dispatch = useDispatch();
  const { path_list } = useSelector((state) => state.home);
  const handleClick = (event) => {
    event.preventDefault();
    dispatch(
        file_list({
        current_path: path_list.slice(0,event.target.getAttribute("index")),
      })
    );
  };
  return (
    <Breadcrumbs maxItems={5} aria-label="breadcrumb">
      <Link
        key={0}
        underline="hover"
        color="inherit"
        onClick={handleClick}
        index={0}
      >
        Home
      </Link>
      {path_list.map((value, index) => {
        return (
          <Link
            key={index + 1}
            underline="hover"
            color="inherit"
            index={index + 1}
            onClick={handleClick}
          >
            {value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
