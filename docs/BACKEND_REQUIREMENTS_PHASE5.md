# Phase 5 — Backend Requirements for Dashboard Features

This document catalogues every Dashboard feature that requires a database,
controller, model, or API endpoint. It was produced during Phase 4 while
connecting the existing Dashboard frontend to real backend APIs.

---

## 1. New Endpoints Required

### 1.1 Get All Contacts

- **Endpoint:** `GET /api/contacts`
- **Auth:** Bearer JWT (via `Authorization` header)
- **Response:** `200` → array of contact objects belonging to the logged-in user
- **Behavior:**
  - Verify JWT and extract `email`
  - Query `contacts` collection where `savedUser === email`
  - Return only the contacts, not the profile wrapper
- **Frontend consumer:** `client/src/api/contacts.js` → `getContacts()`

### 1.2 Get Favorite Contacts

- **Endpoint:** `GET /api/contacts/favorites`
- **Auth:** Bearer JWT
- **Response:** `200` → array of contacts where `contact_favorite === true`
- **Behavior:**
  - Same auth as 1.1, filtered by `contact_favorite: true`
- **Frontend consumer:** `client/src/api/contacts.js` → `getFavoriteContacts()`

### 1.3 Get Single Contact

- **Endpoint:** `GET /api/contacts/:id`
- **Auth:** Bearer JWT
- **Params:** `id` = `contact_uid` or Mongo `_id`
- **Response:**
  - `200` → contact object
  - `404` → `{ message: "Contact not found" }`
- **Behavior:**
  - Verify the contact belongs to the authenticated user
  - Match by `contact_uid` OR `_id`
- **Frontend consumer:** `client/src/api/contacts.js` → `getContactById()` (used for ContactProfile deep-linking)

### 1.4 Toggle Contact Favorite

- **Endpoint:** `PATCH /api/contacts/:id/favorite`
- **Auth:** Bearer JWT
- **Body:** `{ contact_favorite: boolean }`
- **Response:**
  - `200` → updated contact
  - `404` → `{ message: "Contact not found" }`
- **Behavior:**
  - Update `contact_favorite` on the contact document
  - Update the embedded contact inside the user's `profiles.contacts` array so the `/home` payload stays in sync
- **Frontend consumer:** `client/src/api/contacts.js` → `toggleFavorite()` — used by `ContactCard.jsx` heart button

### 1.5 Delete Contact

- **Endpoint:** `DELETE /api/contacts/:id`
- **Auth:** Bearer JWT
- **Response:**
  - `200` → `{ message: "Contact deleted" }`
  - `404` → `{ message: "Contact not found" }`
- **Behavior:**
  - Delete the contact document from `contacts` collection
  - Remove the matching embedded contact from `profiles.contacts` array
- **Frontend consumer:** `client/src/api/contacts.js` → `deleteContact()` — used by `ContactCard.jsx` trash icon

### 1.6 Update Contact

- **Endpoint:** `PUT /api/contacts/:id`
- **Auth:** Bearer JWT
- **Body:** Any subset of:
  - `contact_name`
  - `contact_role`
  - `contact_relation`
  - `contact_email`
  - `contact_phone`
  - `contact_dob`
  - `contact_address`
  - `profileImage`
- **Response:**
  - `200` → updated contact
  - `400` → validation error message
  - `404` → `{ message: "Contact not found" }`
- **Behavior:**
  - Update both the `contacts` document and the embedded copy in `profiles.contacts`
  - Validate unique `contact_email` per user (same rule as `add-contact`)
- **Frontend consumer:** `client/src/api/contacts.js` → `updateContact()` — used by `ContactProfile.jsx` edit/save flow (currently only shows a success toast pending this endpoint)

---

## 2. Data Consistency Requirements

The current `addContactController` writes the contact **twice**:

1. A full document in the `contacts` collection
2. A copy embedded in `profiles.contacts`

Every new mutation endpoint (update, delete, toggle-favorite) **must** keep both
copies in sync. Recommended approach: write a small helper (e.g.
`syncContactToProfile(email, contactDoc)`) to reduce drift.

---

## 3. Search Optimisation (Optional but Recommended)

The Dashboard search currently filters contacts **client-side** from the embedded
`profiles.contacts` array. For large address books this is inefficient. Optional
backend endpoint:

- **Endpoint:** `GET /api/contacts/search?query=...`
- **Auth:** Bearer JWT
- **Behavior:** regex match on `contact_name` and `contact_phone`, limited to
  the authenticated user's contacts
- **Response:** `200` → filtered contact array
- **Frontend consumer:** would replace the client-side filter in
  `Home.jsx`, `Contacts.jsx`, and `Favorites.jsx`

---

## 4. Model Adjustments

### 4.1 `profileModal.js` (currently `server/models/profileModal.js`)

- The `contacts` field is currently a loose `Array`. Recommended to type it as
  `[contactSchema]` so Mongoose validates embedded contacts and supports
  find/update on nested fields:
  ```js
  contacts: {
    type: [contactModal.schema],
    required: false,
    default: [],
  }
  ```
- Note: `registerController` initialises `contact: []` and `favorites: []` on
  the profile, but the schema only defines `contacts`. This is a bug — the
  profile ends up with no `contacts` field until the first add-contact.
  Fix the schema to include a `contacts` field (or update the controller).

### 4.2 `contactModal.js` (currently `server/models/contactModal.js`)

- `contact_favorite` already exists with `default: false`. No change needed.
- `contact_uid` is generated client-side via `crypto.randomUUID()` — consider
  making it server-generated for consistency.

---

## 5. Auth-Protected Controller Pattern (for all new endpoints)

Every new controller should follow the existing pattern from
`addContactController.js`:

```js
const token = req.headers.authorization;
if (!token) {
  res.status(401).json({ message: "Session is not Authorized" });
  return;
}
const authToken = token.toString().split(" ")[1];
const decodedEmail = await verifyToken(authToken).email;
```

Return `401` when the token is missing/invalid. Return `404` when the contact
belongs to a different user (do not leak the existence of another user's data).

---

## 6. Recommended Route Registration

Add the following to `server/routes/route.js`:

```js
routes.get("/contacts", getContactsController);
routes.get("/contacts/favorites", getFavoriteContactsController);
routes.get("/contacts/:id", getContactController);
routes.patch("/contacts/:id/favorite", toggleFavoriteController);
routes.delete("/contacts/:id", deleteContactController);
routes.put("/contacts/:id", updateContactController);
```

> **Order matters:** `/contacts/favorites` must be registered **before**
> `/contacts/:id` so Express doesn't capture `favorites` as the `:id` param.

---

## 7. Frontend Integration Map

| Frontend feature | File(s) | Backend endpoint needed |
|---|---|---|
| Search bar (all pages) | `Home.jsx`, `Contacts.jsx`, `Favorites.jsx` | `GET /api/contacts/search?query=` (optional) |
| Favorite heart toggle | `ContactCard.jsx` | `PATCH /api/contacts/:id/favorite` |
| Delete contact | `ContactCard.jsx` | `DELETE /api/contacts/:id` |
| Edit contact | `ContactProfile.jsx` | `PUT /api/contacts/:id` |
| Contact profile deep-link | `ContactProfile.jsx` | `GET /api/contacts/:id` |
| Favourites page | `Favorites.jsx` | `GET /api/contacts/favorites` |
| Contacts page refresh | `Contacts.jsx` | `GET /api/contacts` |
| Post-mutation sync | `AuthContext.jsx` → `refreshUser()` | `GET /api/home` (existing) |