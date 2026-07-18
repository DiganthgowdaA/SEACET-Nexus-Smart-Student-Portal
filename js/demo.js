'use strict';
/* ================================================
   SEACET Nexus — Demo Data Seeder
   Populates localStorage for a functional demo
   ================================================ */
const DemoData = (() => {
  const SEEDED_KEY = 'demo_seeded_v2';

  const daysFromNow = (days, hours = 12) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hours, 0, 0, 0);
    return d.toISOString();
  };

  const seedPlanner = () => {
    if (StorageManager.get('planner_tasks')?.length) return;
    const tasks = [
      { id: 'demo1', title: 'Data Structures Lab Report', type: 'Lab', subject: 'DSA', description: 'Implement BST operations and submit report', deadline: daysFromNow(2), completed: false, createdAt: new Date().toISOString() },
      { id: 'demo2', title: 'DBMS Assignment — Normalization', type: 'Assignment', subject: 'DBMS', description: '3NF and BCNF examples with ER diagram', deadline: daysFromNow(5), completed: false, createdAt: new Date().toISOString() },
      { id: 'demo3', title: 'Internal Assessment — OS', type: 'Exam', subject: 'Operating Systems', description: 'Chapters 1-4: Processes, Threads, Scheduling', deadline: daysFromNow(10), completed: false, createdAt: new Date().toISOString() },
      { id: 'demo4', title: 'Mini Project — SEACET Nexus', type: 'Project', subject: 'Web Tech', description: 'Student portal with glassmorphism UI', deadline: daysFromNow(-1), completed: false, createdAt: new Date().toISOString() },
      { id: 'demo5', title: 'Infosys Registration Deadline', type: 'Deadline', subject: 'Placements', description: 'Upload resume and academic docs', deadline: daysFromNow(7), completed: false, createdAt: new Date().toISOString() },
    ];
    StorageManager.set('planner_tasks', tasks);
  };

  const seedInternships = () => {
    if (StorageManager.get('internships')?.length) return;
    StorageManager.set('internships', [
      { id: 'i1', company: 'Amazon', role: 'SDE Intern', status: 'Interview', date: '2026-07-10', notes: 'OA cleared, technical round on Monday' },
      { id: 'i2', company: 'Razorpay', role: 'Backend Intern', status: 'Applied', date: '2026-07-05', notes: 'Applied via campus portal' },
      { id: 'i3', company: 'Google', role: 'STEP Intern', status: 'Wishlist', date: '', notes: 'Target for next semester' },
    ]);
  };

  const seedProfile = () => {
    if (StorageManager.has('profile')) return;
    StorageManager.set('profile', {
      name: 'Arjun Mehta',
      email: 'arjun.mehta@student.seacet.edu.in',
      phone: '+91 98765 43210',
      dept: 'CSE',
      sem: '5',
      cgpa: '8.6',
      usn: '1SE23CS042',
      skills: ['JavaScript', 'Python', 'React', 'SQL', 'Git'],
      certs: ['AWS Cloud Practitioner', 'Google IT Support'],
    });
  };

  const seedFavorites = () => {
    if (!StorageManager.get('favorites_company')?.length) {
      StorageManager.set('favorites_company', ['infosys', 'microsoft']);
    }
    if (!StorageManager.get('favorites_note')?.length) {
      StorageManager.set('favorites_note', ['dsa', 'dbms']);
    }
  };

  const seedJoinedClubs = () => {
    if (!StorageManager.get('joined_clubs')?.length) {
      StorageManager.set('joined_clubs', ['ieee', 'coding-club']);
    }
  };

  const init = () => {
    if (typeof StorageManager === 'undefined') return;
    if (StorageManager.get(SEEDED_KEY)) return;

    seedPlanner();
    seedInternships();
    seedProfile();
    seedFavorites();
    seedJoinedClubs();
    StorageManager.set(SEEDED_KEY, true);

    if (typeof NotificationManager !== 'undefined') {
      setTimeout(() => {
        NotificationManager.showToast('Welcome! Demo data loaded — explore the portal 🎓', 'info');
      }, 1500);
    }
  };

  const reset = () => {
    StorageManager.remove(SEEDED_KEY);
    StorageManager.remove('planner_tasks');
    StorageManager.remove('internships');
    StorageManager.remove('profile');
    StorageManager.remove('favorites_company');
    StorageManager.remove('favorites_note');
    StorageManager.remove('joined_clubs');
    init();
  };

  return { init, reset };
})();
