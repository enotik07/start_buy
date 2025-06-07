import { Facebook, Instagram, X, Pinterest, LinkedIn } from "@mui/icons-material";
import { Box, Button, Container, Divider, Grid2, IconButton, Link, styled, TextField, Typography } from "@mui/material";

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.text.secondary,
  padding: "64px 0 32px",
  position: "relative",
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "scale(1.1)",
    transition: "all 0.3s ease",
  },
}));

export function Footer() {
  return <StyledFooter>
  <Container maxWidth="lg">
    <Grid2 container spacing={4}>
      {/* Customer Support */}
      <Grid2 size={{xs: 12, sm: 6, md: 3}}>
        <Typography variant="h6" gutterBottom fontWeight={800}>
          Customer Support
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <FooterLink href="#">Track Order</FooterLink>
          <FooterLink href="#">Returns & Exchanges</FooterLink>
          <FooterLink href="#">Shipping Information</FooterLink>
          <FooterLink href="#">FAQ</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
        </Box>
      </Grid2>

      {/* Company Information */}
      <Grid2 size={{xs: 12, sm: 6, md: 3}}>
        <Typography variant="h6" gutterBottom fontWeight={800}>
          Company Information
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <FooterLink href="#">About Us</FooterLink>
          <FooterLink href="#">Careers</FooterLink>
          <FooterLink href="#">Press</FooterLink>
          <FooterLink href="#">Investor Relations</FooterLink>
          <FooterLink href="#">Corporate Responsibility</FooterLink>
        </Box>
      </Grid2>

      {/* Shopping Categories */}
      <Grid2 size={{xs: 12, sm: 6, md: 3}}>
        <Typography variant="h6" gutterBottom fontWeight={800}>
          Shopping Categories
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <FooterLink href="#">Women</FooterLink>
          <FooterLink href="#">Men</FooterLink>
          <FooterLink href="#">Kids</FooterLink>
          <FooterLink href="#">Accessories</FooterLink>
          <FooterLink href="#">Sale Items</FooterLink>
        </Box>
      </Grid2>

      {/* Newsletter Signup */}
      <Grid2 size={{xs: 12, sm: 6, md: 3}}>
        <Typography variant="h6" gutterBottom fontWeight={800}>
          Stay Connected
        </Typography>
        <Typography variant="body2" paragraph>
          Subscribe to our newsletter for exclusive offers and updates!
        </Typography>
        <form>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your email"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              input: { color: "#ffffff" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Subscribe
          </Button>
        </form>
      </Grid2>
    </Grid2>

    <Divider sx={{ my: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

    {/* Social Media */}
    <Box display="flex" justifyContent="center" gap={2} mb={4}>
      <SocialButton aria-label="Facebook">
        <Facebook />
      </SocialButton>
      <SocialButton aria-label="Instagram">
        <Instagram />
      </SocialButton>
      <SocialButton aria-label="Twitter">
        <X />
      </SocialButton>
      <SocialButton aria-label="Pinterest">
        <Pinterest />
      </SocialButton>
      <SocialButton aria-label="LinkedIn">
        <LinkedIn />
      </SocialButton>
    </Box>

    {/* Legal Links */}
    <Box display="flex" justifyContent="center" gap={3} mb={2}>
      <FooterLink href="#">Privacy Policy</FooterLink>
      <FooterLink href="#">Terms of Service</FooterLink>
      <FooterLink href="#">Cookie Preferences</FooterLink>
      <FooterLink href="#">Accessibility</FooterLink>
    </Box>

    {/* Copyright */}
    <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
      © {new Date().getFullYear()} SmartBuy. All rights reserved.
    </Typography>
  </Container>
</StyledFooter>;
}
