import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";

import { Chip, Stack } from "@mui/material";

function Categories() {
  const { categories, makeFilteredProducts } = useProducts();

  //state to select tag
  const [selectedTag, setSelectedTag] = useState("all");

  const handleTagClick = (label) => {
    if (selectedTag === label) {
      setSelectedTag("all");
      label = "all";
    } else setSelectedTag(label);

    makeFilteredProducts(label);
  };

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Chip
        label="all"
        variant={selectedTag === "all" ? "filled" : "outlined"}
        color="primary"
        onClick={() => handleTagClick("all")}
        clickable
        sx={{
          transition: "all 0.3s ease-in-out",
          // Subtle hover effect
          "&:hover": {
            boxShadow: 1,
            transform: "translateY(-1px)",
          },
        }}
      />
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
            // Subtle hover effect
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
