import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";

//hook to use products context to avoid using ProductsContext every time with useContext
export const useProducts = () => {
  const context = useContext(ProductsContext);
  // if there is not context it will throw the error
  if (!context)
    throw new Error("can't use ProductsContext outside its boundry");
  return context;
};
