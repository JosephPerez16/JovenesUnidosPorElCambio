const DOM = {
  currentUserInfo: document.getElementById("currentUserInfo"),
  backBtn: document.getElementById("backBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  totalUsers: document.getElementById("totalUsers"),
  approvedUsers: document.getElementById("approvedUsers"),
  pendingUsers: document.getElementById("pendingUsers"),
  activeProvinces: document.getElementById("activeProvinces"),
  registerForm: document.getElementById("registerForm"),
  authMessage: document.getElementById("authMessage"),
  editingUserId: document.getElementById("editingUserId"),
  registerFormTitle: document.getElementById("registerFormTitle"),
  saveUserBtn: document.getElementById("saveUserBtn"),
  cancelEditUserBtn: document.getElementById("cancelEditUserBtn"),
  firstUserHint: document.getElementById("firstUserHint"),
  usersTableBody: document.getElementById("usersTableBody"),
  filteredCountBadge: document.getElementById("filteredCountBadge"),
  searchInput: document.getElementById("searchInput"),
  filterRole: document.getElementById("filterRole"),
  filterStatus: document.getElementById("filterStatus"),
  filterProvince: document.getElementById("filterProvince"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  searchResults: document.getElementById("searchResults"),
  registerName: document.getElementById("registerName"),
  registerUsername: document.getElementById("registerUsername"),
  registerEmail: document.getElementById("registerEmail"),
  registerPhone: document.getElementById("registerPhone"),
  registerRole: document.getElementById("registerRole"),
  registerProvince: document.getElementById("registerProvince"),
  registerZone: document.getElementById("registerZone"),
  registerPassword: document.getElementById("registerPassword"),
  registerPasswordConfirm: document.getElementById("registerPasswordConfirm")
};

const RD_PROVINCES = [
  "Azua",
  "Bahoruco",
  "Barahona",
  "Dajabón",
  "Distrito Nacional",
  "Duarte",
  "Elías Piña",
  "El Seibo",
  "Espaillat",
  "Hato Mayor",
  "Hermanas Mirabal",
  "Independencia",
  "La Altagracia",
  "La Romana",
  "La Vega",
  "María Trinidad Sánchez",
  "Monseñor Nouel",
  "Monte Cristi",
  "Monte Plata",
  "Pedernales",
  "Peravia",
  "Puerto Plata",
  "Samaná",
  "San Cristóbal",
  "San José de Ocoa",
  "San Juan",
  "San Pedro de Macorís",
  "Sánchez Ramírez",
  "Santiago",
  "Santiago Rodríguez",
  "Santo Domingo",
  "Valverde"
];

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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value || "").trim();
}

function formatPhone(value) {
  const digits = String(value || "").replace(/[^\d]/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value) {
  return String(value || "").replace(/[^\d]/g, "").length === 10;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

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

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `status-message show ${type}`;

  setTimeout(() => {
    element.className = "status-message";
    element.textContent = "";
  }, 3500);
}

function getCurrentSession() {
  return getSession();
}

function isAdminGeneral() {
  const session = getCurrentSession();
  return !!session && session.role === "Administrador General";
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

    if (!updatedUser.email) {
      updatedUser.email = "";
      changed = true;
    }

    if (!updatedUser.status) {
      updatedUser.status = "Aprobado";
      changed = true;
    }

    if (!updatedUser.province && RD_PROVINCES.includes(updatedUser.zone)) {
      updatedUser.province = updatedUser.zone;
      changed = true;
    }

    return updatedUser;
  });

  if (changed) {
    setUsers(normalized);

    const session = getSession();
    if (session) {
      const refreshedSession = normalized.find(user => user.id === session.id);
      if (refreshedSession) {
        setSession(refreshedSession);
      }
    }
  }
}

function requireAdminAccess() {
  const session = getCurrentSession();

  if (!session || session.role !== "Administrador General") {
    window.location.href = "index.html";
    return false;
  }

  return true;
}

function updateCurrentUserInfo() {
  const session = getCurrentSession();
  if (!session) return;

  DOM.currentUserInfo.textContent = `${session.name} | ${session.role} | ${session.province || ""} | ${session.zone || ""}`;
}

function updateInitialHint() {
  DOM.firstUserHint.textContent =
    "Desde este módulo puede crear, aprobar, editar o eliminar usuarios del sistema.";
}

function updateRoleOptions() {
  const currentValue = DOM.registerRole.value;

  DOM.registerRole.innerHTML = `
    <option value="">Seleccione</option>
    <option value="Administrador General">Administrador General</option>
    <option value="Coordinador">Coordinador</option>
    <option value="Presidente de Zona">Presidente de Zona</option>
  `;

  const allowedValues = Array.from(DOM.registerRole.options).map(option => option.value);
  if (allowedValues.includes(currentValue)) {
    DOM.registerRole.value = currentValue;
  }
}

function populateProvinceSelects() {
  populateSelect(DOM.registerProvince, RD_PROVINCES, "Seleccione una provincia");
}

function resetUserForm() {
  DOM.registerForm.reset();
  DOM.editingUserId.value = "";
  DOM.registerFormTitle.textContent = "Crear nuevo usuario";
  DOM.saveUserBtn.textContent = "Crear usuario";
  DOM.cancelEditUserBtn.classList.add("hidden");
  DOM.registerProvince.value = "";
  DOM.registerPasswordConfirm.value = "";
  updateRoleOptions();
}

function fillUserForm(user) {
  updateRoleOptions();
  DOM.registerName.value = user.name || "";
  DOM.registerUsername.value = user.username || "";
  DOM.registerEmail.value = user.email || "";
  DOM.registerPhone.value = formatPhone(user.phone || "");
  DOM.registerRole.value = user.role || "";
  DOM.registerProvince.value = user.province || "";
  DOM.registerZone.value = user.zone || "";
  DOM.registerPassword.value = user.password || "";
  DOM.registerPasswordConfirm.value = user.password || "";
  DOM.editingUserId.value = user.id || "";
  DOM.registerFormTitle.textContent = "Editar usuario";
  DOM.saveUserBtn.textContent = "Guardar cambios";
  DOM.cancelEditUserBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

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

function getFilteredUsers() {
  const users = getUsers();
  const q = DOM.searchInput.value.trim().toLowerCase();
  const role = DOM.filterRole.value;
  const status = DOM.filterStatus.value;
  const province = DOM.filterProvince.value;

  return users.filter(user => {
    const matchesSearch =
      !q ||
      String(user.name || "").toLowerCase().includes(q) ||
      String(user.username || "").toLowerCase().includes(q) ||
      String(user.email || "").toLowerCase().includes(q) ||
      String(user.phone || "").toLowerCase().includes(q) ||
      String(user.zone || "").toLowerCase().includes(q) ||
      String(user.province || "").toLowerCase().includes(q) ||
      String(user.role || "").toLowerCase().includes(q) ||
      String(user.status || "").toLowerCase().includes(q);

    const matchesRole = !role || user.role === role;
    const matchesStatus = !status || (user.status || "Aprobado") === status;
    const matchesProvince = !province || user.province === province;

    return matchesSearch && matchesRole && matchesStatus && matchesProvince;
  });
}

function fillFilterOptions() {
  const users = getUsers();

  populateSelect(
    DOM.filterProvince,
    uniqueSortedValues(users.map(user => user.province)),
    "Todas"
  );
}

function updateStats() {
  const users = getUsers();
  const approved = users.filter(user => (user.status || "Aprobado") === "Aprobado").length;
  const pending = users.filter(user => (user.status || "Aprobado") === "Pendiente").length;
  const provinces = new Set(
    users.map(user => user.province).filter(Boolean).map(value => value.trim())
  );

  DOM.totalUsers.textContent = users.length;
  DOM.approvedUsers.textContent = approved;
  DOM.pendingUsers.textContent = pending;
  DOM.activeProvinces.textContent = provinces.size;
}

function renderSearchResults() {
  const users = getFilteredUsers()
    .sort((a, b) => a.name.localeCompare(b.name, "es"))
    .slice(0, 8);

  DOM.searchResults.innerHTML = "";

  if (!users.length) {
    DOM.searchResults.innerHTML = `
      <div class="result-item">
        <p>No se encontraron usuarios con los criterios seleccionados.</p>
      </div>
    `;
    return;
  }

  users.forEach(user => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.innerHTML = `
      <h4>${escapeHtml(user.name)}</h4>
      <p><strong>Usuario:</strong> ${escapeHtml(user.username)}</p>
      <p><strong>Rol:</strong> ${escapeHtml(user.role)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(user.email || "")}</p>
      <p><strong>Provincia:</strong> ${escapeHtml(user.province || "")}</p>
      <p><strong>Zona:</strong> ${escapeHtml(user.zone || "")}</p>
      <p><strong>Estado:</strong> ${escapeHtml(user.status || "Aprobado")}</p>
    `;
    DOM.searchResults.appendChild(item);
  });
}

function renderUsersTable() {
  const users = getFilteredUsers().sort((a, b) => {
    if ((a.status || "Aprobado") !== (b.status || "Aprobado")) {
      return (a.status || "Aprobado").localeCompare(b.status || "Aprobado", "es");
    }

    if (a.role !== b.role) {
      return a.role.localeCompare(b.role, "es");
    }

    return a.name.localeCompare(b.name, "es");
  });

  DOM.usersTableBody.innerHTML = "";

  if (!users.length) {
    DOM.usersTableBody.innerHTML = `
      <tr>
        <td colspan="9">No hay usuarios para mostrar con los filtros seleccionados.</td>
      </tr>
    `;
    DOM.filteredCountBadge.textContent = "0 resultados";
    return;
  }

  users.forEach(user => {
    const row = document.createElement("tr");
    const statusText = user.status || "Aprobado";
    const statusClass = statusText.toLowerCase();

    let actionsHtml = `
      <div class="actions-wrap">
        <button class="action-btn edit" type="button" data-action="edit-user" data-id="${escapeHtml(user.id)}">Editar</button>
        <button class="action-btn delete" type="button" data-action="delete-user" data-id="${escapeHtml(user.id)}">Eliminar</button>
      </div>
    `;

    if (statusText === "Pendiente") {
      actionsHtml = `
        <div class="actions-wrap">
          <button class="action-btn approve" type="button" data-action="approve-user" data-id="${escapeHtml(user.id)}">Aprobar</button>
          <button class="action-btn edit" type="button" data-action="edit-user" data-id="${escapeHtml(user.id)}">Editar</button>
          <button class="action-btn delete" type="button" data-action="delete-user" data-id="${escapeHtml(user.id)}">Eliminar</button>
        </div>
      `;
    }

    row.innerHTML = `
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.username)}</td>
      <td>${escapeHtml(user.email || "")}</td>
      <td>${escapeHtml(user.role)}</td>
      <td>${escapeHtml(user.phone || "")}</td>
      <td>${escapeHtml(user.province || "")}</td>
      <td>${escapeHtml(user.zone || "")}</td>
      <td><span class="status-pill ${escapeHtml(statusClass)}">${escapeHtml(statusText)}</span></td>
      <td class="actions-cell">${actionsHtml}</td>
    `;

    DOM.usersTableBody.appendChild(row);
  });

  DOM.filteredCountBadge.textContent = `${users.length} resultado${users.length !== 1 ? "s" : ""}`;
}

function renderAll() {
  updateStats();
  fillFilterOptions();
  renderSearchResults();
  renderUsersTable();
}

DOM.registerPhone.addEventListener("input", e => {
  e.target.value = formatPhone(e.target.value);
});

DOM.cancelEditUserBtn.addEventListener("click", resetUserForm);

DOM.registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const users = getUsers();

  const name = normalizeText(DOM.registerName.value);
  const username = normalizeText(DOM.registerUsername.value);
  const email = normalizeText(DOM.registerEmail.value).toLowerCase();
  const phone = formatPhone(DOM.registerPhone.value);
  const role = normalizeText(DOM.registerRole.value);
  const province = normalizeText(DOM.registerProvince.value);
  const zone = normalizeText(DOM.registerZone.value);
  const password = normalizeText(DOM.registerPassword.value);
  const passwordConfirm = normalizeText(DOM.registerPasswordConfirm.value);
  const editingId = normalizeText(DOM.editingUserId.value);

  if (!name || !username || !email || !phone || !role || !province || !zone || !password || !passwordConfirm) {
    showMessage(DOM.authMessage, "Complete todos los campos del usuario.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(DOM.authMessage, "Ingrese un correo personal válido.", "error");
    return;
  }

  if (!isValidPhone(phone)) {
    showMessage(DOM.authMessage, "Ingrese un teléfono válido de 10 dígitos.", "error");
    return;
  }

  if (password.length < 4) {
    showMessage(DOM.authMessage, "La contraseña debe tener al menos 4 caracteres.", "error");
    return;
  }

  if (password !== passwordConfirm) {
    showMessage(DOM.authMessage, "Las contraseñas no coinciden.", "error");
    return;
  }

  if (!editingId) {
    const duplicatedUsername = users.some(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
    const duplicatedEmail = users.some(
      user => String(user.email || "").toLowerCase() === email
    );

    if (duplicatedUsername) {
      showMessage(DOM.authMessage, "Ese nombre de usuario ya existe.", "error");
      return;
    }

    if (duplicatedEmail) {
      showMessage(DOM.authMessage, "Ese correo ya está registrado.", "error");
      return;
    }

    users.push({
      id: generateId(),
      name,
      username,
      email,
      phone,
      role,
      province,
      zone,
      password,
      status: "Aprobado"
    });

    setUsers(users);
    resetUserForm();
    showMessage(DOM.authMessage, "Usuario creado correctamente.", "success");
    renderAll();
    return;
  }

  const duplicatedUsername = users.some(
    user => user.username.toLowerCase() === username.toLowerCase() && user.id !== editingId
  );
  const duplicatedEmail = users.some(
    user => String(user.email || "").toLowerCase() === email && user.id !== editingId
  );

  if (duplicatedUsername) {
    showMessage(DOM.authMessage, "Ese nombre de usuario ya existe.", "error");
    return;
  }

  if (duplicatedEmail) {
    showMessage(DOM.authMessage, "Ese correo ya está registrado.", "error");
    return;
  }

  const updatedUsers = users.map(user => {
    if (user.id !== editingId) return user;

    return {
      ...user,
      name,
      username,
      email,
      phone,
      role,
      province,
      zone,
      password
    };
  });

  setUsers(updatedUsers);

  const session = getSession();
  if (session && session.id === editingId) {
    const refreshed = updatedUsers.find(user => user.id === editingId);
    if (refreshed) {
      setSession(refreshed);
      updateCurrentUserInfo();
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
  showMessage(DOM.authMessage, "Usuario actualizado correctamente.", "success");
  renderAll();
});

DOM.usersTableBody.addEventListener("click", function (e) {
  const target = e.target.closest("button");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) return;

  const users = getUsers();
  const user = users.find(item => item.id === id);

  if (!user) {
    alert("No se encontró el usuario.");
    return;
  }

  if (action === "approve-user") {
    const updatedUsers = users.map(item => {
      if (item.id !== id) return item;
      return { ...item, status: "Aprobado" };
    });

    setUsers(updatedUsers);
    showMessage(DOM.authMessage, "Usuario aprobado correctamente.", "success");
    renderAll();
    return;
  }

  if (action === "edit-user") {
    fillUserForm(user);
    return;
  }

  if (action === "delete-user") {
    const session = getCurrentSession();

    if (session && session.id === id) {
      alert("No puedes eliminar el usuario con el que estás autenticado.");
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

    if (DOM.editingUserId.value === id) {
      resetUserForm();
    }

    showMessage(DOM.authMessage, "Usuario eliminado correctamente.", "success");
    renderAll();
  }
});

function clearFilters() {
  DOM.searchInput.value = "";
  DOM.filterRole.value = "";
  DOM.filterStatus.value = "";
  DOM.filterProvince.value = "";
  renderSearchResults();
  renderUsersTable();
}

[
  DOM.searchInput,
  DOM.filterRole,
  DOM.filterStatus,
  DOM.filterProvince
].forEach(element => {
  element.addEventListener("input", () => {
    renderSearchResults();
    renderUsersTable();
  });

  element.addEventListener("change", () => {
    renderSearchResults();
    renderUsersTable();
  });
});

DOM.clearFiltersBtn.addEventListener("click", clearFilters);

DOM.backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

DOM.logoutBtn.addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});

normalizeUsers();

if (requireAdminAccess()) {
  populateProvinceSelects();
  updateRoleOptions();
  updateInitialHint();
  resetUserForm();
  updateCurrentUserInfo();
  renderAll();
}