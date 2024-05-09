export const lessCursorQuery = (cursor: string | null) =>
  cursor ? { _id: { $lt: cursor } } : {};

export const greaterCursorQuery = (cursor: string | null) =>
  cursor ? { _id: { $gt: cursor } } : {};
