import { IProductCard } from "../../models/store";
import { Link } from "react-router-dom";
import {
  Tooltip,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { BASE_URL } from "../../helpers/config";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useAddCartItemMutation } from "../../store/services/storeAPI";

export interface IProductCardProps {
  product: IProductCard;
  params?: string;
}

export default function ProductCard({
  product,
  params = "",
}: IProductCardProps) {
  const [addToCart, { isLoading }] = useAddCartItemMutation();
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await addToCart({ product: product.id, quantity: 1 });
  };

  return (
    <Link
      to={`/product/${product.id}?${params}`}
      style={{ textDecoration: "none" }}
    >
      <Tooltip title={product.name}>
        <Card sx={{ bgcolor: "background.default" }}>
          <CardMedia
            component="img"
            width="100%"
            sx={{
              objectFit: "contain",
              aspectRatio: "1/1",
            }}
            image={BASE_URL + product.image}
            alt={product.name}
          />
          <CardContent>
            <Typography
              variant="body1"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.name}
            </Typography>
            <Typography variant="h6" sx={{ marginBlock: 1 }} fontWeight={600}>
              ${product.price}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ShoppingCartOutlined />}
              fullWidth
              onClick={handleClick}
              loading={isLoading}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Tooltip>
    </Link>
  );
}
