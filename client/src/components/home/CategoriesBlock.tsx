import { useState } from "react";
import BlockHeader from "./BlockHeader";
import {
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetPopularCategoriesQuery } from "../../store/services/storeAPI";
import Loading from "../common/Loading";
import { BASE_URL } from "../../helpers/config";
import { Link } from "react-router-dom";

export default function CategoriesBlock() {
  const theme = useTheme();
  const [page, setPage] = useState<number>(1);
  const { data, isFetching, error, refetch } = useGetPopularCategoriesQuery({
    page,
    page_size: 6,
  });
  return (
    <>
      <BlockHeader
        label="Categories"
        title="Browse By Category"
        pagination={true}
        page={page}
        pages={5}
        previousClick={() => setPage(page - 1)}
        nextClick={() => setPage(page + 1)}
      />
      <Grid2 container spacing={3}>
        <Loading
          loading={isFetching}
          error={error}
          refetch={refetch}
          skeleton={Array.from({ length: 6 }).map((_, index) => (
            <Grid2 size={{ xs: 4, md: 2 }} key={index} height={"136px"}>
              <Skeleton width="100%" height="100%" variant="rounded" />
            </Grid2>
          ))}
        >
          {data?.results.map((category) => (
            <Grid2 size={{ xs: 4, md: 2 }} key={category.id}>
              <Link
                to={`/category/${category.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.secondary.main}`,
                    bgcolor: "background.default",
                    paddingTop: 3,
                  }}
                  elevation={0}
                >
                  <CardMedia
                    component="img"
                    height="50"
                    sx={{
                      objectFit: "contain",
                      paddingInline: 5,
                    }}
                    image={
                      category.icon.includes("http")
                        ? category.icon
                        : `${BASE_URL}${category.icon}`
                    }
                    alt={category.name}
                  />
                  <CardContent>
                    <Typography variant="body2" textAlign="center">
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid2>
          ))}
        </Loading>
      </Grid2>
    </>
  );
}
