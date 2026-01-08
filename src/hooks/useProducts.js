import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";

//hook to use products context
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context)
    throw new Error("can't use ProductsContext outside its boundry");
  return context;
};
