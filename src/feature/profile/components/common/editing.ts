/**
 * Which card is in edit mode. Only one card edits at a time, so at most one primary
 * ("Save changes") button is ever visible.
 */
export interface EditingState {
  /** Key of the card being edited, or null. */
  editing: string | null;
  start: (key: string) => void;
  stop: () => void;
}

/** The card's "Edit" handler, or undefined while another card is being edited. */
export function editHandler(state: EditingState, key: string) {
  return state.editing === null ? () => state.start(key) : undefined;
}
