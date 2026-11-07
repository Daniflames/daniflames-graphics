// Daniflames Graphics Portal — front-end demonstration only.
const projects = [];
const modal = document.getElementById('projectModal');
const form = document.getElementById('projectForm');
const fileInput = document.getElementById('artworkFile');
const fileInfo = document.getElementById('fileInfo');
const toast = document.getElementById('toast');

document.getElementById('year').textContent = new Date().getFullYear();

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('projectTitle').focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  form.reset();
  fileInfo.textContent = 'No file selected';
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

document.getElementById('newProjectButton').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  fileInfo.textContent = file
    ? `${file.name} — ${(file.size / 1024 / 1024).toFixed(2)} MB`
    : 'No file selected';
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) return notify('Please select an artwork file.');

  projects.unshift({
    title: document.getElementById('projectTitle').value.trim(),
    client: document.getElementById('clientName').value.trim(),
    fileName: file.name,
    date: new Date().toLocaleDateString(),
    status: 'In progress'
  });
  renderProjects();
  closeModal();
  notify('Project added to this browser demo.');
});

function renderProjects() {
  document.getElementById('totalProjects').textContent = projects.length;
  document.getElementById('pendingProjects').textContent =
    projects.filter(p => p.status === 'Awaiting approval').length;
  document.getElementById('deliveredProjects').textContent =
    projects.filter(p => p.status === 'Delivered').length;
  document.getElementById('activeLinks').textContent = 0;

  const rows = document.getElementById('projectRows');
  if (!projects.length) {
    rows.innerHTML = '<tr><td colspan="5" class="empty-state">No projects yet. Select <b>New project</b> to add your first client job.</td></tr>';
    return;
  }
  rows.innerHTML = projects.map(p => `
    <tr>
      <td><span class="project-name">${escapeHTML(p.title)}</span><br><small>${escapeHTML(p.fileName)}</small></td>
      <td>${escapeHTML(p.client)}</td><td>${p.date}</td>
      <td><span class="pill">${p.status}</span></td><td>Not created yet</td>
    </tr>`).join('');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}

document.querySelectorAll('[data-page]').forEach(button => {
  button.addEventListener('click', () => {
    const page = button.dataset.page;
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (button.classList.contains('nav-link')) button.classList.add('active');
    document.getElementById('pageName').textContent = page;
    document.getElementById('pageHeading').textContent =
      page === 'Overview' ? 'Good to see you.' : page;
    document.getElementById('sidebar').classList.remove('open');
    if (page !== 'Overview') notify(`${page} will be developed in a later stage.`);
  });
});

document.getElementById('menuButton').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
