import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Description, Folder } from "@mui/icons-material";
import { GridMenu } from "./GridMenu";
import { useDispatch, useSelector } from "react-redux";
import { download_file, download_folder } from "../slice";

export const GridCardView = ({ details, handle }) => {
  var data = new Date(details.metadata.created * 1000);
  const { username } = useSelector((state) => state.user);
  const { current_path } = useSelector((state) => state.home);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const download = () => {
    handleClose();
    if(details.is_dir){
      dispatch(
        download_folder({
          username: username,
          name: details.name,
          current_path: current_path
        })
      );
    }else{
      dispatch(
        download_file({
          username: username,
          name: details.name,
          current_path: current_path
        })
      );
    }
  };
  return (
    <Card xs="auto">
      <CardHeader
        avatar={details.is_dir ? <Folder /> : <Description />}
        style={{ padding: 3 }}
        onClick={() => {
          if (details.is_dir) {
            handle(details.name);
          }
        }}
        action={
          <div>
            {details.metadata.Shared !== 0 ? (
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
            ) : null}
            <IconButton
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                e.stopPropagation();
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        }
        title={details.name}
        subheader={data.toLocaleDateString()}
      />
      <GridMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        download={download}
      />
    </Card>
  );
};
