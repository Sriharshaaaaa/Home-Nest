const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://home-nest-e4g1.onrender.com"
    : "http://localhost:3000";

export const fetchListings = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_URL}/api/listingroute/get?${queryString}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch listings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};
