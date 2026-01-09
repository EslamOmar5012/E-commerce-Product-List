import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";
import Categories from "../filtring/Categories";

import { Container, Grid } from "@mui/material";
import styled from "@emotion/styled";

// Custom grid styling
const StyledGrid = styled(Grid)(() => ({
  margin: "auto",
  marginTop: "20px",
  textAlign: "center",
}));

function ProductGrid() {
  // Get products data and searchedProducts data from context
  const { showedProducts, searchedProducts } = useProducts();

  // If there is no searched Products (user don't search for specific product i will show all of the products or the products of one category)
  const productsToDisplay =
    searchedProducts.length > 0 ? searchedProducts : showedProducts;

  return (
    <Container maxWidth="lg" sx={{ mt: "100px" }}>
      {/* Categories filter section */}
      <Categories />
      {/* Grid container for product cards with responsive layout */}
      <StyledGrid container spacing={2}>
        {/* Map through products and render ProductCards for every product */}
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
