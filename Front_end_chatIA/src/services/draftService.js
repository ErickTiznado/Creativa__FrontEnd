const DRAFT_TTL_MS = 604800000; // 7 days in milliseconds

/**
 * Saves a draft (creates new or updates existing).
 * Implements "Upsert" logic: if ID exists, update; else create.
 *
 * @param {string} id - Draft UUID
 * @param {string} preview - Preview text (usually last user message)
 * @param {object} data - Brief data from backend
 * @param {Array} messages - Full chat history
 */
const saveDraft = (id, preview, data, messages = []) => {
  const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
  const now = Date.now();

  const existingIndex = drafts.findIndex((d) => d.id === id);

  const draftObject = {
    id,
    preview,
    data,
    messages,
    lastActive: now,
    createdAt: existingIndex !== -1 ? drafts[existingIndex].createdAt : now,
  };

  let newDrafts;
  if (existingIndex !== -1) {
    // Remove old version
    newDrafts = drafts.filter((d) => d.id !== id);
  } else {
    newDrafts = drafts;
  }

  // Add updated/new draft to top
  newDrafts.unshift(draftObject);
  localStorage.setItem("drafts", JSON.stringify(newDrafts));
};

const getDrafts = () => {
  const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
  const validDrafts = drafts.filter((draft) => {
    return Date.now() - draft.lastActive < DRAFT_TTL_MS;
  });

  // Update storage if we filtered out expired drafts
  if (validDrafts.length !== drafts.length) {
    localStorage.setItem("drafts", JSON.stringify(validDrafts));
  }

  return validDrafts;
};

const deleteDraft = (id) => {
  const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
  const newDrafts = drafts.filter((draft) => draft.id !== id);
  localStorage.setItem("drafts", JSON.stringify(newDrafts));
  console.log("Draft deleted:", id);
};

export { saveDraft, getDrafts, deleteDraft };
