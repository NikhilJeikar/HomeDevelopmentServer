import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useState } from "react";

export const FaceListItemView = ({ index, name, path, edit, makeEditable,rename }) => {
  const [newName,setNewName] = useState(name)
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={path} />
      </ListItemAvatar>
      <ListItemText
        primary=<input
          value={newName}
          readOnly={!edit}
          style={!edit ? { border: "none", outline: "none" } : null}
          onDoubleClick={()=>{makeEditable(true)}}
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
