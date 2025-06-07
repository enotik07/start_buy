import { alpha, Box, Container, Divider, Stack, Typography, useTheme } from "@mui/material";
import CategoriesBlock from "../components/home/CategoriesBlock";
import ProductsBlock from "../components/home/ProductsBlock";
import {
  LocalShipping as LocalShippingIcon,
  SupportAgent as SupportAgentIcon,
  VerifiedUser as VerifiedUserIcon,
} from "@mui/icons-material";

const services = [
  {
    icon: LocalShippingIcon,
    title: "Free and fast delivery",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: SupportAgentIcon,
    title: "24/7 Customer service",
    description: "Friendly 24/7 customer support",
  },
  {
    icon: VerifiedUserIcon,
    title: "Money back guarantee",
    description: "We return money within 30 days",
  },
];

export default function HomePage() {
  const theme=useTheme();
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="column" spacing={4}>
        <CategoriesBlock />
        <Divider sx={{ marginInline: 2 }} />
        <ProductsBlock />

        <Divider sx={{ marginInline: 2 }} />
        <Box display="flex" justifyContent="space-evenly">
          {services.map((item, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Box
                sx={{
                  boxShadow: `0 0 10px 4px ${alpha(theme.palette.primary.main, 0.4)}`,
                  borderRadius: "50%",
                  aspectRatio: 1,
                  width: "fit-content",
                  bgcolor: "primary.main",
                  padding: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <item.icon
                  fontSize="large"
                  sx={{ color: "background.default" }}
                />
              </Box>           
              <Typography
                variant="h6"
                textTransform="uppercase"
              >
                {item.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Container>
  );
}
