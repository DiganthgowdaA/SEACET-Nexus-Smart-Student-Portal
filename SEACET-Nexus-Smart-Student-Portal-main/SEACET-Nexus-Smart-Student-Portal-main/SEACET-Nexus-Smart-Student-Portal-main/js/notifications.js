'use strict';
/* ================================================
   SEACET Nexus — Notification System
   ================================================ */
const NotificationManager = (() => {
  const STORAGE_KEY = 'notifications';
  const container = () => document.getElementById('toastContainer');

  /* Toast Notifications */
  const showToast = (message, type = 'info', duration = 3000) => {
    const c = container();
    if (!c) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `
      <span style="font-weight:700;font-size:16px;min-width:20px;text-align:center">${icons[type] || 'ℹ'}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
    `;
    c.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, duration);
  };

  /* Notification Center */
  const getNotifications = () => StorageManager.get(STORAGE_KEY) || [];

  const addNotification = (title, message, type = 'info') => {
    const notifs = getNotifications();
    notifs.unshift({ id: Date.now(), title, message, type, time: new Date().toISOString(), read: false });
    if (notifs.length > 50) notifs.pop();
    StorageManager.set(STORAGE_KEY, notifs);
    updateBadge();
  };

  const markAsRead = (id) => {
    const notifs = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    StorageManager.set(STORAGE_KEY, notifs);
    updateBadge();
  };

  const dismissNotification = (id) => {
    const notifs = getNotifications().filter(n => n.id !== id);
    StorageManager.set(STORAGE_KEY, notifs);
    updateBadge();
  };

  const clearAll = () => {
    StorageManager.set(STORAGE_KEY, []);
    updateBadge();
  };

  const getUnreadCount = () => getNotifications().filter(n => !n.read).length;

  const updateBadge = () => {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;
    const count = getUnreadCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  };

  const init = () => { updateBadge(); };

  return { showToast, addNotification, markAsRead, dismissNotification, clearAll, getNotifications, getUnreadCount, updateBadge, init };
})();
