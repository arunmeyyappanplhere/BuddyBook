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
 * Toggle the stashed status of a contact.
 */
export const toggleStash = async (contactId, isStashed) => {
  const response = await axiosInstance.patch(
    `/contacts/${contactId}/stash`,
    { contact_stashed: isStashed },
  );
  return response.data;
};

/**
 * Stash or un-stash all contacts at once.
 */
export const stashAllContacts = async (isStashed) => {
  const response = await axiosInstance.patch(`/contacts/stash-all`, {
    contact_stashed: isStashed,
  });
  return response.data;
};

/**
 * Unstash selected contacts by their IDs.
 */
export const unstashContacts = async (contactIds) => {
  const response = await axiosInstance.patch(`/contacts/unstash`, {
    contact_ids: contactIds,
  });
  return response.data;
};

/**
 * Fetch stashed contacts for the current user.
 */
export const getStashedContacts = async () => {
  const response = await axiosInstance.get("/contacts/stashed");
  return response.data;
};

/**
 * Fetch recent contacts for the current user.
 */
export const getRecentContacts = async () => {
  const response = await axiosInstance.get("/contacts/recent");
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
 */
export const getContactById = async (contactId) => {
  const response = await axiosInstance.get(`/contacts/${contactId}`);
  return response.data;
};

/**
 * Fetch all contacts for the current user.
 */
export const getContacts = async () => {
  const response = await axiosInstance.get("/contacts");
  return response.data;
};

/**
 * Fetch favorite contacts for the current user.
 */
export const getFavoriteContacts = async () => {
  const response = await axiosInstance.get("/contacts/favorites");
  return response.data;
};

/**
 * Search contacts via the backend.
 */
export const searchContacts = async (query, filters = {}) => {
  const params = {};
  if (query && query.trim()) params.query = query.trim();
  if (filters.relation) params.relation = filters.relation;
  if (filters.favorite) params.favorite = "true";

  const response = await axiosInstance.get("/contacts/search", { params });
  return response.data;
};

/**
 * Update the authenticated user's profile.
 */
export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put("/settings/profile", profileData);
  return response.data;
};

/**
 * Delete the authenticated user's account permanently.
 */
export const deleteAccount = async () => {
  const response = await axiosInstance.delete("/auth/delete-account");
  return response.data;
};