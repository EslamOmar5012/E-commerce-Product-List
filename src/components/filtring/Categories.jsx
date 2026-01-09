import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";

import { Chip, Stack } from "@mui/material";

function Categories() {
  //Imported from productes context
  const { categories, makeFilteredProducts } = useProducts();

  //Selected tag vatiable (it will show the products with this value)
  const [selectedTag, setSelectedTag] = useState("all");

  //Function to handle filter products by tags
  const handleTagClick = (label) => {
    if (selectedTag === label) {
      setSelectedTag("all");
      label = "all";
    } else setSelectedTag(label);

    makeFilteredProducts(label);
  };

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {/* all tag (default rendered and it will show all products) */}
      <Chip
        label="all"
        variant={selectedTag === "all" ? "filled" : "outlined"}
        color="primary"
        onClick={() => handleTagClick("all")}
        clickable
        sx={{
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: 1,
            transform: "translateY(-1px)",
          },
        }}
      />
      {/* rest of categories except all category (if i click on one of them it will show the products of this category only)*/}
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          variant={selectedTag === category ? "filled" : "outlined"}
          color="primary"
          onClick={() => handleTagClick(category)}
          clickable
          sx={{
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: 1,
              transform: "translateY(-1px)",
            },
          }}
        />
      ))}
    </Stack>
  );
}

export default Categories;
