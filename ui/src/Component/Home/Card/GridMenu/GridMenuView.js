import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { ListItemIcon, ListItemText, Menu } from "@mui/material";
import { Delete, Download, Edit, Share } from "@mui/icons-material";
import { Popup } from "../../CreatePopUp";

export const GridMenuView = ({
  anchorEl,
  open,
  handleClose,
  download,
  delete_request,
  rename,
}) => {
  const [renameOpen, setRenameOpen] = React.useState(false);
  const renameEvent = (event) => {
    setRenameOpen(!renameOpen)
  };
  const renameSubmit = (name) => {
    rename(name)
  }
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
      <MenuItem onClick={renameEvent}>
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>
      <MenuItem onClick={delete_request}>
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
      <Popup open={renameOpen} buttonText={"Change"} title={"Rename"} handleClose={renameEvent} onSubmit={renameSubmit}/>
    </Menu>

  );
};
