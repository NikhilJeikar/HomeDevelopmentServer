import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { ListItemIcon, ListItemText, Menu } from "@mui/material";
import { Download, Edit, Share } from "@mui/icons-material";


export const GridMenuView = ({ anchorEl, open, handleClose, download }) => {
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      sx={{ width: 320, maxWidth: "100%" }}
    >
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <Share />
        </ListItemIcon>
        <ListItemText>Share</ListItemText>
      </MenuItem>
      <MenuItem onClick={download}>
        <ListItemIcon>
          <Download />
        </ListItemIcon>
        <ListItemText>Download</ListItemText>
      </MenuItem>
    </Menu>
  );
};
