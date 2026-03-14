const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");

const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");

const currentUserInfo = document.getElementById("currentUserInfo");
const logoutBtn = document.getElementById("logoutBtn");
const exportBtn = document.getElementById("exportBtn");

const voterForm = document.getElementById("voterForm");
const voterMessage = document.getElementById("voterMessage");
const votersTableBody = document.getElementById("votersTableBody");
const usersTableBody = document.getElementById("usersTableBody");
const searchResults = document.getElementById("searchResults");
const filteredCountBadge = document.getElementById("filteredCountBadge");
const userPermissionsNote = document.getElementById("userPermissionsNote");

const searchInput = document.getElementById("searchInput");
const filterProvince = document.getElementById("filterProvince");
const filterMunicipio = document.getElementById("filterMunicipio");
const filterSector = document.getElementById("filterSector");
const filterMesa = document.getElementById("filterMesa");
const filterRole = document.getElementById("filterRole");
const filterRegistrar = document.getElementById("filterRegistrar");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const totalVoters = document.getElementById("totalVoters");
const totalUsers = document.getElementById("totalUsers");
const todayVoters = document.getElementById("todayVoters");
const activeProvinces = document.getElementById("activeProvinces");

const editingUserId = document.getElementById("editingUserId");
const registerFormTitle = document.getElementById("registerFormTitle");
const saveUserBtn = document.getElementById("saveUserBtn");
const cancelEditUserBtn = document.getElementById("cancelEditUserBtn");
const firstUserHint = document.getElementById("firstUserHint");

function getUsers() {
  return JSON.parse(localStorage.getItem("jupc_users")) || [];
}

function setUsers(users) {
  localStorage.setItem("jupc_users", JSON.stringify(users));
}

function getVoters() {
  return JSON.parse(localStorage.getItem("jupc_voters")) || [];
}

function setVoters(voters) {
  localStorage.setItem("jupc_voters", JSON.stringify(voters));
}

function getSession() {
  return JSON.parse(localStorage.getItem("jupc_session")) || null;
}

function setSession(user) {
  localStorage.setItem("jupc_session", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("jupc_session");
}

function generateId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeUsers() {
  const users = getUsers();
  let changed = false;

  const normalized = users.map(user => {
    const updatedUser = { ...user };

    if (!updatedUser.id) {
      updatedUser.id = generateId();
      changed = true;
    }

    return updatedUser;
  });

  if (changed) {
    setUsers(normalized);

    const session = getSession();
    if (session) {
      const refreshedSession = normalized.find(
        user =>
          user.username === session.username &&
          user.password === session.password
      );

      if (refreshedSession) {
        setSession(refreshedSession);
      }
    }
  }
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `status-message show ${type}`;

  setTimeout(() => {
    element.className = "status-message";
    element.textContent = "";
  }, 3500);
}

function switchTab(mode) {
  if (mode === "login") {
    showLogin.classList.add("active");
    showRegister.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  } else {
    showRegister.classList.add("active");
    showLogin.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
  }
}

showLogin.addEventListener("click", () => switchTab("login"));
showRegister.addEventListener("click", () => switchTab("register"));

function getCurrentSession() {
  return getSession();
}

function isAdminGeneral() {
  const session = getCurrentSession();
  return !!session && session.role === "Administrador General";
}

function updateInitialHint() {
  const users = getUsers();

  if (users.length === 0) {
    firstUserHint.textContent =
      "Como configuración inicial, el primer usuario que se cree puede establecerse como Administrador General.";
  } else {
    firstUserHint.textContent =
      "El sistema permite crear usuarios con distintos niveles de acceso según la estructura operativa.";
  }
}

function resetUserForm() {
  registerForm.reset();
  editingUserId.value = "";
  registerFormTitle.textContent = "Crear nuevo usuario";
  saveUserBtn.textContent = "Crear usuario";
  cancelEditUserBtn.classList.add("hidden");
}

function fillUserForm(user) {
  document.getElementById("registerName").value = user.name || "";
  document.getElementById("registerUsername").value = user.username || "";
  document.getElementById("registerRole").value = user.role || "";
  document.getElementById("registerPhone").value = user.phone || "";
  document.getElementById("registerProvince").value = user.province || "";
  document.getElementById("registerZone").value = user.zone || "";
  document.getElementById("registerPassword").value = user.password || "";

  editingUserId.value = user.id || "";
  registerFormTitle.textContent = "Editar usuario";
  saveUserBtn.textContent = "Guardar cambios";
  cancelEditUserBtn.classList.remove("hidden");
  switchTab("register");
}

cancelEditUserBtn.addEventListener("click", resetUserForm);

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const users = getUsers();

  const name = document.getElementById("registerName").value.trim();
  const username = document.getElementById("registerUsername").value.trim();
  const role = document.getElementById("registerRole").value.trim();
  const phone = document.getElementById("registerPhone").value.trim();
  const province = document.getElementById("registerProvince").value.trim();
  const zone = document.getElementById("registerZone").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  const editingId = editingUserId.value.trim();

  if (!editingId) {
    const duplicated = users.some(
      user => user.username.toLowerCase() === username.toLowerCase()
    );

    if (duplicated) {
      showMessage(authMessage, "Ese nombre de usuario ya existe.", "error");
      return;
    }

    users.push({
      id: generateId(),
      name,
      username,
      role,
      phone,
      province,
      zone,
      password
    });

    setUsers(users);
    resetUserForm();
    updateInitialHint();
    showMessage(authMessage, "Usuario registrado correctamente.", "success");

    fillFilterOptions();
    renderUsers();
    updateStats();
    return;
  }

  const session = getCurrentSession();

  if (!session || !isAdminGeneral()) {
    showMessage(authMessage, "Solo un Administrador General puede editar usuarios.", "error");
    return;
  }

  const duplicated = users.some(
    user =>
      user.username.toLowerCase() === username.toLowerCase() &&
      user.id !== editingId
  );

  if (duplicated) {
    showMessage(authMessage, "Ese nombre de usuario ya existe.", "error");
    return;
  }

  const updatedUsers = users.map(user => {
    if (user.id !== editingId) return user;

    return {
      ...user,
      name,
      username,
      role,
      phone,
      province,
      zone,
      password
    };
  });

  setUsers(updatedUsers);

  const current = getSession();
  if (current && current.id === editingId) {
    const refreshed = updatedUsers.find(user => user.id === editingId);
    if (refreshed) {
      setSession(refreshed);
    }
  }

  updateVotersRegistrarInfo(editingId, {
    name,
    username,
    role,
    province,
    zone
  });

  resetUserForm();
  showMessage(authMessage, "Usuario actualizado correctamente.", "success");

  fillFilterOptions();
  renderAll();

  if (getSession()) {
    loadDashboard();
  }
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const users = getUsers();
  const user = users.find(
    item => item.username === username && item.password === password
  );

  if (!user) {
    showMessage(authMessage, "Credenciales incorrectas.", "error");
    return;
  }

  setSession(user);
  loadDashboard();
});

logoutBtn.addEventListener("click", () => {
  clearSession();
  dashboardSection.classList.add("hidden");
  authSection.classList.remove("hidden");
});

voterForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const session = getCurrentSession();
  if (!session) return;

  const name = document.getElementById("voterName").value.trim();
  const cedula = document.getElementById("voterCedula").value.trim();
  const phone = document.getElementById("voterPhone").value.trim();
  const province = document.getElementById("voterProvince").value.trim();
  const municipio = document.getElementById("voterMunicipio").value.trim();
  const sector = document.getElementById("voterSector").value.trim();
  const mesa = document.getElementById("voterMesa").value.trim();
  const recinto = document.getElementById("voterRecinto").value.trim();
  const notes = document.getElementById("voterNotes").value.trim();

  const voters = getVoters();

  if (voters.some(voter => voter.cedula === cedula)) {
    showMessage(voterMessage, "Ya existe un registro con esa cédula.", "error");
    return;
  }

  voters.push({
    id: Date.now(),
    name,
    cedula,
    phone,
    province,
    municipio,
    sector,
    mesa,
    recinto,
    notes,
    registeredById: session.id,
    registeredBy: session.username,
    registeredByName: session.name,
    registeredByRole: session.role,
    registeredByProvince: session.province,
    registeredByZone: session.zone,
    createdAt: new Date().toLocaleString("es-DO")
  });

  setVoters(voters);
  voterForm.reset();
  showMessage(voterMessage, "Registro guardado correctamente.", "success");

  fillFilterOptions();
  renderAll();
});

function updateVotersRegistrarInfo(userId, updatedUserData) {
  const voters = getVoters();

  const updatedVoters = voters.map(voter => {
    if (voter.registeredById !== userId) return voter;

    return {
      ...voter,
      registeredBy: updatedUserData.username,
      registeredByName: updatedUserData.name,
      registeredByRole: updatedUserData.role,
      registeredByProvince: updatedUserData.province,
      registeredByZone: updatedUserData.zone
    };
  });

  setVoters(updatedVoters);
}

function getVisibleVoters() {
  const session = getCurrentSession();
  const voters = getVoters();

  if (!session) return [];

  if (session.role === "Administrador General") {
    return voters;
  }

  return voters.filter(voter => {
    if (voter.registeredById) {
      return voter.registeredById === session.id;
    }
    return voter.registeredBy === session.username;
  });
}

function getVisibleUsers() {
  const session = getCurrentSession();
  const users = getUsers();

  if (!session) return [];

  if (session.role === "Administrador General") {
    return users;
  }

  if (session.id) {
    return users.filter(user => user.id === session.id);
  }

  return users.filter(user => user.username === session.username);
}

function renderUsers() {
  const users = getVisibleUsers();
  const session = getCurrentSession();
  usersTableBody.innerHTML = "";

  if (session && session.role === "Administrador General") {
    userPermissionsNote.textContent = "Administración completa habilitada";
  } else {
    userPermissionsNote.textContent = "Visualización limitada a su propio perfil";
  }

  const orderedUsers = [...users].sort((a, b) => {
    if (a.role !== b.role) return a.role.localeCompare(b.role, "es");
    return a.name.localeCompare(b.name, "es");
  });

  if (!orderedUsers.length) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="7">No hay usuarios para mostrar.</td>
      </tr>
    `;
    return;
  }

  orderedUsers.forEach(user => {
    const row = document.createElement("tr");

    let actionsHtml = `<span class="readonly-note">Solo lectura</span>`;

    if (session && session.role === "Administrador General") {
      actionsHtml = `
        <div class="actions-wrap">
          <button class="action-btn edit" type="button" data-action="edit-user" data-id="${user.id}">Editar</button>
          <button class="action-btn delete" type="button" data-action="delete-user" data-id="${user.id}">Eliminar</button>
        </div>
      `;
    }

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${user.phone}</td>
      <td>${user.province || ""}</td>
      <td>${user.zone || ""}</td>
      <td class="actions-cell">${actionsHtml}</td>
    `;

    usersTableBody.appendChild(row);
  });
}

usersTableBody.addEventListener("click", function (e) {
  const target = e.target.closest("button");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) return;

  const session = getCurrentSession();
  if (!session || session.role !== "Administrador General") {
    alert("Solo un Administrador General puede gestionar usuarios.");
    return;
  }

  const users = getUsers();
  const user = users.find(item => item.id === id);

  if (!user) {
    alert("No se encontró el usuario.");
    return;
  }

  if (action === "edit-user") {
    fillUserForm(user);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (action === "delete-user") {
    if (session.id === id) {
      alert("No puedes eliminar el usuario con el que estás autenticado.");
      return;
    }

    const adminsCount = users.filter(item => item.role === "Administrador General").length;

    if (user.role === "Administrador General" && adminsCount === 1) {
      alert("No puedes eliminar el único Administrador General del sistema.");
      return;
    }

    const voters = getVoters();
    const linkedVoters = voters.filter(voter => voter.registeredById === id).length;

    const confirmed = confirm(
      linkedVoters > 0
        ? `Este usuario tiene ${linkedVoters} registro(s) asociados. Se eliminará el usuario, pero los registros permanecerán como historial. ¿Deseas continuar?`
        : "¿Deseas eliminar este usuario?"
    );

    if (!confirmed) return;

    const updatedUsers = users.filter(item => item.id !== id);
    setUsers(updatedUsers);

    if (editingUserId.value === id) {
      resetUserForm();
    }

    showMessage(authMessage, "Usuario eliminado correctamente.", "success");
    fillFilterOptions();
    renderAll();
  }
});

function populateSelect(selectElement, values, defaultLabel) {
  const currentValue = selectElement.value;
  selectElement.innerHTML = `<option value="">${defaultLabel}</option>`;

  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });

  if (values.includes(currentValue)) {
    selectElement.value = currentValue;
  }
}

function uniqueSortedValues(values) {
  return [...new Set(values.filter(Boolean).map(value => value.trim()))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function fillFilterOptions() {
  const visibleVoters = getVisibleVoters();
  const visibleUsers = getVisibleUsers();

  populateSelect(
    filterProvince,
    uniqueSortedValues(visibleVoters.map(voter => voter.province)),
    "Todas"
  );

  populateSelect(
    filterMunicipio,
    uniqueSortedValues(visibleVoters.map(voter => voter.municipio)),
    "Todos"
  );

  populateSelect(
    filterSector,
    uniqueSortedValues(visibleVoters.map(voter => voter.sector)),
    "Todos"
  );

  populateSelect(
    filterMesa,
    uniqueSortedValues(visibleVoters.map(voter => voter.mesa)),
    "Todas"
  );

  populateSelect(
    filterRegistrar,
    uniqueSortedValues(visibleUsers.map(user => user.username)),
    "Todos"
  );
}

function getFilteredVoters() {
  const voters = getVisibleVoters();
  const q = searchInput.value.trim().toLowerCase();
  const province = filterProvince.value;
  const municipio = filterMunicipio.value;
  const sector = filterSector.value;
  const mesa = filterMesa.value;
  const role = filterRole.value;
  const registrar = filterRegistrar.value;

  return voters.filter(voter => {
    const matchesSearch =
      !q ||
      voter.name.toLowerCase().includes(q) ||
      voter.cedula.toLowerCase().includes(q) ||
      voter.phone.toLowerCase().includes(q) ||
      voter.province.toLowerCase().includes(q) ||
      voter.municipio.toLowerCase().includes(q) ||
      voter.sector.toLowerCase().includes(q) ||
      voter.mesa.toLowerCase().includes(q) ||
      voter.recinto.toLowerCase().includes(q) ||
      voter.registeredBy.toLowerCase().includes(q) ||
      voter.registeredByName.toLowerCase().includes(q) ||
      voter.registeredByRole.toLowerCase().includes(q) ||
      voter.registeredByZone.toLowerCase().includes(q);

    const matchesProvince = !province || voter.province === province;
    const matchesMunicipio = !municipio || voter.municipio === municipio;
    const matchesSector = !sector || voter.sector === sector;
    const matchesMesa = !mesa || voter.mesa === mesa;
    const matchesRole = !role || voter.registeredByRole === role;
    const matchesRegistrar = !registrar || voter.registeredBy === registrar;

    return (
      matchesSearch &&
      matchesProvince &&
      matchesMunicipio &&
      matchesSector &&
      matchesMesa &&
      matchesRole &&
      matchesRegistrar
    );
  });
}

function renderVotersTable() {
  const filtered = getFilteredVoters();
  const ordered = [...filtered].sort((a, b) => b.id - a.id);

  votersTableBody.innerHTML = "";

  if (!ordered.length) {
    votersTableBody.innerHTML = `
      <tr>
        <td colspan="12">No hay registros para mostrar con los filtros seleccionados.</td>
      </tr>
    `;
    filteredCountBadge.textContent = "0 resultados";
    return;
  }

  ordered.forEach(voter => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${voter.name}</td>
      <td>${voter.cedula}</td>
      <td>${voter.phone}</td>
      <td>${voter.province}</td>
      <td>${voter.municipio}</td>
      <td>${voter.sector}</td>
      <td>${voter.mesa}</td>
      <td>${voter.recinto}</td>
      <td>${voter.registeredByName} (${voter.registeredBy})</td>
      <td>${voter.registeredByRole}</td>
      <td>${voter.registeredByZone}</td>
      <td>${voter.createdAt}</td>
    `;
    votersTableBody.appendChild(row);
  });

  filteredCountBadge.textContent = `${ordered.length} resultado${ordered.length !== 1 ? "s" : ""}`;
}

function renderSearchResults() {
  const filtered = getFilteredVoters();
  const ordered = [...filtered].sort((a, b) => b.id - a.id).slice(0, 12);

  searchResults.innerHTML = "";

  if (!ordered.length) {
    searchResults.innerHTML = `
      <div class="result-item">
        <p>No se encontraron resultados con los criterios seleccionados.</p>
      </div>
    `;
    return;
  }

  ordered.forEach(voter => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.innerHTML = `
      <h4>${voter.name}</h4>
      <p><strong>Cédula:</strong> ${voter.cedula}</p>
      <p><strong>Ubicación:</strong> ${voter.sector}, ${voter.municipio}, ${voter.province}</p>
      <p><strong>Mesa:</strong> ${voter.mesa} | <strong>Recinto:</strong> ${voter.recinto}</p>
      <p><strong>Registrado por:</strong> ${voter.registeredByName} (${voter.registeredBy})</p>
      <p><strong>Rol:</strong> ${voter.registeredByRole} | <strong>Zona:</strong> ${voter.registeredByZone}</p>
      <p><strong>Fecha:</strong> ${voter.createdAt}</p>
    `;
    searchResults.appendChild(item);
  });
}

function updateStats() {
  const voters = getVisibleVoters();
  const users = getVisibleUsers();

  totalVoters.textContent = voters.length;
  totalUsers.textContent = users.length;

  const today = new Date().toLocaleDateString("es-DO");
  const todayCount = voters.filter(voter => {
    const voterDate = new Date(voter.id).toLocaleDateString("es-DO");
    return voterDate === today;
  }).length;

  todayVoters.textContent = todayCount;

  const provinces = new Set(
    voters
      .map(voter => voter.province)
      .filter(Boolean)
      .map(value => value.trim())
  );

  activeProvinces.textContent = provinces.size;
}

function renderAll() {
  renderVotersTable();
  renderSearchResults();
  renderUsers();
  updateStats();
}

function loadDashboard() {
  const session = getCurrentSession();
  if (!session) return;

  authSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");

  currentUserInfo.textContent = `${session.name} | ${session.role} | ${session.province || ""} | ${session.zone || ""}`;
  fillFilterOptions();
  renderAll();
}

function clearFilters() {
  searchInput.value = "";
  filterProvince.value = "";
  filterMunicipio.value = "";
  filterSector.value = "";
  filterMesa.value = "";
  filterRole.value = "";
  filterRegistrar.value = "";
  renderVotersTable();
  renderSearchResults();
}

[
  searchInput,
  filterProvince,
  filterMunicipio,
  filterSector,
  filterMesa,
  filterRole,
  filterRegistrar
].forEach(element => {
  element.addEventListener("input", () => {
    renderVotersTable();
    renderSearchResults();
  });

  element.addEventListener("change", () => {
    renderVotersTable();
    renderSearchResults();
  });
});

clearFiltersBtn.addEventListener("click", clearFilters);

function exportToExcel() {
  const session = getCurrentSession();
  const voters = getFilteredVoters();

  if (!voters.length) {
    alert("No hay datos para exportar.");
    return;
  }

  const ordered = [...voters].sort((a, b) => {
    if (a.registeredByRole !== b.registeredByRole) {
      return a.registeredByRole.localeCompare(b.registeredByRole, "es");
    }

    if (a.registeredByName !== b.registeredByName) {
      return a.registeredByName.localeCompare(b.registeredByName, "es");
    }

    if (a.province !== b.province) {
      return a.province.localeCompare(b.province, "es");
    }

    return a.name.localeCompare(b.name, "es");
  });

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
        th, td { border: 1px solid #cfd8e3; padding: 8px; font-size: 12px; }
        th { background: #edf4ff; color: #123055; }
        .group { background: #dceaff; font-weight: bold; font-size: 13px; }
        .subgroup { background: #f3f8ff; font-weight: bold; }
        .title { font-size: 18px; font-weight: bold; padding: 14px 8px; }
      </style>
    </head>
    <body>
      <table>
        <tr><td class="title" colspan="12">Reporte interno de registros</td></tr>
        <tr>
          <th>Nombre</th>
          <th>Cédula</th>
          <th>Teléfono</th>
          <th>Provincia</th>
          <th>Municipio</th>
          <th>Sector</th>
          <th>Mesa</th>
          <th>Recinto</th>
          <th>Registrado por</th>
          <th>Rol</th>
          <th>Zona</th>
          <th>Fecha</th>
        </tr>
  `;

  let currentRole = "";
  let currentRegistrar = "";

  ordered.forEach(voter => {
    if (session && session.role === "Administrador General") {
      if (voter.registeredByRole !== currentRole) {
        currentRole = voter.registeredByRole;
        currentRegistrar = "";
        html += `
          <tr>
            <td class="group" colspan="12">ROL: ${voter.registeredByRole}</td>
          </tr>
        `;
      }

      if (voter.registeredByName !== currentRegistrar) {
        currentRegistrar = voter.registeredByName;
        html += `
          <tr>
            <td class="subgroup" colspan="12">
              REGISTRADOR: ${voter.registeredByName} (${voter.registeredBy}) | ZONA: ${voter.registeredByZone} | PROVINCIA ASIGNADA: ${voter.registeredByProvince}
            </td>
          </tr>
        `;
      }
    }

    html += `
      <tr>
        <td>${voter.name}</td>
        <td>${voter.cedula}</td>
        <td>${voter.phone}</td>
        <td>${voter.province}</td>
        <td>${voter.municipio}</td>
        <td>${voter.sector}</td>
        <td>${voter.mesa}</td>
        <td>${voter.recinto}</td>
        <td>${voter.registeredByName} (${voter.registeredBy})</td>
        <td>${voter.registeredByRole}</td>
        <td>${voter.registeredByZone}</td>
        <td>${voter.createdAt}</td>
      </tr>
    `;
  });

  html += `
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reporte_interno_registros.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

exportBtn.addEventListener("click", exportToExcel);

normalizeUsers();
resetUserForm();
updateInitialHint();

if (getSession()) {
  loadDashboard();
} else {
  authSection.classList.remove("hidden");
  dashboardSection.classList.add("hidden");
}