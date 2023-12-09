import MoreIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Menu,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
export const FaceListItemView = ({
  name,
  path,
  edit,
  makeEditable,
  rename,
  hide,
  id,
  add_filter
}) => {
  const [newName, setNewName] = useState(name);
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ListItem
    onClick={()=>{add_filter(name,path,id)}}
      secondaryAction={
        <div>
          <IconButton onClick={handleOpenUserMenu}>
            <MoreIcon />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              onClick={() => {
                hide();
                handleCloseUserMenu();
              }}
            >
              <Typography textAlign="center">Hide</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                makeEditable(true);
                handleCloseUserMenu();
              }}
            >
              <Typography textAlign="center">Rename</Typography>
            </MenuItem>
          </Menu>
        </div>
      }
    >
      <ListItemAvatar>
        <Avatar src={path} />
      </ListItemAvatar>
      <ListItemText
        primary=<input
          autoFocus
          value={newName}
          readOnly={!edit}
          style={!edit ? { border: "none", outline: "none" ,width: "-webkit-fill-available"} : {width: "-webkit-fill-available"}}
          onDoubleClick={() => {
            makeEditable(true);
          }}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (newName !== name || newName.trimEnd().length !== 0) {
                rename(newName);
              }
              makeEditable(false);
            }
          }}
          onBlur={(e) => {
            makeEditable(false);
            e.stopPropagation();
          }}
        ></input>
      />
    </ListItem>
  );
};
