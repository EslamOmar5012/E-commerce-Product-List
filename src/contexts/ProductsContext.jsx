import {
  createContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

// Create context for managing products, categories, search, and cart state
const ProductsContext = createContext();

function ProductsProvider({ children }) {
  // STATE: Store extracted categories from products list
  const [categories, setCategories] = useState(null);

  // STATE: Store products filtered by selected category
  const [filteredProducts, setFilteredProducts] = useState([]);

  // STATE: Store current search input value
  const [search, setSearch] = useState("");

  // STATE: Store product IDs in cart as Set for O(1) lookup performance
  // Initialized with localStorage data converted to Set
  // Set provides faster lookups than array .includes() method
  const [cartProducts, setCartProducts] = useState(() => {
    const saved = localStorage.getItem("cartProducts");
    const ids = saved ? JSON.parse(saved) : [];
    return new Set(ids);
  });

  // REF: Track pending localStorage updates to debounce writes
  // Prevents excessive localStorage calls which are synchronous and blocking
  const cartSaveTimeoutRef = useRef(null);

  // STATE: Track debounced search input to avoid filtering on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // DERIVED STATE: Calculate cart items count from Set size
  const cartProductsNumber = cartProducts.size;

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

  // FUNCTION: Add product to cart with debounced localStorage persistence
  // Uses Set for O(1) add operation instead of array push
  // localStorage update is debounced to batch multiple cart changes
  const addProductToCart = useCallback((product) => {
    setCartProducts((prev) => {
      const updated = new Set(prev);
      updated.add(product.id);

      // Clear existing timeout and set new one for debounced save
      if (cartSaveTimeoutRef.current) clearTimeout(cartSaveTimeoutRef.current);
      cartSaveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem("cartProducts", JSON.stringify([...updated]));
      }, 300);

      return updated;
    });
  }, []);

  // FUNCTION: Remove product from cart with debounced localStorage persistence
  // Uses Set.delete() for efficient removal
  const removeProductFromCart = useCallback((product) => {
    setCartProducts((prev) => {
      const updated = new Set(prev);
      updated.delete(product.id);

      // Clear existing timeout and set new one for debounced save
      if (cartSaveTimeoutRef.current) clearTimeout(cartSaveTimeoutRef.current);
      cartSaveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem("cartProducts", JSON.stringify([...updated]));
      }, 300);

      return updated;
    });
  }, []);

  // FUNCTION: Check if product is already in cart (for button state)
  // O(1) lookup time using Set.has() instead of array.includes() O(n)
  const isProductInCart = useCallback(
    (productId) => {
      return cartProducts.has(productId);
    },
    [cartProducts]
  );

  // FUNCTION: Filter products by selected category and reset search
  const makeFilteredProducts = useCallback(
    (category) => {
      setSearch("");
      setDebouncedSearch("");
      if (category === "all") {
        setFilteredProducts([]);
        return;
      }
      setFilteredProducts(
        products.filter((element) => element.category === category)
      );
    },
    [products]
  );

  // EFFECT: Debounce search input to prevent filtering on every keystroke
  // Wait 300ms after user stops typing before updating debouncedSearch state
  // This reduces unnecessary re-renders and expensive filter operations
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // EFFECT: Memoized search filtering based on debounced input
  // Only recalculates when debouncedSearch or showedProducts changes
  // Converts search to lowercase once instead of per-product
  // Performance: Only runs after user finishes typing (300ms debounce)
  const searchedProducts = useMemo(() => {
    if (debouncedSearch.length < 3) return [];

    const lowerSearch = debouncedSearch.toLowerCase();
    return showedProducts.filter(
      (element) =>
        element.title.toLowerCase().includes(lowerSearch) ||
        element.description.toLowerCase().includes(lowerSearch)
    );
  }, [debouncedSearch, showedProducts]);

  // CALLBACK: Update search input and trigger debounce timer
  // Wrapped in useCallback for stable reference to avoid re-renders
  const updateSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  // MEMOIZED CONTEXT VALUE: Prevent context consumers from re-rendering unnecessarily
  // Only changes when dependencies change, not on every parent re-render
  // This significantly reduces ProductCard re-renders which were causing button state resets
  const contextValue = useMemo(
    () => ({
      isLoading,
      error,
      showedProducts,
      searchedProducts,
      categories,
      search,
      cartProductsNumber,
      updateSearch,
      addProductToCart,
      removeProductFromCart,
      isProductInCart,
      makeFilteredProducts,
    }),
    [
      isLoading,
      error,
      showedProducts,
      searchedProducts,
      categories,
      search,
      cartProductsNumber,
      updateSearch,
      addProductToCart,
      removeProductFromCart,
      isProductInCart,
      makeFilteredProducts,
    ]
  );

  // PROVIDER PATTERN: Expose state and functions through context
  // All components wrapped by ProductsProvider can access these values via useContext()
  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export { ProductsContext, ProductsProvider };
