const prefix = 'cpp-paper-exams:v1:';
export const freshState = () => ({ version: 1, answers: {}, self: {}, flags: {}, submitted: false, updatedAt: null });
export function loadState(id, storage) {
  try {
    storage ??= globalThis.localStorage;
    const data = JSON.parse(storage.getItem(prefix + id));
    if (!data || data.version !== 1 || typeof data.answers !== 'object' || !data.answers || Array.isArray(data.answers)) return freshState();
    return { ...freshState(), ...data, self: data.self && typeof data.self === 'object' ? data.self : {}, flags: data.flags && typeof data.flags === 'object' ? data.flags : {}, submitted: data.submitted === true };
  } catch { return freshState(); }
}
export function saveState(id, state, storage) {
  try {
    storage ??= globalThis.localStorage;
    state.updatedAt = new Date().toISOString();
    storage.setItem(prefix + id, JSON.stringify(state));
    return true;
  } catch { return false; }
}
