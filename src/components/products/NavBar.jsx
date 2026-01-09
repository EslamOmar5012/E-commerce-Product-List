import { useProducts } from "../../hooks/useProducts";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  styled,
  alpha,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Styled search container
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

// Styled custom input field
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

//  Wrapper for search icon to handle the icon position
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Navigation bar with search and cart icon, it displays brand name, search input , and shopping cart badge
function NavBar() {
  // Import cart count and search update function from products context
  const { cartProductsNumber, debouncedSearch, updateSearch } = useProducts();

  // Function to update search state when user types in search input (it uses debounce) (it is in controlled component)
  const handleSearchChange = (e) => {
    updateSearch(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, zIndex: 1 }} position="fixed">
      <AppBar>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Brand/Title - hidden on mobile for space efficiency */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 700,
              mr: { sm: 2 },
              whiteSpace: "nowrap",
            }}
          >
            E-commerce
          </Typography>

          {/* Search Bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            {/* Search input with onChange handler to update context state (controlled component) */}
            <StyledInputBase
              placeholder="Search products…"
              inputProps={{ "aria-label": "search" }}
              value={debouncedSearch}
              onChange={handleSearchChange}
            />
          </Search>

          {/* Cart Icon with Badge showing item count */}
          {/* Badge only displays if cart has items (cartProductsNumber > 0) */}
          <Box sx={{ display: "flex" }}>
            <IconButton
              size="large"
              aria-label={`show ${cartProductsNumber} items in cart`}
              color="inherit"
            >
              {cartProductsNumber === 0 ? (
                <ShoppingCartIcon />
              ) : (
                <Badge badgeContent={cartProductsNumber} color="error">
                  <ShoppingCartIcon />
                </Badge>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default NavBar;
