import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";
import Categories from "../filtring/Categories";
import { useMemo, memo } from "react";

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
// Memoized to prevent re-renders when parent updates but products haven't changed
function ProductGrid() {
  // Get products data and search state from context
  const { showedProducts, searchedProducts } = useProducts();

  // MEMOIZED LOGIC: Determine which products to display
  // searchedProducts is already memoized from context, so this will be stable
  // Only recalculates when search results or filtered products change
  const productsToDisplay = useMemo(() => {
    return searchedProducts.length > 0 ? searchedProducts : showedProducts;
  }, [searchedProducts, showedProducts]);

  return (
    <Container maxWidth="lg" sx={{ mt: "100px" }}>
      {/* Categories filter section */}
      <Categories />
      {/* Grid container for product cards with responsive layout */}
      {/* xs: full width, sm: 2 cols, md: 3 cols */}
      <StyledGrid container spacing={2}>
        {/* Map through products and render ProductCard for each */}
        {/* ProductCard is memoized to prevent re-renders on parent updates */}
        {productsToDisplay.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </StyledGrid>
    </Container>
  );
}

// Export memoized component
export default memo(ProductGrid);
