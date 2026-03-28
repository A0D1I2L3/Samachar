import { PARAMS, WIN_CONDITIONS, COLLAPSE_ENDINGS } from "./constants.js";

// Returns array of collapsed param keys
export function checkCollapses(scores) {
  return Object.entries(PARAMS)
    .filter(([key, p]) => scores[key] <= p.collapseAt)
    .map(([key]) => key);
}

// Returns the collapse ending key ("CASCADE" or a param key)
export function resolveCollapseEnding(collapseKeys) {
  if (collapseKeys.length >= 2) return "CASCADE";
  return collapseKeys[0] || null;
}

// Returns first matching win condition, or null
export function checkWin(scores, dayNumber) {
  if (dayNumber < 5) return null;
  return WIN_CONDITIONS.find((w) => w.check(scores)) || null;
}
