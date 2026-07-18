'use strict';
/* ================================================
   SEACET Nexus — LocalStorage Manager
   ================================================ */
const StorageManager = (() => {
  const PREFIX = 'seacet_';

  const get = (key) => {
    try {
      const data = localStorage.getItem(PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  };

  const set = (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch { return false; }
  };

  const remove = (key) => { localStorage.removeItem(PREFIX + key); };

  const clear = () => {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  };

  const has = (key) => localStorage.getItem(PREFIX + key) !== null;

  const getAll = () => {
    const data = {};
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => {
      try { data[k.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(k)); } catch { data[k.replace(PREFIX, '')] = localStorage.getItem(k); }
    });
    return data;
  };

  /* Favorites System */
  const getFavorites = (type) => get(`favorites_${type}`) || [];
  const addFavorite = (type, id) => {
    const favs = getFavorites(type);
    if (!favs.includes(id)) { favs.push(id); set(`favorites_${type}`, favs); }
  };
  const removeFavorite = (type, id) => {
    const favs = getFavorites(type).filter(f => f !== id);
    set(`favorites_${type}`, favs);
  };
  const isFavorite = (type, id) => getFavorites(type).includes(id);
  const toggleFavorite = (type, id) => {
    if (isFavorite(type, id)) { removeFavorite(type, id); return false; }
    else { addFavorite(type, id); return true; }
  };

  /* Export / Import */
  const exportData = () => {
    const data = getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'seacet_nexus_backup.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => set(key, value));
      return true;
    } catch { return false; }
  };

  const getStorageUsage = () => {
    let total = 0;
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => {
      total += (localStorage.getItem(k) || '').length;
    });
    return { bytes: total * 2, kb: ((total * 2) / 1024).toFixed(2), keys: Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).length };
  };

  return { get, set, remove, clear, has, getAll, getFavorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, exportData, importData, getStorageUsage };
})();
