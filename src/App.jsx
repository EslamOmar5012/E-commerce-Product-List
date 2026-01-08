//3rd party libs imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//components imports
import ProductsPage from "./pages/ProductsPage.jsx";
import { ProductsProvider } from "./contexts/ProductsContext.jsx";

// Configure React Query client with caching options
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
