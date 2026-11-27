const SAVE_KEY = 'academy_secrets_save_v1';

function safeStorage() {
  try {
    const t = '__probe__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

const SaveSystem = {
  _mem: null,

  save(state) {
    try {
      const data = JSON.stringify({ v: 1, ts: Date.now(), state });
      const ls = safeStorage();
      if (ls) ls.setItem(SAVE_KEY, data);
      else this._mem = data;
      return true;
    } catch (e) {
      console.warn('save failed', e);
      return false;
    }
  },

  load() {
    try {
      const ls = safeStorage();
      const raw = ls ? ls.getItem(SAVE_KEY) : this._mem;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 1 || !parsed.state) return null;
      const s = parsed.state;
      if (typeof s.level !== 'number' || !Array.isArray(s.elements)) return null;
      return s;
    } catch (e) {
      console.warn('load failed', e);
      return null;
    }
  },

  hasSave() {
    try {
      const ls = safeStorage();
      return !!(ls ? ls.getItem(SAVE_KEY) : this._mem);
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      const ls = safeStorage();
      if (ls) ls.removeItem(SAVE_KEY);
      this._mem = null;
    } catch (e) {}
  }
};