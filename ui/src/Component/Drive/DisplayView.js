import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  CreateNewFolder,
  DriveFolderUpload,
  UploadFile,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice";
import { Popup } from "./CreatePopUp";
import { create_folder, upload_file, clearState } from "./slice";
import { SetCookies, readCookies } from "../../utils";
import { CollapsedBreadcrumbs } from "./BreadCrumbs";
import { ListWindow } from "./List";
import IconButton from "@mui/material/IconButton";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Avatar, Button, Card, CardContent } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const drawerWidth = 240;

export const DisplayView = () => {
  const dispatch = useDispatch();

  const { current_path, path_list } = useSelector((state) => state.drive);

  const [folderPopup, setFolderPopup] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { authorized } = useSelector((state) => state.drive);
  var { username } = readCookies();
  React.useEffect(() => {
    if (!authorized) {
      navigate("/");
    }
  });
  const navigate = useNavigate();

  const CreateFolder = (name) => {
    if (name !== "") {
      dispatch(
        create_folder({
          current_path: current_path,
          name: name,
        })
      );
    }
  };

  const CloseFolder = () => {
    setFolderPopup(false);
  };

  const UploadFileFunction = (files) => {
    dispatch(upload_file({ file: files, path: current_path }));
  };

  const LogoutUser = () => {
    dispatch(logout());
    SetCookies(null, null);
    dispatch(clearState());
    navigate("/");
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        color="transparent"
        variant="dense"
        elevation={0}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Drive
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              variant="dense"
              startIcon={<Camera />}
              onClick={() => {
                navigate("/photo");
              }}
            >
              Photos
            </Button>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
              onClick={handleOpenUserMenu}
            >
              <Avatar>{username.toUpperCase().at(0)}</Avatar>
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
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Change Password</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  LogoutUser();
                  handleCloseUserMenu();
                }}
              >
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton>
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar variant="dense" />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem key={"upload file"} disablePadding>
              <ListItemButton variant="contained" component="label">
                <ListItemIcon>
                  <UploadFile />
                </ListItemIcon>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  hidden
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                  onChange={(e) => {
                    UploadFileFunction(e.target.files);
                  }}
                />
                <ListItemText primary="Upload File" />
              </ListItemButton>
            </ListItem>
            <ListItem key={"upload folder"} disablePadding>
              <ListItemButton variant="contained" component="label">
                <ListItemIcon>
                  <DriveFolderUpload />
                </ListItemIcon>
                <input
                  type="file"
                  directory=""
                  webkitdirectory=""
                  hidden
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                  onChange={(e) => {
                    UploadFileFunction(e.target.files);
                  }}
                />
                <ListItemText primary="Upload Folder" />
              </ListItemButton>
            </ListItem>
            <ListItem key={"create folder"} disablePadding>
              <ListItemButton
                onClick={() => {
                  setFolderPopup(true);
                }}
              >
                <ListItemIcon>
                  <CreateNewFolder />
                </ListItemIcon>
                <ListItemText primary="Create Folder" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box
          sx={{
            width: "100%",
            overflow: "auto",
            position: "absolute",
            bottom: 0,
          }}
        >
        </Box>
      </Drawer>
      <Box style={{ padding: 12 }} sx={{ flexGrow: 1, height: "100%" ,marginTop:1}}>
        <Toolbar variant="dense" />
        <Popup
          open={folderPopup}
          title={"New folder"}
          handleClose={CloseFolder}
          onSubmit={CreateFolder}
          buttonText="Create"
        />
        <Box
          sx={{ height: "100%", width: "100%", display: "inline-block" }}
          component={"main"}
        >
          <Card
            elevation={0}
            style={{
              backgroundColor: "#efefef",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <CardContent style={{ flex: 1, paddingBottom: 0 }}>
              <CollapsedBreadcrumbs Path={path_list} />
              <ListWindow />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
