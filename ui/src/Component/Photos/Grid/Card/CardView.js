import { Card, CardMedia, Fade, Grid, Tooltip } from "@mui/material";
import { useEffect, useRef } from "react";

export const CardView = ({ path, onClick, index, callback, file_path }) => {
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? callback() : null
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
  return (
    <Grid ref={ref} item xs={2} sm={4} md={4} key={index}>
      <Card
        variant="outlined"
        onClick={() => {
          onClick(index);
        }}
      >
        <Tooltip title={file_path} TransitionComponent={Fade}>
          <CardMedia
            component="img"
            height="255"
            image={path}
            style={{ objectFit: "contain" }}
          />
        </Tooltip>
      </Card>
    </Grid>
  );
};
