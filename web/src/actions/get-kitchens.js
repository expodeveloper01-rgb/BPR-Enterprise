const URL = `${import.meta.env.VITE_API_URL}/kitchens`;

const getKitchens = async () => {
  const res = await fetch(URL);
  return res.json();
};

export default getKitchens;
