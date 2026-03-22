import qs from "query-string";

const URL = `${import.meta.env.VITE_API_URL}/products`;

const getProducts = async (query = {}) => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      size: query.size,
      isFeatured: query.isFeatured,
      cuisine: query.cuisine,
      category: query.category,
      kitchen: query.kitchen,
    },
  });

  const res = await fetch(url);
  return res.json();
};

export default getProducts;
