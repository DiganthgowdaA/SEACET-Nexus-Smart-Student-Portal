'use strict';
/* ================================================
   SEACET Nexus — Academic Planner
   ================================================ */
const Planner = (() => {
  const STORAGE_KEY = 'planner_tasks';
  const TYPES = ['Assignment', 'Exam', 'Lab', 'Project', 'Deadline'];
  const TYPE_COLORS = { Assignment: '#1a73e8', Exam: '#ea4335', Lab: '#34a853', Project: '#8b5cf6', Deadline: '#f97316' };

  const getTasks = () => StorageManager.get(STORAGE_KEY) || [];
  const saveTasks = (tasks) => StorageManager.set(STORAGE_KEY, tasks);

  const addTask = (task) => {
    const tasks = getTasks();
    task.id = Date.now().toString();
    task.completed = false;
    task.createdAt = new Date().toISOString();
    tasks.push(task);
    saveTasks(tasks);
    return task;
  };

  const updateTask = (id, updates) => {
    const tasks = getTasks().map(t => t.id === id ? { ...t, ...updates } : t);
    saveTasks(tasks);
  };

  const deleteTask = (id) => {
    const tasks = getTasks().filter(t => t.id !== id);
    saveTasks(tasks);
  };

  const toggleComplete = (id) => {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) { task.completed = !task.completed; saveTasks(tasks); }
    return task ? task.completed : false;
  };

  const getCountdown = (deadline) => {
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { text: 'Overdue', overdue: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return { text: `${days}d ${hours}h remaining`, overdue: false };
    if (hours > 0) return { text: `${hours}h ${mins}m remaining`, overdue: false };
    return { text: `${mins}m remaining`, overdue: false };
  };

  const getStats = () => {
    const tasks = getTasks();
    const now = new Date();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      active: tasks.filter(t => !t.completed && new Date(t.deadline) > now).length,
      overdue: tasks.filter(t => !t.completed && new Date(t.deadline) <= now).length
    };
  };

  const renderTask = (task) => {
    const cd = getCountdown(task.deadline);
    const typeColor = TYPE_COLORS[task.type] || '#1a73e8';
    return `
      <div class="task-item ${task.completed ? 'completed' : ''} ${cd.overdue && !task.completed ? 'overdue' : ''}" data-id="${task.id}" data-type="${task.type}">
        <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="Planner.handleToggle('${task.id}')">
          ${task.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
        <div class="task-content">
          <div class="task-title">${task.title}</div>
          ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
          <div class="task-meta">
            <span class="badge" style="background:${typeColor}15;color:${typeColor}">${task.type}</span>
            ${task.subject ? `<span class="badge badge-info">${task.subject}</span>` : ''}
            <span class="task-countdown ${cd.overdue ? 'urgent' : ''}">${task.completed ? '✓ Completed' : cd.text}</span>
          </div>
        </div>
        <div class="task-actions">
          <button class="btn-icon" onclick="Planner.handleEdit('${task.id}')" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" onclick="Planner.handleDelete('${task.id}')" title="Delete" style="color:var(--error)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  };

  const render = (filter = 'all', status = 'all') => {
    const container = document.getElementById('taskList');
    if (!container) return;
    let tasks = getTasks();

    if (filter !== 'all') tasks = tasks.filter(t => t.type === filter);
    if (status === 'completed') tasks = tasks.filter(t => t.completed);
    else if (status === 'active') tasks = tasks.filter(t => !t.completed && new Date(t.deadline) > new Date());
    else if (status === 'overdue') tasks = tasks.filter(t => !t.completed && new Date(t.deadline) <= new Date());

    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (tasks.length === 0) {
      container.innerHTML = `<div class="empty-state"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><h3>No tasks found</h3><p>Click "Add Task" to get started with your academic planner!</p></div>`;
    } else {
      container.innerHTML = tasks.map(renderTask).join('');
    }
    updateStats();
  };

  const updateStats = () => {
    const stats = getStats();
    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('statTotal', stats.total);
    el('statCompleted', stats.completed);
    el('statActive', stats.active);
    el('statOverdue', stats.overdue);
  };

  /* Handlers */
  const handleToggle = (id) => {
    const completed = toggleComplete(id);
    render(currentFilter, currentStatus);
    if (completed && typeof AnimationUtils !== 'undefined') AnimationUtils.confetti(40);
    NotificationManager.showToast(completed ? 'Task completed! 🎉' : 'Task reopened', completed ? 'success' : 'info');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this task?')) {
      deleteTask(id);
      render(currentFilter, currentStatus);
      NotificationManager.showToast('Task deleted', 'error');
    }
  };

  const handleEdit = (id) => {
    const task = getTasks().find(t => t.id === id);
    if (!task) return;
    editingId = id;
    const form = document.getElementById('taskForm');
    if (!form) return;
    form.querySelector('#taskTitle').value = task.title;
    form.querySelector('#taskType').value = task.type;
    form.querySelector('#taskSubject').value = task.subject || '';
    form.querySelector('#taskDesc').value = task.description || '';
    form.querySelector('#taskDeadline').value = task.deadline ? task.deadline.slice(0, 16) : '';
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskModal').classList.add('active');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.querySelector('#taskTitle').value.trim(),
      type: form.querySelector('#taskType').value,
      subject: form.querySelector('#taskSubject').value.trim(),
      description: form.querySelector('#taskDesc').value.trim(),
      deadline: form.querySelector('#taskDeadline').value,
    };
    if (!data.title || !data.deadline) { NotificationManager.showToast('Please fill in title and deadline', 'warning'); return; }

    if (typeof RoboCompanion !== 'undefined') RoboCompanion.show('Saving task...', 'Nexus is organizing your planner');

    if (editingId) {
      updateTask(editingId, data);
      NotificationManager.showToast('Task updated!', 'success');
      editingId = null;
    } else {
      addTask(data);
      NotificationManager.showToast('Task added!', 'success');
    }
    form.reset();
    document.getElementById('taskModal').classList.remove('active');
    document.getElementById('taskModalTitle').textContent = 'Add Task';
    render(currentFilter, currentStatus);
    if (typeof RoboCompanion !== 'undefined') RoboCompanion.hide(200);
  };

  let currentFilter = 'all';
  let currentStatus = 'all';
  let editingId = null;

  const init = () => {
    const form = document.getElementById('taskForm');
    if (form) form.addEventListener('submit', handleSubmit);

    document.querySelectorAll('[data-task-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-task-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.taskFilter;
        render(currentFilter, currentStatus);
      });
    });

    document.querySelectorAll('[data-task-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-task-status]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStatus = btn.dataset.taskStatus;
        render(currentFilter, currentStatus);
      });
    });

    render();
    setInterval(() => render(currentFilter, currentStatus), 60000);
  };

  return { init, render, handleToggle, handleDelete, handleEdit, getTasks, getStats, addTask };
})();
