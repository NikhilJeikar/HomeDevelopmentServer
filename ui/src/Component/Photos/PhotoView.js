import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Home } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice";
import { SetCookies, readCookies } from "../../utils";
import { fetch_faces, fetch_image_details } from "./slice";
import { PhotoGrid } from "./Grid";
import { useEffect, useState } from "react";
import { FaceListItem } from "./FaceListItem";
import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";

const drawerWidth = 240;

export const PhotosView = () => {
  const dispatch = useDispatch();
  const [constructed, setConstructed] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const { face_list, refresh_photo_list } = useSelector((state) => state.photo);

  const LogoutUser = () => {
    dispatch(logout());
    SetCookies(null, null);

    navigate("/");
  };
  var { username } = readCookies();

  useEffect(() => {
    if (!constructed) {
      dispatch(fetch_image_details());
      dispatch(fetch_faces());
    }else{
      setConstructed(true);
    }
  },[constructed, dispatch]);
  useEffect(() => {
    if (refresh_photo_list) {
      console.log("Trigger")
      dispatch(fetch_faces());
    }
  },[dispatch, refresh_photo_list]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <Box sx={{ display: "flex" }} id="content">
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
            Photos
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              variant="dense"
              startIcon={<Home />}
              onClick={() => {
                navigate("/drive");
              }}
            >
              Home
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
            {face_list.map((value, index) => (
              <FaceListItem
                key={index}
                index={index}
                id={value.id}
                path={value.default_pic_path}
                name={value.name}
                x1={value.face_x1}
                x2={value.face_x2}
                y1={value.face_y1}
                y2={value.face_y2}
              />
            ))}
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
      <Box
        component="main"
        style={{ paddingLeft: 15, paddingTop: 0 }}
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Toolbar variant="dense" />
        <PhotoGrid />
      </Box>
    </Box>
  );
};
