const SAVE_KEY = 'academy_secrets_save_v1';

const SaveSystem = {
  save(state) {
    try {
      const data = JSON.stringify({ v: 1, ts: Date.now(), state });
      localStorage.setItem(SAVE_KEY, data);
      return true;
    } catch (e) { console.error('save failed', e); return false; }
  },
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 1 || !parsed.state) return null;
      const s = parsed.state;
      if (typeof s.level !== 'number' || !s.elements) return null;
      return s;
    } catch (e) { console.error('load failed', e); return null; }
  },
  hasSave() { return !!localStorage.getItem(SAVE_KEY); },
  clear() { localStorage.removeItem(SAVE_KEY); }
};