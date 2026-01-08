import { useProducts } from "../../hooks/useProducts";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Rating,
  Typography,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import styled from "@emotion/styled";

// Custom styled component for the CardMedia to handle the smooth hover animation
const StyledCardMedia = styled(CardMedia)(() => ({
  height: 192,
  width: "100%",
  objectFit: "contain",
  transition: "transform 500ms ease-in-out",
  "&:hover": {
    transform: "scale(1.1) rotate(3deg)",
  },
}));

function ProductCard({ product }) {
  const { addProductToCart, removeProductFromCart, isProductInCart } =
    useProducts();

  const isSelected = isProductInCart(product.id);

  const handleAddProductsToCart = () => {
    addProductToCart(product);
  };

  const handleRemoveProductsFromCart = () => {
    removeProductFromCart(product);
  };

  return (
    <Card
      sx={{
        maxWidth: 384,
        width: "100%",
        boxShadow: 3,
        transition: "box-shadow 300ms",
        "&:hover": { boxShadow: 6 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        backgroundColor: "grey.50",
        margin: "auto",
      }}
    >
      {/* Image Wrapper with Overflow Hidden */}
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: "3px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <StyledCardMedia
          component="img"
          alt={product.title}
          image={product.image}
        />
      </Box>

      <CardContent sx={{ p: 2 }}>
        {/* Categories Chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Chip
            label={product.category}
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: 500,
              opacity: 0.85,
            }}
          />
        </Box>

        {/* Title and Price */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: "grey.900",
              pr: 0.5,
              lineHeight: "tight",
            }}
          >
            {product.title}
          </Typography>
        </Box>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Rating
            name="read-only"
            value={product.rating.rate}
            readOnly
            precision={0.1}
            size="small"
          />
          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
            ({product.rating.count})
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            overflow: "hidden",
            textAlign: "left",
            mb: 2,
          }}
        >
          {product.description}
        </Typography>

        {/* Price */}
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 800, mb: 1, textAlign: "left" }}
        >
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>

      {/* buttons */}
      <CardActions
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "grey.100",
        }}
      >
        {/* button to add product to cart */}
        <Button
          variant="contained"
          size="large"
          startIcon={isSelected ? "" : <ShoppingCartIcon />}
          sx={{
            mb: "5px",
            flexGrow: 1,
            borderRadius: 8,
            boxShadow: 2,
            "&:hover": { boxShadow: 4 },
            display: isSelected ? "none" : "flex",
          }}
          disabled={isSelected}
          onClick={handleAddProductsToCart}
        >
          {isSelected ? "Added to cart" : "Add to cart"}
        </Button>

        {/* button to remove product from cart */}
        {isSelected && (
          <Button
            variant="contained"
            color="error"
            size="medium"
            sx={{
              flexGrow: 1,
              borderRadius: 8,
              boxShadow: 2,
              "&:hover": { boxShadow: 4 },
            }}
            onClick={handleRemoveProductsFromCart}
          >
            Remove from cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default ProductCard;
