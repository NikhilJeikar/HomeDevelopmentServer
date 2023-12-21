import {
  Block,
  CheckCircle,
  HighlightOff,
  QueryBuilder,
  Remove,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import { useState } from "react";

export const UploadProgressView = ({ open, files }) => {
  const [minimize, setMinimize] = useState(false);
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Card style={{ width: 300}}>
        <CardHeader
          title="Upload status"
          titleTypographyProps={{ fontSize: 18 }}
          style={!minimize ? { paddingBottom: 0 } : null}
          action={
            <IconButton
              onClick={() => {
                setMinimize(!minimize);
              }}
            >
              <Remove />
            </IconButton>
          }
        />
        <CardContent
          style={
            !minimize
              ? { maxHeight: 200, overflow: "scroll", padding: 0, width: 300 }
              : { display: "none", width: 300 }
          }
        >
          <List>
            {Object.keys(files).map((key, index) => (
              <ListItem
              key={index}
              >
                {files[key].progress === "started" ? (
                  <CircularProgress size={15} />
                ) : files[key].progress === "failed" ? (
                  <Block style={{ fontSize: 15, color: "#ff0000" }} />
                ) : files[key].progress === "queued" ? (
                  <QueryBuilder style={{ fontSize: 15 }} />
                ) : (
                  <CheckCircle style={{ fontSize: 15, color: "#188c23" }} />
                )}
                <ListItemText style={{ paddingLeft: 10 }} primary={key} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Snackbar>
  );
};
