import { Card, CardMedia, Grid } from "@mui/material";
import { useEffect, useRef } from "react";

export const CardView = ({ path, onClick, index, callback }) => {
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      // setIntersecting(entry.isIntersecting)
      entry.isIntersecting ? callback() : null
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref,callback]);
  return (
    <Grid ref={ref} item xs={2} sm={4} md={4} key={index}>
      <Card
        variant="outlined"
        onClick={() => {
          onClick(index);
        }}
      >
        <CardMedia
          component="img"
          height="255"
          image={path}
          style={{ objectFit: "contain" }}
        ></CardMedia>
      </Card>
    </Grid>
  );
};
