import {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

// Create context for managing products, categories, search, and cart states
const ProductsContext = createContext();

function ProductsProvider({ children }) {
  // Store extracted categories from products list
  const [categories, setCategories] = useState(null);

  // Store products filtered by selected category
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Store current search input value
  const [search, setSearch] = useState("");

  // Store product IDs in cart as Set to avoid redundancy
  // Lazy initialized with localStorage data converted to Set
  const [cartProducts, setCartProducts] = useState(() => {
    const saved = localStorage.getItem("cartProducts");
    const ids = saved ? JSON.parse(saved) : [];
    return new Set(ids);
  });

  // Track pending localStorage update timers to debounce writes in localStorage
  const cartSaveTimeoutRef = useRef(null);

  // Track debounced search input to avoid filtering on every keystroke (reduce filtring itrations)
  //I applied debounce search even if there is no real api calling to enhance performance and reduce the number of filtring proccesses
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Calculate cart items count from Set size
  const cartProductsNumber = cartProducts.size;

  // Fetch all products from FakeStore API using React Query
  //I used React Query not useEffect to reduce number of rerenders and for code readiability
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

  // Determine products to display based on category filter
  // If filteredProducts is empty (no category selected) => show all products
  const showedProducts =
    filteredProducts.length === 0 ? products : filteredProducts;

  // Extract unique categories from products array using Set
  const handleCategories = (products) => {
    const categoriesArr = [
      ...new Set(products.map((product) => product.category)),
    ];
    setCategories(categoriesArr);
  };

  // Add product to cart with debounced localStorage persistence
  // I used useCallback to not render the function if the context rendered
  // localStorage update is debounced to batch multiple cart changes and reduce number of changes that will happen in localStorage
  const addProductToCart = useCallback((product) => {
    setCartProducts((prev) => {
      const updated = new Set(prev);
      updated.add(product.id);

      // Clear existing timeout and set new one for debounced save
      if (cartSaveTimeoutRef.current) clearTimeout(cartSaveTimeoutRef.current);

      //Create new Time out with ID to add to localStorage after 300 milliSeconds
      cartSaveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem("cartProducts", JSON.stringify([...updated]));
      }, 300);

      return updated;
    });
  }, []);

  // Remove product from cart with debounced localStorage persistence
  // I used useCallback to not render the function if the context rendered
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

  // Check if product is already in cart (for buttons state)
  const isProductInCart = useCallback(
    (productId) => {
      return cartProducts.has(productId);
    },
    [cartProducts]
  );

  // Filter products by selected category and reset search
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

  // Debounce search input to prevent filtering on every keystroke
  // Wait 300ms after user stops typing before updating debouncedSearch state
  // This reduces unnecessary re-renders and expensive filter operations
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Memoized search filtering based on debounced input
  // Only recalculates when debouncedSearch or showedProducts changes
  // Converts search to lowercase once instead of per-product
  // Only runs after user finishes typing (300ms debounce)
  const searchedProducts = useMemo(() => {
    if (debouncedSearch.length < 3) return [];

    const lowerSearch = debouncedSearch.toLowerCase();
    return showedProducts.filter(
      (element) =>
        element.title.toLowerCase().includes(lowerSearch) ||
        element.description.toLowerCase().includes(lowerSearch)
    );
  }, [debouncedSearch, showedProducts]);

  // Update search input and trigger debounce timer
  // Wrapped in useCallback for stable reference to avoid re-renders
  const updateSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const contextValue = {
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
  };

  // Provider Pattern => to make hook for using Context value
  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export { ProductsContext, ProductsProvider };
