import { Card, Box, Skeleton, CardContent, Typography } from "@mui/material";

export default function ProductCardSkeleton() {
  return (
    <Card sx={{ bgcolor: "background.default" }}>
      <Box sx={{ aspectRatio: "1/1" }}>
        <Skeleton variant="rounded" width="100%" height="100%" />
      </Box>
      <CardContent>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="h6" sx={{ marginBlock: 1 }}>
          <Skeleton />
        </Typography>
        <Skeleton variant="rounded" width="100%" height="36.1px" />
      </CardContent>
    </Card>
  );
}
