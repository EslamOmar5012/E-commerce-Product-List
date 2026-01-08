import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";
import Categories from "../filtring/Categories";

import { Container, Grid } from "@mui/material";
import styled from "@emotion/styled";

// STYLED COMPONENT: Custom grid styling with auto margins and spacing
// Applies consistent margins and text alignment to product grid
const StyledGrid = styled(Grid)(() => ({
  margin: "auto",
  marginTop: "20px",
  textAlign: "center",
}));

// COMPONENT: Renders product grid with categories filter and product cards
// Displays either search results or filtered/all products
function ProductGrid() {
  // Get products data and search state from context
  const { showedProducts, searchedProducts } = useProducts();

  // LOGIC: Display search results if search is active, otherwise show filtered/all products
  // PERFORMANCE NOTE: This logic uses array length check which isn't ideal
  // Better approach would be to explicitly check if search input is not empty
  const productsToDisplay =
    searchedProducts.length > 0 ? searchedProducts : showedProducts;

  return (
    <Container maxWidth="lg" sx={{ mt: "100px" }}>
      {/* Categories filter section */}
      <Categories />
      {/* Grid container for product cards with responsive layout */}
      {/* xs: full width, sm: 2 cols, md: 3 cols */}
      <StyledGrid container spacing={2}>
        {/* Map through products and render ProductCard for each */}
        {productsToDisplay.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </StyledGrid>
    </Container>
  );
}

export default ProductGrid;
