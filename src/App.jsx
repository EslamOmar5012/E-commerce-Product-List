import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// If in dev mode we will use react query devTools
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ProductsPage from "./pages/ProductsPage.jsx";
import { ProductsProvider } from "./contexts/ProductsContext.jsx";

// Configure React Query client with caching options (staleTime)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  // Single page application - renders ProductsPage with necessary providers
  // QueryClientProvider manages data fetching and caching via React Query
  // ProductsProvider manages global product/cart state and search functionality
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsProvider>
        <ProductsPage />
      </ProductsProvider>
      {/* If in dev mode we will use react query devTools  */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;
