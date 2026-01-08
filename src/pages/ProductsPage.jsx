import NavBar from "../components/products/NavBar.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";
import { useProducts } from "../hooks/useProducts.js";

import { Alert, Box, CircularProgress, Container } from "@mui/material";

function ProductsPage() {
  const { isLoading, error, showedProducts, searshedProducts } = useProducts();

  return (
    <>
      {/* navbar component */}
      <NavBar />

      {/* Loading state animation */}
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {/* error box to show error */}
      {error && (
        <Container sx={{ mt: "100px" }}>
          <Alert severity="error">Error: {error.message}</Alert>
        </Container>
      )}

      {/* product container */}
      {!isLoading && !error && (showedProducts || searshedProducts) && (
        <ProductGrid />
      )}
    </>
  );
}

export default ProductsPage;
