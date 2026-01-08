import { createContext, useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

// Create context for managing products, categories, search, and cart state
const ProductsContext = createContext();

function ProductsProvider({ children }) {
  // STATE: Store extracted categories from products list
  const [categories, setCategories] = useState(null);

  // STATE: Store products filtered by selected category
  const [filteredProducts, setFilteredProducts] = useState([]);

  // STATE: Store products filtered by search query
  const [searchedProducts, setSearchedProducts] = useState([]);

  // STATE: Store current search input value
  const [search, setSearch] = useState("");

  // STATE: Store product IDs in cart (persisted to localStorage for persistence)
  // Initialized with localStorage data if available, otherwise empty array
  const [cartProducts, setCartProducts] = useState(() => {
    const saved = localStorage.getItem("cartProducts");
    return saved ? JSON.parse(saved) : [];
  });

  // DERIVED STATE: Calculate cart items count from cartProducts array length
  const cartProductsNumber = cartProducts.length;

  // QUERY: Fetch all products from FakeStore API using React Query
  // React Query handles caching, retry logic, and loading/error states
  const {
    isPending: isLoading,
    error,
    data: products,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("https://fakestoreapi.com/products");
      if (res.status !== 200) throw new Error(res.message);
      if (!res.data) throw new Error("there is no products to show");

      // Extract categories from fetched products
      handleCategories(res.data);

      return res.data;
    },
  });

  // DERIVED STATE: Determine products to display based on category filter
  // If filteredProducts is empty (no category selected), show all products
  // Otherwise show only products from selected category
  const showedProducts =
    filteredProducts.length === 0 ? products : filteredProducts;

  // FUNCTION: Extract unique categories from products array using Set
  // Maps products to their categories, converts to Set to remove duplicates, spreads back to array
  const handleCategories = (products) => {
    const categoriesArr = [
      ...new Set(products.map((product) => product.category)),
    ];
    setCategories(categoriesArr);
  };

  // FUNCTION: Add product to cart and persist to localStorage
  // Stores only product ID (not entire object) to minimize storage
  // Updates localStorage immediately to persist cart across page refreshes
  const addProductToCart = (product) => {
    setCartProducts((prev) => {
      const updated = [...prev, product.id];
      localStorage.setItem("cartProducts", JSON.stringify(updated));
      return updated;
    });
  };

  // FUNCTION: Remove product from cart and persist to localStorage
  // Filters out product ID and updates localStorage
  const removeProductFromCart = (product) => {
    setCartProducts((prev) => {
      const updated = prev.filter((id) => id !== product.id);
      localStorage.setItem("cartProducts", JSON.stringify(updated));
      return updated;
    });
  };

  // FUNCTION: Check if product is already in cart (for button state)
  const isProductInCart = (productId) => {
    return cartProducts.includes(productId);
  };

  // FUNCTION: Filter products by selected category and reset search
  const makeFilteredProducts = (category) => {
    setSearch("");
    if (category === "all") {
      setFilteredProducts([]);
      return;
    }
    setFilteredProducts(
      products.filter((element) => element.category === category)
    );
  };

  // EFFECT: Search products in real-time as user types
  // Filters showedProducts (which respects category filter) by title and description
  // Case-insensitive search by converting strings to lowercase
  // Only triggers search if input is 3+ characters to reduce re-renders
  // PERFORMANCE ISSUES:
  // 1. Creates new regex/filter on every keystroke (expensive for large arrays)
  // 2. toLowerCase() called multiple times per search - could be memoized
  // 3. Search effect runs even when search is empty, clearing results unnecessarily
  // OPTIMIZATION: Use useMemo to cache search results, add debouncing for input
  useEffect(() => {
    const updateSearch = () => {
      if (searchedProducts.length > 0) {
        searchedProducts((prev) =>
          prev.filter(
            (element) =>
              element.title.includes(search.toLowerCase()) ||
              element.description.includes(search.toLowerCase())
          )
        );
      } else
        setSearchedProducts(
          showedProducts.filter(
            (element) =>
              element.title.includes(search.toLowerCase()) ||
              element.description.includes(search.toLowerCase())
          )
        );
    };
    if (search.length >= 3) updateSearch();

    return () => setSearchedProducts([]);
  }, [search, setSearchedProducts, showedProducts, searchedProducts]);

  // PROVIDER PATTERN: Expose state and functions through context
  // All components wrapped by ProductsProvider can access these values via useContext()
  return (
    <ProductsContext.Provider
      value={{
        isLoading,
        error,
        showedProducts,
        searchedProducts,
        categories,
        search,
        cartProductsNumber,
        updateSearch: setSearch,
        addProductToCart,
        removeProductFromCart,
        isProductInCart,
        makeFilteredProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export { ProductsContext, ProductsProvider };
