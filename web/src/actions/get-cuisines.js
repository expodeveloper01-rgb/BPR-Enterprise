const URL = `${import.meta.env.VITE_API_URL}/cuisines`;

const getCuisines = async () => {
  const res = await fetch(URL);
  return res.json();
};

export default getCuisines;
