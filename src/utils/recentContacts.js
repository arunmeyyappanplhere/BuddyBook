/**
 * Shared definition of what counts as a "recent" contact.
 *
 * Used by BOTH:
 *   - src/pages/Home.jsx        (Recent Contacts section)
 *   - src/pages/RecentContacts.jsx (/recent page)
 *
 * Keep this file as the single source of truth so both views can
 * never drift apart.
 */

/** A contact is "recent" if it was saved within the last 14 days. */
export const RECENT_CONTACTS_DAYS = 14;

/**
 * Returns true if the contact was created within the last
 * RECENT_CONTACTS_DAYS days.
 */
export const isRecentContact = (contact) => {
  if (!contact?.createdAt) return false;
  const createdAt = new Date(contact.createdAt);
  if (Number.isNaN(createdAt.getTime())) return false;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RECENT_CONTACTS_DAYS);

  return createdAt >= cutoff;
};

/**
 * Filters an array of contacts down to those saved within the last
 * RECENT_CONTACTS_DAYS days.
 */
export const filterRecentContacts = (contacts) => {
  if (!Array.isArray(contacts)) return [];
  return contacts.filter(isRecentContact);
};
