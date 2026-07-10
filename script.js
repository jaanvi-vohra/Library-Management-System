/* Lumina Archives  */

/* ---------- Storage helpers ---------- */
const KEYS = {
  users:    'lib.users',
  session:  'lib.session',
  books:    'lib.books',
  records:  'lib.records',
  settings: 'lib.settings',
  notifications: 'lib.notifs',
  theme:    'lib.theme'
};
const load = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* ---------- Password hashing ---------- */
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- Icons ---------- */
const ICON_PATHS = {
  home: `<path d="M4 11.5 12 4l8 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  books: `<path d="M4 5.5C4 4.7 4.7 4 5.5 4H9a2 2 0 0 1 2 2v14a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 1 4 17V5.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H15a2 2 0 0 0-2 2v14a1.5 1.5 0 0 1 1.5-1.5h3.5A1.5 1.5 0 0 0 20 17V5.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  bookmark: `<path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-4-6 4V3.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  history: `<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.6V12l3 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  users: `<circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 20c.4-3.3 2.7-5.5 5.5-5.5s5.1 2.2 5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.3" cy="9" r="2.1" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M15.6 14.8c1.9.5 3.3 2.2 3.6 4.7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  settings: `<circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3v2.6M12 18.4V21M21 12h-2.6M5.6 12H3M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8M18.6 18.6l-1.8-1.8M7.2 7.2 5.4 5.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  search: `<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="15.3" y1="15.3" x2="20" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  plus: `<line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>`,
  edit: `<path d="M14 4.5 19.5 10 8 21.5H2.5V16L14 4.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  trash: `<path d="M4 7h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 7l1 13a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9l1-13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  check: `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 12.5l2.5 2.5L16 9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  alert: `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><line x1="12" y1="7.5" x2="12" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.3" r="1" fill="currentColor" stroke="none"/>`,
  info: `<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4 3.5V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  logout: `<path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 16l4-4-4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><line x1="19" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`,
  coin: `<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.3 9.6c0-1.1 1.1-1.9 2.7-1.9s2.7.8 2.7 1.7-1.1 1.5-2.7 1.9-2.7.9-2.7 1.9 1.2 1.8 2.7 1.8 2.7-.8 2.7-1.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  download: `<path d="M12 4v11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8 11l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 19h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`,
  star: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="none"/>`
};
function icon(name, opts = {}) {
  const size = opts.size || 18;
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}"${cls} aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}

const CATEGORY_PALETTE = ['var(--oxblood)', 'var(--sage)', 'var(--slateblue)', 'var(--brass)', 'var(--wine)', 'var(--ink-2)'];
function categoryColor(category) {
  let h = 0; for (let i = 0; i < category.length; i++) h = (h * 31 + category.charCodeAt(i)) >>> 0;
  return CATEGORY_PALETTE[h % CATEGORY_PALETTE.length];
}

/* ---------- Initial Seeding ---------- */
async function seed() {
  if (!load(KEYS.settings)) save(KEYS.settings, { loanDays: 14, finePerDay: 5, currency: '₹' });
  let users = load(KEYS.users, []);
  
  if (!users.some(u => u.email === 'admin@lumina.local')) {
    const salt = uid();
    users.push({
      id: uid(), name: 'Lumina Admin', email: 'admin@lumina.local',
      salt, passwordHash: await hashPassword('admin123', salt), role: 'admin', isSuspended: false, createdAt: Date.now(),
    });
    save(KEYS.users, users);
  }
  
  if (!load(KEYS.books)) {
    const now = Date.now();
    save(KEYS.books, [
      { id: uid(), title: 'The Night Circus', author: 'Erin Morgenstern', category: 'Fiction', totalCopies: 3, availableCopies: 3, holds: [], reviews: [], createdAt: now },
      { id: uid(), title: 'Atomic Habits', author: 'James Clear', category: 'Self-help', totalCopies: 5, availableCopies: 5, holds: [], reviews: [], createdAt: now },
      { id: uid(), title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', totalCopies: 2, availableCopies: 2, holds: [], reviews: [], createdAt: now },
    ]);
  }
  if (!load(KEYS.records)) save(KEYS.records, []);
  if (!load(KEYS.notifications)) save(KEYS.notifications, []);
}

/* ---------- Auth & Data Helpers ---------- */
function currentUser() {
  const s = load(KEYS.session);
  return s ? load(KEYS.users, []).find(u => u.id === s.userId) || null : null;
}
function roleLabel(user) {
  if (user.isSuspended) return 'Suspended';
  return user.role === 'admin' ? 'Admin' : 'Patron';
}

const getBooks = () => load(KEYS.books, []);
function saveBook(book) {
  const books = getBooks();
  const i = books.findIndex(b => b.id === book.id);
  if (i >= 0) books[i] = book; else books.push(book);
  save(KEYS.books, books);
}
function deleteBook(id) { save(KEYS.books, getBooks().filter(b => b.id !== id)); }

function categoryBreakdown(books) {
  const map = new Map();
  books.forEach(b => map.set(b.category, (map.get(b.category) || 0) + b.totalCopies));
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

const getRecords = () => load(KEYS.records, []);
const settings = () => load(KEYS.settings, { loanDays: 14, finePerDay: 5, currency: '₹' });
const fmtDate = (t) => t ? new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
const daysBetween = (a, b) => Math.floor((a - b) / 86400000);

/* ---------- Circulation Logic ---------- */
function borrowBook(book, user) {
  if (user.isSuspended) throw new Error('Your account is suspended. Please see an admin.');
  if (book.availableCopies <= 0) throw new Error('No copies available right now.');
  
  const now = Date.now();
  const s = settings();
  const rec = {
    id: uid(), userId: user.id, userName: user.name, bookId: book.id, bookTitle: book.title,
    borrowDate: now, dueDate: now + (s.loanDays * 86400000), returnDate: null, fine: 0, status: 'borrowed',
  };
  book.availableCopies -= 1; saveBook(book);
  const recs = getRecords(); recs.push(rec); save(KEYS.records, recs);
  return rec;
}

function returnBook(recordId) {
  const recs = getRecords();
  const rec = recs.find(r => r.id === recordId);
  if (!rec || rec.returnDate) throw new Error('Record already closed.');
  
  const now = Date.now();
  const lateDays = Math.max(0, daysBetween(now, rec.dueDate));
  rec.returnDate = now;
  rec.fine = lateDays * settings().finePerDay;
  rec.status = 'returned';
  save(KEYS.records, recs);
  
  const book = getBooks().find(b => b.id === rec.bookId);
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    
    // Process holds if available
    if (book.holds && book.holds.length > 0 && book.availableCopies > 0) {
      const nextUserId = book.holds.shift();
      const notifs = load(KEYS.notifications, []);
      notifs.push({ userId: nextUserId, message: `Your hold on "${book.title}" is ready to borrow!`, date: Date.now() });
      save(KEYS.notifications, notifs);
    }
    saveBook(book);
  }
  return { rec, lateDays };
}
function statusOf(rec) { return rec.returnDate ? 'returned' : (Date.now() > rec.dueDate ? 'overdue' : 'borrowed'); }

/* ---------- Rendering Core ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
let currentView = 'dashboard';

function render() {
  const user = currentUser();
  const auth = $('#auth-screen');
  const app = $('#app');
  
  if (!user) { auth.classList.remove('hidden'); app.classList.add('hidden'); return; }
  auth.classList.add('hidden'); app.classList.remove('hidden');
  
  $('#user-name').textContent = user.name;
  $('#user-role').textContent = roleLabel(user);
  $('#user-avatar').textContent = user.name.charAt(0).toUpperCase();
  
  $$('.admin-only').forEach(el => el.classList.toggle('hidden', user.role !== 'admin'));
  if (user.role !== 'admin' && ['history', 'users', 'settings'].includes(currentView)) currentView = 'dashboard';
  
  $$('#nav .nav-btn').forEach(b => {
    const active = b.dataset.view === currentView;
    b.classList.toggle('active', active);
    if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  
  const titles = { dashboard: 'Dashboard', books: 'Books', mine: 'My Loans', history: 'Borrowing History', users: 'Patrons', settings: 'Settings' };
  $('#view-title').textContent = titles[currentView] || '';
  
  const actions = $('#topbar-actions'); actions.innerHTML = '';
  if (currentView === 'books' && user.role === 'admin') {
    actions.innerHTML = `<button class="btn btn-primary" onclick="openBookModal()">${icon('plus', { size: 16 })} Add book</button>`;
  }
  
  // Render Notifications
  const notifs = load(KEYS.notifications, []).filter(n => n.userId === user.id);
  const banner = $('#notification-banner');
  if (notifs.length > 0) {
    banner.innerHTML = `<div class="notification-banner">${escapeHtml(notifs[0].message)} <button class="btn btn-sm btn-ghost" style="color:white; border: 1px solid white;" id="clear-notif">Dismiss</button></div>`;
    $('#clear-notif').onclick = () => {
      save(KEYS.notifications, load(KEYS.notifications, []).filter(n => n.userId !== user.id));
      render();
    };
  } else { banner.innerHTML = ''; }
  
  const view = $('#view'); view.innerHTML = '';
  ({ dashboard: renderDashboard, books: renderBooks, mine: renderMine, history: renderHistory, users: renderUsers, settings: renderSettings }[currentView])(view, user);
}

/* ---------- Dashboard (Restored!) ---------- */
function renderDashboard(root, user) {
  const books = getBooks();
  const recs = getRecords();
  const s = settings();
  
  const totalBooks = books.reduce((n, b) => n + b.totalCopies, 0);
  const openRecs = recs.filter(r => !r.returnDate);
  const borrowedNow = openRecs.length;
  const overdueNow = openRecs.filter(r => Date.now() > r.dueDate).length;
  const finesCollected = recs.reduce((n, r) => n + (r.returnDate ? r.fine : 0), 0);
  const breakdown = categoryBreakdown(books);
  const maxCount = Math.max(1, ...breakdown.map(([, n]) => n));
  
  root.innerHTML = `
    <div class="stat-grid">
      ${statCard('books', 'Total books', totalBooks, 'var(--sage)')}
      ${statCard('bookmark', 'Currently borrowed', borrowedNow, 'var(--slateblue)')}
      ${statCard('alert', 'Overdue', overdueNow, 'var(--wine)')}
      ${statCard('coin', 'Fines collected', s.currency + finesCollected, 'var(--oxblood)')}
    </div>
    <div class="card" style="margin-top:24px; ${user.isSuspended ? 'background: var(--wine); color: #fff; border: none;' : ''}">
      <h3 style="${user.isSuspended ? 'color: #fff;' : ''}">
        ${user.isSuspended ? 'Account Suspended' : `Welcome back, ${escapeHtml(user.name.split(' ')[0])}`}
      </h3>
      <p class="${user.isSuspended ? '' : 'muted'}" style="margin:0">
        ${user.isSuspended
          ? 'Your borrowing privileges have been suspended. Please return any overdue books and pay outstanding fines, or contact a Librarian.'
          : user.role === 'admin' 
            ? 'You have admin access. Manage books, review history, and adjust fine settings.' 
            : 'Browse the Books tab to borrow something new, or check My Loans to return one.'}
      </p>
    </div>
    <div class="card shelf-card">
      <h3>Collection by category</h3>
      ${breakdown.length === 0 ? `<p class="muted" style="margin:0">No books in the collection yet.</p>` : `
      <div class="shelf-wrap">
        <div class="sr-only"><ul>${breakdown.map(([cat, count]) => `<li>${escapeHtml(cat)}: ${count} books</li>`).join('')}</ul></div>
        <div class="shelf" aria-hidden="true">
          ${breakdown.map(([cat, count]) => `<div class="spine" style="height:${Math.max(10, Math.round(count / maxCount * 100))}%; background:${categoryColor(cat)}" title="${escapeAttr(cat)}: ${count}"></div>`).join('')}
        </div>
        <div class="shelf-legend">
          ${breakdown.map(([cat, count]) => `
            <div class="shelf-legend-row">
              <span class="shelf-chip" style="background:${categoryColor(cat)}"></span>
              <span class="shelf-legend-name">${escapeHtml(cat)}</span>
              <span class="shelf-legend-count">${count}</span>
            </div>`).join('')}
        </div>
      </div>`}
    </div>
  `;
}
const statCard = (ico, lbl, val, col) => `
  <div class="stat">
    <div class="stat-ico" style="background:${col}">${icon(ico, { size: 20 })}</div>
    <div><div class="stat-label">${lbl}</div><div class="stat-value">${val}</div></div>
  </div>
`;

/* ---------- Books (Filters, Holds & Admin Restored) ---------- */
let bookFilter = { q: '', category: '', status: '', sort: 'title' };
function renderBooks(root, user) {
  const books = getBooks();
  const cats = Array.from(new Set(books.map(b => b.category))).sort();
  
  root.innerHTML = `
    <div class="filters">
      <div class="search-wrap">
        ${icon('search', { size: 16 })}
        <input id="f-q" type="search" placeholder="Search title or author" value="${escapeHtml(bookFilter.q)}" aria-label="Search books" />
      </div>
      <select id="f-cat" aria-label="Filter by category">
        <option value="">All categories</option>
        ${cats.map(c => `<option value="${escapeHtml(c)}" ${bookFilter.category===c?'selected':''}>${escapeHtml(c)}</option>`).join('')}
      </select>
      <select id="f-sort" aria-label="Sort books">
        <option value="title" ${bookFilter.sort==='title'?'selected':''}>Sort: Title</option>
        <option value="author" ${bookFilter.sort==='author'?'selected':''}>Sort: Author</option>
        <option value="avail" ${bookFilter.sort==='avail'?'selected':''}>Sort: Availability</option>
      </select>
    </div>
    <div id="book-grid" class="book-grid"></div>
  `;
  
  const draw = () => {
    const grid = $('#book-grid', root);
    const q = bookFilter.q.trim().toLowerCase();
    const filtered = books.filter(b => {
      if (q && !(b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))) return false;
      if (bookFilter.category && b.category !== bookFilter.category) return false;
      return true;
    }).sort((a, b) => {
      if (bookFilter.sort === 'author') return a.author.localeCompare(b.author) || a.title.localeCompare(b.title);
      if (bookFilter.sort === 'avail') return b.availableCopies - a.availableCopies || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
    
    if (filtered.length === 0) { grid.innerHTML = `<div class="empty">No books match.</div>`; return; }
    grid.innerHTML = filtered.map(b => bookCard(b, user)).join('');
  };
  
  draw();
  
  // Event Delegation for Book Cards
  $('#book-grid', root).addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const book = books.find(x => x.id === btn.closest('.book').dataset.id);
    const action = btn.dataset.act;
    
    if (action === 'borrow') { try { borrowBook(book, user); toast('Borrowed!', 'success'); render(); } catch(err) { toast(err.message, 'error'); } }
    if (action === 'hold') {
      if (!book.holds) book.holds = [];
      if (book.holds.includes(user.id)) return toast('You already placed a hold.', 'info');
      book.holds.push(user.id); saveBook(book); toast('Hold placed!', 'success');
    }
    if (action === 'edit') openBookModal(book);
    if (action === 'restock') handleRestock(book);
    if (action === 'delete') {
      confirmModal(`Delete “${book.title}”?`, () => { deleteBook(book.id); toast('Book deleted', 'success'); render(); });
    }
  });

  $('#f-q', root).addEventListener('input', e => { bookFilter.q = e.target.value; draw(); });
  $('#f-cat', root).addEventListener('change', e => { bookFilter.category = e.target.value; draw(); });
  $('#f-sort', root).addEventListener('change', e => { bookFilter.sort = e.target.value; draw(); });
}

function getRatingHtml(book) {
  if (!book.reviews || book.reviews.length === 0) return '';
  const avg = (book.reviews.reduce((a, b) => a + b.rating, 0) / book.reviews.length).toFixed(1);
  return `<div class="rating-stars">${icon('star', {size: 14})} <span>${avg} (${book.reviews.length})</span></div>`;
}

function bookCard(b, user) {
  const isAdmin = user.role === 'admin';
  const isSuspended = user.isSuspended;
  
  return `
    <article class="book" data-id="${b.id}" style="--spine:${categoryColor(b.category)}">
      <div class="book-cover">${b.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</div>
      <div class="book-title">${escapeHtml(b.title)}</div>
      <div class="book-meta">${escapeHtml(b.author)} · <span class="muted">${escapeHtml(b.category)}</span></div>
      ${getRatingHtml(b)}
      <div>${b.availableCopies === 0 ? `<span class="badge out">Out of stock</span>` : `<span class="badge avail">Available · ${b.availableCopies}</span>`}</div>
      <div class="book-foot">
        ${b.availableCopies > 0 
          ? `<button class="btn btn-primary btn-sm" data-act="borrow" ${isSuspended ? 'disabled title="Account suspended"' : ''}>${icon('bookmark',{size:14})} Borrow</button>`
          : `<button class="btn btn-ghost btn-sm" data-act="hold" ${isSuspended ? 'disabled title="Account suspended"' : ''}>Place Hold</button>`}
        
        ${isAdmin ? `
          <div style="display:flex;gap:6px; margin-top:8px;">
            <button class="btn btn-ghost btn-sm" data-act="restock" title="Restock">${icon('plus',{size:14})}</button>
            <button class="btn btn-ghost btn-sm" data-act="edit" title="Edit">${icon('edit',{size:14})}</button>
            <button class="btn btn-ghost btn-sm" data-act="delete" style="color:var(--danger)" title="Delete">${icon('trash',{size:14})}</button>
          </div>` : ''}
      </div>
    </article>
  `;
}

/* ---------- Admin: Add/Edit/Restock ---------- */
function handleRestock(book) {
  openModal(`
    <h3>Restock Book</h3>
    <form id="restock-form">
      <label>Number of new copies received<input name="addedAmount" type="number" min="1" required value="1" /></label>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button type="submit" class="btn btn-primary">Add to Stock</button></div>
    </form>`, (root) => {
    $('#restock-form', root).onsubmit = e => {
      e.preventDefault();
      const added = parseInt(new FormData(e.target).get('addedAmount'), 10);
      if (added > 0) {
        book.totalCopies += added; book.availableCopies += added;
        saveBook(book); toast(`Added ${added} copies.`, 'success'); closeModal(); render();
      }
    };
  });
}

function openBookModal(book) {
  const isEdit = !!book;
  const b = book || { title: '', author: '', category: '', totalCopies: 1, availableCopies: 1 };
  openModal(`
    <h3>${isEdit ? 'Edit book' : 'Add a new book'}</h3>
    <form id="book-form">
      <label>Title<input name="title" required value="${escapeAttr(b.title)}" /></label>
      <label>Author<input name="author" required value="${escapeAttr(b.author)}" /></label>
      <label>Category<input name="category" required value="${escapeAttr(b.category)}" /></label>
      <label>Total copies<input name="totalCopies" type="number" min="1" required value="${b.totalCopies}" id="tc-input" aria-describedby="bf-err"/></label>
      <p class="field-error hidden" id="bf-err" aria-live="assertive"></p>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
    </form>`, (root) => {
    $('#book-form', root).onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const total = Math.max(1, parseInt(fd.get('totalCopies'), 10) || 1);
      const errEl = $('#bf-err', root);
      
      if (isEdit) {
        const currentlyOut = b.totalCopies - b.availableCopies;
        if (total < currentlyOut) {
          errEl.textContent = `Can't be fewer than the ${currentlyOut} currently checked out.`;
          errEl.classList.remove('hidden'); return;
        }
        errEl.classList.add('hidden');
        b.title = fd.get('title').trim(); b.author = fd.get('author').trim(); b.category = fd.get('category').trim();
        b.availableCopies = Math.max(0, Math.min(total, b.availableCopies + (total - b.totalCopies)));
        b.totalCopies = total;
        saveBook(b); toast('Book updated', 'success');
      } else {
        saveBook({ id: uid(), title: fd.get('title').trim(), author: fd.get('author').trim(), category: fd.get('category').trim(), totalCopies: total, availableCopies: total, holds: [], reviews: [], createdAt: Date.now() });
        toast('Book added', 'success');
      }
      closeModal(); render();
    };
  });
}

/* ---------- My Loans & Reviews ---------- */
function renderMine(root, user) {
  const mine = getRecords().filter(r => r.userId === user.id).sort((a, b) => b.borrowDate - a.borrowDate);
  if (mine.length === 0) { root.innerHTML = `<div class="empty">You haven't borrowed anything yet.</div>`; return; }
  const s = settings();
  
  root.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>Book</th><th>Borrowed</th><th>Due/Returned</th><th>Fine</th><th>Status</th><th></th></tr></thead>
    <tbody>
      ${mine.map(r => `<tr>
        <td>${escapeHtml(r.bookTitle)}</td>
        <td>${fmtDate(r.borrowDate)}</td>
        <td>${fmtDate(r.returnDate || r.dueDate)}</td>
        <td>${r.fine ? s.currency + r.fine : '—'}</td>
        <td>${statusBadge(statusOf(r))}</td>
        <td>
          ${!r.returnDate ? `<button class="btn btn-sm btn-primary" data-return="${r.id}">Return</button>` : ''}
          ${r.returnDate ? `<button class="btn btn-sm btn-ghost" data-review="${r.bookId}">Review</button>` : ''}
        </td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
  
  root.addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    
    if (btn.dataset.return) {
      confirmModal('Return this book now?', () => {
        try {
          const { rec, lateDays } = returnBook(btn.dataset.return);
          if (lateDays > 0) toast(`Returned ${lateDays} days late. Fine: ${settings().currency}${rec.fine}`, 'warn');
          else toast('Book returned!', 'success');
          render();
        } catch(err) { toast(err.message, 'error'); }
      }, 'Return');
    }
    
    if (btn.dataset.review) {
      openModal(`
        <h3>Leave a Review</h3>
        <form id="rev-form">
          <label>Rating (1-5 stars)<input type="number" name="rating" min="1" max="5" required></label>
          <label>Short Review<textarea name="text" required style="resize:vertical"></textarea></label>
          <div class="modal-actions"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button type="submit" class="btn btn-primary">Submit</button></div>
        </form>`, (m) => {
        $('#rev-form', m).onsubmit = (ev) => {
          ev.preventDefault();
          const b = getBooks().find(x => x.id === btn.dataset.review);
          if(!b.reviews) b.reviews = [];
          b.reviews.push({ userId: user.id, rating: parseInt($('[name="rating"]', m).value), text: $('[name="text"]', m).value });
          saveBook(b); toast('Review saved! Thanks!', 'success'); closeModal(); render();
        };
      });
    }
  });
}

function statusBadge(st) {
  if (st === 'returned') return `<span class="badge ok">Returned</span>`;
  if (st === 'overdue') return `<span class="badge late">Overdue</span>`;
  return `<span class="badge avail">Borrowed</span>`;
}

/* ---------- Admin: History & Waivers ---------- */
function renderHistory(root) {
  const recs = getRecords().sort((a, b) => b.borrowDate - a.borrowDate);
  const s = settings();
  root.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>Patron</th><th>Book</th><th>Borrowed</th><th>Returned</th><th>Fine</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>${recs.map(r => `<tr>
        <td>${escapeHtml(r.userName)}</td><td>${escapeHtml(r.bookTitle)}</td>
        <td>${fmtDate(r.borrowDate)}</td><td>${fmtDate(r.returnDate)}</td>
        <td>${r.fine ? s.currency + r.fine : '—'}</td>
        <td>${statusBadge(statusOf(r))}</td>
        <td>${r.fine > 0 ? `<button class="btn btn-sm btn-ghost" data-waive="${r.id}">Waive</button>` : ''}</td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
  
  root.addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn || !btn.dataset.waive) return;
    confirmModal('Waive this fine completely?', () => {
      const r = recs.find(x => x.id === btn.dataset.waive);
      r.fine = 0; save(KEYS.records, recs); toast('Fine waived', 'success'); render();
    }, 'Waive Fine');
  });
}

/* ---------- Admin: Patrons & Suspensions ---------- */
function renderUsers(root) {
  const users = load(KEYS.users, []);
  root.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${users.map(u => `<tr>
        <td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td>
        <td><span class="badge ${u.role==='admin'?'low':'ok'}">${u.role}</span></td>
        <td>${u.isSuspended ? '<span class="badge late">Suspended</span>' : 'Active'}</td>
        <td style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-ghost" data-toggle="${u.id}">Make ${u.role==='admin'?'Patron':'Admin'}</button>
          <button class="btn btn-sm btn-ghost" data-suspend="${u.id}" ${u.role === 'admin' ? 'disabled title="Admins cannot be suspended"' : ''}>
            ${u.isSuspended ? 'Unsuspend' : 'Suspend'}
          </button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
  
  root.addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    const usersList = load(KEYS.users, []);
    
    if (btn.dataset.toggle) {
      const u = usersList.find(x => x.id === btn.dataset.toggle);
      u.role = u.role === 'admin' ? 'user' : 'admin';
      save(KEYS.users, usersList); toast(`Role changed for ${u.name}`, 'success'); render();
    }
    
    if (btn.dataset.suspend) {
      const u = usersList.find(x => x.id === btn.dataset.suspend);
      if (u.role === 'admin') return; // Extra backend protection
      u.isSuspended = !u.isSuspended;
      save(KEYS.users, usersList); toast(`${u.name} is now ${u.isSuspended ? 'Suspended' : 'Active'}`, 'warn'); render();
    }
  });
}

/* ---------- Admin: Settings (Restored!) ---------- */
function renderSettings(root) {
  const s = settings();
  root.innerHTML = `
    <div class="card" style="max-width:520px">
      <h3>Circulation Settings</h3>
      <form id="settings-form" style="display:grid;gap:12px">
        <label>Loan period (days)<input name="loanDays" type="number" min="1" value="${s.loanDays}" required /></label>
        <label>Fine per late day<input name="finePerDay" type="number" min="0" step="0.01" value="${s.finePerDay}" required /></label>
        <label>Currency symbol<input name="currency" maxlength="3" value="${escapeAttr(s.currency)}" required /></label>
        <div class="modal-actions"><button class="btn btn-primary">Save Settings</button></div>
      </form>
    </div>
  `;
  $('#settings-form', root).addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    save(KEYS.settings, { loanDays: parseInt(fd.get('loanDays'), 10), finePerDay: parseFloat(fd.get('finePerDay')), currency: fd.get('currency').trim() || '₹' });
    toast('Settings saved', 'success'); render();
  });
}

/* ---------- Modal & Toast Utils ---------- */
let modalPrevFocus = null;
function openModal(html, onMount) {
  modalPrevFocus = document.activeElement;
  $('#modal-root').innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" tabindex="-1">${html}</div></div>`;
  $('.modal-backdrop').onclick = (e) => { if (e.target === $('.modal-backdrop')) closeModal(); };
  $$('[data-close]').forEach(b => b.onclick = closeModal);
  $('.modal').focus();
  if (onMount) onMount($('#modal-root'));
}
function confirmModal(msg, onConfirm, label = 'Confirm') {
  openModal(`<h3>${escapeHtml(msg)}</h3><div class="modal-actions"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="confirm-btn">${escapeHtml(label)}</button></div>`, (root) => {
    $('#confirm-btn', root).onclick = () => { closeModal(); onConfirm(); };
  });
}
function closeModal() { $('#modal-root').innerHTML = ''; if (modalPrevFocus) modalPrevFocus.focus(); }
function toast(msg, kind = 'info') {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  const iconName = { success: 'check', error: 'alert', warn: 'history', info: 'info' }[kind] || 'info';
  el.innerHTML = `<span class="t-ico">${icon(iconName, { size: 18 })}</span><span class="t-msg">${escapeHtml(msg)}</span>`;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; }, 2600);
  setTimeout(() => el.remove(), 3000);
}
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function escapeAttr(s) { return escapeHtml(s); }

/* ---------- Boot & Event Listeners ---------- */
async function boot() {
  await seed();
  
  // Theme management
  if (load(KEYS.theme) === 'dark') document.body.classList.add('dark');
  $('#theme-toggle').onclick = () => {
    document.body.classList.toggle('dark');
    save(KEYS.theme, document.body.classList.contains('dark') ? 'dark' : 'light');
  };

  // Auth Tabs
  $$('.tab').forEach(t => t.onclick = () => {
    $$('.tab').forEach(x => { const s = x === t; x.classList.toggle('active', s); x.setAttribute('aria-selected', s); });
    $('#login-form').classList.toggle('hidden', t.dataset.tab !== 'login');
    $('#register-form').classList.toggle('hidden', t.dataset.tab !== 'register');
  });

  // Login
  $('#login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const users = load(KEYS.users, []);
    const u = users.find(x => x.email.toLowerCase() === fd.get('email').toLowerCase());
    if (u && await hashPassword(fd.get('password'), u.salt) === u.passwordHash) {
      save(KEYS.session, { userId: u.id }); toast(`Welcome back, ${u.name.split(' ')[0]}!`, 'success'); currentView = 'dashboard'; render();
    } else { toast('Invalid email or password.', 'error'); }
  });

  // Register
  $('#register-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const users = load(KEYS.users, []);
    if (users.some(u => u.email.toLowerCase() === fd.get('email').toLowerCase())) return toast('Email already exists.', 'error');
    
    const salt = uid();
    const u = { id: uid(), name: fd.get('name'), email: fd.get('email'), salt, passwordHash: await hashPassword(fd.get('password'), salt), role: 'user', isSuspended: false, createdAt: Date.now() };
    users.push(u); save(KEYS.users, users); save(KEYS.session, { userId: u.id });
    toast(`Welcome, ${u.name.split(' ')[0]}!`, 'success'); currentView = 'dashboard'; render();
  });

  // Sidebar / Logout
  $$('#nav .nav-btn').forEach(b => b.onclick = () => { currentView = b.dataset.view; render(); });
  $('#logout-btn').onclick = () => { localStorage.removeItem(KEYS.session); toast('Signed out', 'info'); render(); };

  render();
}
boot();