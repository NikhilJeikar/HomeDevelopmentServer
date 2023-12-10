import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import {
  Delete,
  Description,
  Download,
  Edit,
  Folder,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  delete_file,
  delete_folder,
  download_file,
  download_folder,
  rename_file,
  rename_folder,
} from "../../slice";
import {
  Avatar,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";

export const RowView = ({ details, handle, setPath }) => {
  var data = new Date(details.metadata.modified * 1000);
  const { current_path } = useSelector((state) => state.drive);
  const [renameThis, setRenameThis] = useState(false);
  const [newName, setNewName] = useState(details.name);
  const dispatch = useDispatch();
  let timeout = null;

  const download = (e) => {
    if (details.is_dir) {
      dispatch(
        download_folder({
          name: details.name,
          current_path: current_path,
        })
      );
    } else {
      dispatch(
        download_file({
          name: details.name,
          current_path: current_path,
        })
      );
    }
    e.stopPropagation();
  };

  const delete_request = (e) => {
    if (details.is_dir) {
      dispatch(
        delete_folder({
          name: details.name,
          current_path: current_path,
        })
      );
    } else {
      dispatch(
        delete_file({
          name: details.name,
          current_path: current_path,
        })
      );
    }
    e.stopPropagation();
  };

  const rename = (name) => {
    if (details.is_dir) {
      dispatch(
        rename_folder({
          prev_name: details.name,
          name: name,
          current_path: current_path,
        })
      );
    } else {
      dispatch(
        rename_file({
          prev_name: details.name,
          name: name,
          current_path: current_path,
        })
      );
    }
  };

  const renameTrigger = (e) => {
    setRenameThis(true);
    e.stopPropagation();
  };

  useEffect(() => {
    setNewName(details.name);
  }, [details.name]);
  return (
    <TableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      onClick={() => {
        if (details.is_dir) {
          handle(details.name);
        }
      }}
      style={{ padding: 0 }}
    >
      <TableCell component="th" scope="row" padding="none">
        <ListItemIcon>
          <Icon style={{ marginLeft: 5, marginRight: 5 }}>
            {details.is_dir ? <Folder /> : <Description />}
          </Icon>
          <input
            autoFocus
            value={newName}
            readOnly={!renameThis}
            style={
              !renameThis
                ? {
                    border: "none",
                    outline: "none",
                    backgroundColor: "#efefef",
                  }
                : null
            }
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            onDoubleClick={(e) => {
              window.clearTimeout(timeout);
              timeout = null;
              setRenameThis(true);
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (newName !== details.name) {
                  rename(newName);
                }
                setRenameThis(false);
              }
            }}
            onBlur={(e) => {
              setRenameThis(false);
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (timeout === null) {
                timeout = window.setTimeout(() => {
                  timeout = null;
                  if (details.is_dir) {
                    handle(details.name);
                  }
                }, 300);
              }
            }}
          ></input>
        </ListItemIcon>
      </TableCell>
      <TableCell padding="none">
        <ListItem>
          <Avatar sx={{ width: 30, height: 30 }}>
            {details.metadata.Author.toUpperCase().charAt(0)}
          </Avatar>
          <ListItemText
            style={{ paddingLeft: 10 }}
            primary={details.metadata.Author}
          />
        </ListItem>
      </TableCell>
      <TableCell padding="none">
        <ListItem>
          <ListItemText primary={data.toLocaleDateString()} />
        </ListItem>
      </TableCell>
      <TableCell align="center" padding="none">
        <ListItemIcon>
          <Tooltip title="Rename" placement="left" arrow>
            <IconButton onClick={renameTrigger}>
              <Edit style={{ paddingLeft: 5 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download" placement="left" arrow>
            <IconButton onClick={download}>
              <Download style={{ paddingLeft: 5 }} />
            </IconButton>
          </Tooltip>
          {details.is_dir ? (
            <Tooltip title="Share" placement="left" arrow>
              <IconButton
                onClick={(e) => {
                  setPath(details.name);
                  e.stopPropagation();
                }}
              >
                <ShareIcon style={{ paddingLeft: 5 }} />
              </IconButton>
            </Tooltip>
          ) : null}
          <Tooltip title="Delete" placement="left" arrow>
            <IconButton onClick={delete_request}>
              <Delete style={{ paddingLeft: 5 }} />
            </IconButton>
          </Tooltip>
        </ListItemIcon>
      </TableCell>
    </TableRow>
  );
};
