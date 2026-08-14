import axiosInstance from "./axios";

/**
 * Toggle the favorite status of a contact.
 * Requires backend endpoint: PATCH /api/contacts/:id/favorite
 */
export const toggleFavorite = async (contactId, isFavorite) => {
  const response = await axiosInstance.patch(
    `/contacts/${contactId}/favorite`,
    { contact_favorite: isFavorite },
  );
  return response.data;
};

/**
 * Delete a contact.
 * Requires backend endpoint: DELETE /api/contacts/:id
 */
export const deleteContact = async (contactId) => {
  const response = await axiosInstance.delete(`/contacts/${contactId}`);
  return response.data;
};

/**
 * Update a contact's details.
 * Requires backend endpoint: PUT /api/contacts/:id
 */
export const updateContact = async (contactId, contactData) => {
  const response = await axiosInstance.put(`/contacts/${contactId}`, contactData);
  return response.data;
};

/**
 * Fetch a single contact by id.
 * Requires backend endpoint: GET /api/contacts/:id
 */
export const getContactById = async (contactId) => {
  const response = await axiosInstance.get(`/contacts/${contactId}`);
  return response.data;
};

/**
 * Fetch all contacts for the current user.
 * Requires backend endpoint: GET /api/contacts
 */
export const getContacts = async () => {
  const response = await axiosInstance.get("/contacts");
  return response.data;
};

/**
 * Fetch favorite contacts for the current user.
 * Requires backend endpoint: GET /api/contacts/favorites
 */
export const getFavoriteContacts = async () => {
  const response = await axiosInstance.get("/contacts/favorites");
  return response.data;
};

/**
 * Search contacts via the backend.
 * Backend-ready: when GET /api/contacts/search?query=... ships, this will
 * offload filtering to the server instead of the client-side hook.
 *
 * @param {string} query - Text to search across name/phone/email/role/relation.
 * @param {Object} filters - Optional { relation, favorite } filters.
 */
export const searchContacts = async (query, filters = {}) => {
  const params = {};
  if (query && query.trim()) params.query = query.trim();
  if (filters.relation) params.relation = filters.relation;
  if (filters.favorite) params.favorite = "true";

  const response = await axiosInstance.get("/contacts/search", { params });
  return response.data;
};
