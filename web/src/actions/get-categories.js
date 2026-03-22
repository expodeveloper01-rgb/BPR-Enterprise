const URL = `${import.meta.env.VITE_API_URL}/categories`;

const getCategories = async () => {
  const res = await fetch(URL);
  return res.json();
};

export default getCategories;
