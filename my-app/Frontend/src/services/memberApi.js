
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// Fetch all active team members
export const getMembers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/members`);

    if (!response.ok) {
      throw new Error("Failed to fetch team members");
    }

    const result = await response.json();

    return result.data || [];
  } catch (error) {
    console.error("Get members error:", error);
    throw error;
  }
};

// Fetch one member using their ID
export const getMemberById = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}/api/members/${encodeURIComponent(id)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Member not found");
      }

      throw new Error("Failed to fetch member details");
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Get member error:", error);
    throw error;
  }
};
