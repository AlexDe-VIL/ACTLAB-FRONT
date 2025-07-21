const API = 'http://localhost:5000/api';
let token, role, name;

// Helpers
async function request(path, method = 'GET', body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  return res.json();
}

// Redirigir a la página de login cuando se hace clic en "Ingresar"
document.getElementById("login-btn").onclick = function () {
  window.location.href = "login.html";  // Redirige a la página de login
};

// AUTH FLOW (index.html)
if (location.pathname.endsWith('index.html') || location.pathname === '/') {
  // Solo mostrar el formulario de login sin alternar con el registro
  document.getElementById('form-title').innerText = 'Iniciar Sesión';
  document.getElementById('submit-btn').innerText = 'Ingresar';
  
  // Handle form submission (login only)
  document.getElementById('submit-btn').onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = await request('/auth/login', 'POST', { email, password });

    if (data.token) {
      token = data.token;
      role = data.role;
      name = data.name;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      window.location = role === 'admin' ? 'admin.html' : 'user.html';  // Corrected redirection
    } else {
      alert(data.msg);  // Show error message if login fails
    }
  };
}

// CARGA INICIAL (user.html & admin.html)
if (token = localStorage.getItem('token')) {
  role = localStorage.getItem('role');
  name = localStorage.getItem('name');

  if (role === 'user' && location.pathname.endsWith('user.html')) {
    initUser();
  }

  if (role === 'admin' && location.pathname.endsWith('admin.html')) {
    initAdmin();
  }
} else {
  window.location = 'index.html';  // Corrected redirection
}

// USER PAGE
async function initUser() {
  const me = await request('/auth/me');
  document.getElementById('welcome').innerText = `Hola, ${me.name}`;
  document.getElementById('logout').onclick = () => { 
    localStorage.clear(); 
    window.location = 'index.html'; 
  };

  document.getElementById('req-appt').onclick = async () => {
    const date = document.getElementById('appt-date').value;
    await request('/appointments', 'POST', { date });
    loadAppts();
  };

  document.getElementById('upd-profile').onclick = async () => {
    const name = document.getElementById('new-name').value;
    const password = document.getElementById('new-pass').value;
    await request('/auth/me', 'PUT', { name, password });
    alert('Perfil actualizado');
  };

  async function loadAppts() {
    const list = await request('/appointments');
    const apptList = document.getElementById('appt-list');
    apptList.innerHTML = list.map(a => `<li>${new Date(a.date).toLocaleString()} - ${a.status}</li>`).join('');
  }
  loadAppts();
}

// ADMIN PAGE
async function initAdmin() {
  document.getElementById('logout').onclick = () => { 
    localStorage.clear(); 
    window.location = 'index.html'; 
  };

  const list = await request('/appointments/all');
  const allAppts = document.getElementById('all-appts');
  allAppts.innerHTML = list.map(a => {
    return `<tr>
      <td>${a.user.name} (${a.user.email})</td>
      <td>${new Date(a.date).toLocaleString()}</td>
      <td>${a.status}</td>
      <td>
        <button onclick="change('${a._id}', 'confirmed')">✅</button>
        <button onclick="change('${a._id}', 'cancelled')">❌</button>
      </td>
    </tr>`;
  }).join('');

  window.change = async (id, status) => {
    await request(`/appointments/${id}`, 'PUT', { status });
    initAdmin();  // Reload appointments after status change
  };
}
