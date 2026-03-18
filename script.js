const DOM = {
  showLogin: document.getElementById("showLogin"),
  showRegister: document.getElementById("showRegister"),
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),
  authMessage: document.getElementById("authMessage"),
  authSection: document.getElementById("authSection"),
  dashboardSection: document.getElementById("dashboardSection"),
  currentUserInfo: document.getElementById("currentUserInfo"),
  logoutBtn: document.getElementById("logoutBtn"),
  exportBtn: document.getElementById("exportBtn"),
  manageUsersBtn: document.getElementById("manageUsersBtn"),
  voterForm: document.getElementById("voterForm"),
  voterMessage: document.getElementById("voterMessage"),
  votersTableBody: document.getElementById("votersTableBody"),
  usersTableBody: document.getElementById("usersTableBody"),
  searchResults: document.getElementById("searchResults"),
  filteredCountBadge: document.getElementById("filteredCountBadge"),
  userPermissionsNote: document.getElementById("userPermissionsNote"),
  searchInput: document.getElementById("searchInput"),
  filterProvince: document.getElementById("filterProvince"),
  filterMunicipio: document.getElementById("filterMunicipio"),
  filterSector: document.getElementById("filterSector"),
  filterMesa: document.getElementById("filterMesa"),
  filterRole: document.getElementById("filterRole"),
  filterRegistrar: document.getElementById("filterRegistrar"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  totalVoters: document.getElementById("totalVoters"),
  totalUsers: document.getElementById("totalUsers"),
  todayVoters: document.getElementById("todayVoters"),
  activeProvinces: document.getElementById("activeProvinces"),
  editingUserId: document.getElementById("editingUserId"),
  registerFormTitle: document.getElementById("registerFormTitle"),
  saveUserBtn: document.getElementById("saveUserBtn"),
  cancelEditUserBtn: document.getElementById("cancelEditUserBtn"),
  firstUserHint: document.getElementById("firstUserHint"),
  registerProvince: document.getElementById("registerProvince"),
  voterProvince: document.getElementById("voterProvince"),
  provinceChart: document.getElementById("provinceChart"),
  provinceRanking: document.getElementById("provinceRanking"),
  chartSummaryBadge: document.getElementById("chartSummaryBadge"),
  usersSection: document.getElementById("usersSection"),
  voterActionsHead: document.getElementById("voterActionsHead"),
  editingVoterId: document.getElementById("editingVoterId"),
  voterFormTitle: document.getElementById("voterFormTitle"),
  voterFormDescription: document.getElementById("voterFormDescription"),
  saveVoterBtn: document.getElementById("saveVoterBtn"),
  cancelEditVoterBtn: document.getElementById("cancelEditVoterBtn")
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

function normalizeCedula(value) {
  return String(value || "").replace(/[^\d]/g, "");
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

function formatCedula(value) {
  const digits = String(value || "").replace(/[^\d]/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10)}`;
}

function isValidCedula(value) {
  return String(value || "").replace(/[^\d]/g, "").length === 11;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function nowISO() {
  return new Date().toISOString();
}

function formatDateDisplay(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function getTodayDateKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function getDateKey(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function populateProvinceSelects() {
  populateSelect(DOM.registerProvince, RD_PROVINCES, "Seleccione una provincia");
  populateSelect(DOM.voterProvince, RD_PROVINCES, "Seleccione una provincia");
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

    if (!updatedUser.province && RD_PROVINCES.includes(updatedUser.zone)) {
      updatedUser.province = updatedUser.zone;
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
    DOM.showLogin.classList.add("active");
    DOM.showRegister.classList.remove("active");
    DOM.loginForm.classList.add("active");
    DOM.registerForm.classList.remove("active");
  } else {
    DOM.showRegister.classList.add("active");
    DOM.showLogin.classList.remove("active");
    DOM.registerForm.classList.add("active");
    DOM.loginForm.classList.remove("active");
  }
}

DOM.showLogin.addEventListener("click", () => switchTab("login"));
DOM.showRegister.addEventListener("click", () => switchTab("register"));

function getCurrentSession() {
  return getSession();
}

function isAdminGeneral() {
  const session = getCurrentSession();
  return !!session && session.role === "Administrador General";
}

function updateAdminAccess() {
  const isAdmin = isAdminGeneral();

  if (DOM.manageUsersBtn) {
    DOM.manageUsersBtn.classList.toggle("hidden", !isAdmin);
  }
}

function goToUsersModule() {
  const session = getCurrentSession();

  if (!session || session.role !== "Administrador General") {
    alert("Solo un Administrador General puede acceder a la gestión de usuarios.");
    return;
  }

  window.location.href = "usuarios.html";
}

if (DOM.manageUsersBtn) {
  DOM.manageUsersBtn.addEventListener("click", goToUsersModule);
}

function updateRoleOptions() {
  const roleSelect = document.getElementById("registerRole");
  if (!roleSelect) return;

  const users = getUsers();
  const session = getCurrentSession();
  const currentValue = roleSelect.value;
  const isFirstUser = users.length === 0;
  const canCreateAdmin = isFirstUser || (session && session.role === "Administrador General");

  roleSelect.innerHTML = `<option value="">Seleccione</option>`;

  if (canCreateAdmin) {
    roleSelect.innerHTML += `<option value="Administrador General">Administrador General</option>`;
  }

  roleSelect.innerHTML += `<option value="Coordinador">Coordinador</option>`;
  roleSelect.innerHTML += `<option value="Presidente de Zona">Presidente de Zona</option>`;

  const allowedValues = Array.from(roleSelect.options).map(option => option.value);
  if (allowedValues.includes(currentValue)) {
    roleSelect.value = currentValue;
  }
}

function updateRegisterTabVisibility() {
  const users = getUsers();
  const session = getCurrentSession();
  const isFirstUser = users.length === 0;
  const shouldShowRegister = isFirstUser || !session;

  if (shouldShowRegister) {
    DOM.showRegister.classList.remove("hidden");
  } else {
    DOM.showRegister.classList.add("hidden");
    switchTab("login");
  }
}

function updateInitialHint() {
  const users = getUsers();
  const session = getCurrentSession();

  if (users.length === 0) {
    DOM.firstUserHint.textContent =
      "Como configuración inicial, el primer usuario que se cree puede establecerse como Administrador General.";
    return;
  }

  if (session && session.role === "Administrador General") {
    DOM.firstUserHint.textContent =
      "El módulo interno de usuarios está disponible solo para administradores generales.";
    return;
  }

  DOM.firstUserHint.textContent =
    "Los coordinadores y presidentes de zona se registran desde aquí y quedan pendientes de autorización.";
}

function resetUserForm() {
  DOM.registerForm.reset();
  DOM.editingUserId.value = "";
  DOM.registerFormTitle.textContent = "Crear nuevo usuario";
  DOM.saveUserBtn.textContent = "Crear usuario";
  DOM.cancelEditUserBtn.classList.add("hidden");
  DOM.registerProvince.value = "";
  document.getElementById("registerPasswordConfirm").value = "";
  updateRoleOptions();
}

function fillUserForm(user) {
  updateRoleOptions();
  document.getElementById("registerName").value = user.name || "";
  document.getElementById("registerUsername").value = user.username || "";
  document.getElementById("registerRole").value = user.role || "";
  document.getElementById("registerEmail").value = user.email || "";
  document.getElementById("registerPhone").value = formatPhone(user.phone || "");
  document.getElementById("registerProvince").value = user.province || "";
  document.getElementById("registerZone").value = user.zone || "";
  document.getElementById("registerPassword").value = user.password || "";
  document.getElementById("registerPasswordConfirm").value = user.password || "";

  DOM.editingUserId.value = user.id || "";
  DOM.registerFormTitle.textContent = "Editar usuario";
  DOM.saveUserBtn.textContent = "Guardar cambios";
  DOM.cancelEditUserBtn.classList.remove("hidden");
  switchTab("register");
}

function resetVoterForm() {
  DOM.voterForm.reset();
  DOM.editingVoterId.value = "";
  DOM.voterProvince.value = "";
  DOM.voterFormTitle.textContent = "Registrar información";
  DOM.voterFormDescription.textContent = "Complete los datos requeridos de forma organizada y precisa.";
  DOM.saveVoterBtn.textContent = "Guardar registro";
  DOM.cancelEditVoterBtn.classList.add("hidden");
}

function fillVoterForm(voter) {
  document.getElementById("voterName").value = voter.name || "";
  document.getElementById("voterCedula").value = formatCedula(voter.cedula || "");
  document.getElementById("voterPhone").value = formatPhone(voter.phone || "");
  document.getElementById("voterProvince").value = voter.province || "";
  document.getElementById("voterMunicipio").value = voter.municipio || "";
  document.getElementById("voterSector").value = voter.sector || "";
  document.getElementById("voterMesa").value = voter.mesa || "";
  document.getElementById("voterRecinto").value = voter.recinto || "";

  DOM.editingVoterId.value = voter.id || "";
  DOM.voterFormTitle.textContent = "Editar registro";
  DOM.voterFormDescription.textContent = "Solo el Administrador General puede modificar un registro existente.";
  DOM.saveVoterBtn.textContent = "Guardar cambios";
  DOM.cancelEditVoterBtn.classList.remove("hidden");
}

DOM.cancelEditUserBtn.addEventListener("click", resetUserForm);
DOM.cancelEditVoterBtn.addEventListener("click", resetVoterForm);

document.getElementById("registerPhone").addEventListener("input", e => {
  e.target.value = formatPhone(e.target.value);
});

document.getElementById("voterPhone").addEventListener("input", e => {
  e.target.value = formatPhone(e.target.value);
});

document.getElementById("voterCedula").addEventListener("input", e => {
  e.target.value = formatCedula(e.target.value);
});

DOM.registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const users = getUsers();
  const session = getCurrentSession();

  const name = normalizeText(document.getElementById("registerName").value);
  const username = normalizeText(document.getElementById("registerUsername").value);
  const role = normalizeText(document.getElementById("registerRole").value);
  const email = normalizeText(document.getElementById("registerEmail").value).toLowerCase();
  const phone = formatPhone(document.getElementById("registerPhone").value);
  const province = normalizeText(document.getElementById("registerProvince").value);
  const zone = normalizeText(document.getElementById("registerZone").value);
  const password = normalizeText(document.getElementById("registerPassword").value);
  const passwordConfirm = normalizeText(document.getElementById("registerPasswordConfirm").value);
  const editingId = normalizeText(DOM.editingUserId.value);

  if (!name || !username || !role || !email || !phone || !province || !zone || !password || !passwordConfirm) {
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

    const firstUser = users.length === 0;
    const createdByAdmin = !!session && isAdminGeneral();

    if (!firstUser && role === "Administrador General" && !createdByAdmin) {
      showMessage(DOM.authMessage, "Solo un Administrador General puede crear otro Administrador General.", "error");
      return;
    }

    const userStatus = firstUser || createdByAdmin ? "Aprobado" : "Pendiente";
    const roleToSave = firstUser ? "Administrador General" : role;

    users.push({
      id: generateId(),
      name,
      username,
      role: roleToSave,
      email,
      phone,
      province,
      zone,
      password,
      status: userStatus
    });

    setUsers(users);
    resetUserForm();
    updateInitialHint();
    updateRegisterTabVisibility();
    updateAdminAccess();

    if (userStatus === "Pendiente") {
      showMessage(DOM.authMessage, "Usuario registrado en estado pendiente de aprobación.", "success");
    } else {
      showMessage(DOM.authMessage, "Usuario registrado correctamente.", "success");
    }

    fillFilterOptions();
    renderUsers();
    updateStats();
    return;
  }

  if (!session || !isAdminGeneral()) {
    showMessage(DOM.authMessage, "Solo un Administrador General puede editar usuarios.", "error");
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
      role,
      email,
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
  showMessage(DOM.authMessage, "Usuario actualizado correctamente.", "success");

  fillFilterOptions();
  renderAll();
  updateRegisterTabVisibility();
  updateAdminAccess();

  if (getSession()) {
    loadDashboard();
  }
});

DOM.loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = normalizeText(document.getElementById("loginUser").value);
  const password = normalizeText(document.getElementById("loginPassword").value);

  const users = getUsers();
  const user = users.find(
    item => item.username === username && item.password === password
  );

  if (!user) {
    showMessage(DOM.authMessage, "Credenciales incorrectas.", "error");
    return;
  }

  if (user.status && user.status !== "Aprobado") {
    showMessage(DOM.authMessage, "Tu usuario aún está pendiente de aprobación.", "error");
    return;
  }

  setSession(user);
  updateRegisterTabVisibility();
  updateRoleOptions();
  updateInitialHint();
  updateAdminAccess();
  loadDashboard();
});

DOM.logoutBtn.addEventListener("click", () => {
  clearSession();
  resetVoterForm();
  updateRegisterTabVisibility();
  updateRoleOptions();
  updateInitialHint();
  updateAdminAccess();
  DOM.dashboardSection.classList.add("hidden");
  DOM.authSection.classList.remove("hidden");
});

DOM.voterForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const session = getCurrentSession();
  if (!session) return;

  const name = normalizeText(document.getElementById("voterName").value);
  const cedula = formatCedula(document.getElementById("voterCedula").value);
  const phone = formatPhone(document.getElementById("voterPhone").value);
  const province = normalizeText(document.getElementById("voterProvince").value);
  const municipio = normalizeText(document.getElementById("voterMunicipio").value);
  const sector = normalizeText(document.getElementById("voterSector").value);
  const mesa = normalizeText(document.getElementById("voterMesa").value);
  const recinto = normalizeText(document.getElementById("voterRecinto").value);
  const editingId = normalizeText(DOM.editingVoterId.value);

  if (!name || !cedula || !phone || !province || !municipio || !sector || !mesa || !recinto) {
    showMessage(DOM.voterMessage, "Complete todos los campos requeridos.", "error");
    return;
  }

  if (!isValidCedula(cedula)) {
    showMessage(DOM.voterMessage, "Ingrese una cédula válida de 11 dígitos.", "error");
    return;
  }

  if (!isValidPhone(phone)) {
    showMessage(DOM.voterMessage, "Ingrese un teléfono válido de 10 dígitos.", "error");
    return;
  }

  const voters = getVoters();
  const normalizedCedulaValue = normalizeCedula(cedula);

  if (!editingId) {
    if (voters.some(voter => normalizeCedula(voter.cedula) === normalizedCedulaValue)) {
      showMessage(DOM.voterMessage, "Ya existe un registro con esa cédula.", "error");
      return;
    }

    const createdAtISO = nowISO();

    voters.push({
      id: generateId(),
      name,
      cedula,
      phone,
      province,
      municipio,
      sector,
      mesa,
      recinto,
      registeredById: session.id,
      registeredBy: session.username,
      registeredByName: session.name,
      registeredByRole: session.role,
      registeredByProvince: session.province,
      registeredByZone: session.zone,
      createdAtISO,
      createdAt: formatDateDisplay(createdAtISO),
      updatedAtISO: createdAtISO,
      updatedAt: formatDateDisplay(createdAtISO)
    });

    setVoters(voters);
    resetVoterForm();
    showMessage(DOM.voterMessage, "Registro guardado correctamente.", "success");

    fillFilterOptions();
    renderAll();
    return;
  }

  if (!isAdminGeneral()) {
    showMessage(DOM.voterMessage, "Solo un Administrador General puede editar registros.", "error");
    return;
  }

  const duplicatedCedula = voters.some(
    voter => normalizeCedula(voter.cedula) === normalizedCedulaValue && voter.id !== editingId
  );

  if (duplicatedCedula) {
    showMessage(DOM.voterMessage, "Ya existe otro registro con esa cédula.", "error");
    return;
  }

  const updatedAtISO = nowISO();

  const updatedVoters = voters.map(voter => {
    if (voter.id !== editingId) return voter;

    return {
      ...voter,
      name,
      cedula,
      phone,
      province,
      municipio,
      sector,
      mesa,
      recinto,
      updatedAtISO,
      updatedAt: formatDateDisplay(updatedAtISO)
    };
  });

  setVoters(updatedVoters);
  resetVoterForm();
  showMessage(DOM.voterMessage, "Registro actualizado correctamente.", "success");
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
    return users.filter(user => user.role !== "Administrador General");
  }

  return [];
}

function renderUsers() {
  const users = getVisibleUsers();
  const session = getCurrentSession();
  DOM.usersTableBody.innerHTML = "";

  if (session && session.role === "Administrador General") {
    DOM.userPermissionsNote.textContent = "Gestión de coordinadores y presidentes de zona";
  } else {
    DOM.userPermissionsNote.textContent = "Sin acceso a perfiles administrativos";
  }

  if (!session || session.role !== "Administrador General") {
    DOM.usersSection.classList.add("section-hidden");
    return;
  }

  DOM.usersSection.classList.remove("section-hidden");

  const orderedUsers = [...users].sort((a, b) => {
    if (a.role !== b.role) return a.role.localeCompare(b.role, "es");
    return a.name.localeCompare(b.name, "es");
  });

  if (!orderedUsers.length) {
    DOM.usersTableBody.innerHTML = `
      <tr>
        <td colspan="9">No hay usuarios para mostrar.</td>
      </tr>
    `;
    return;
  }

  orderedUsers.forEach(user => {
    const row = document.createElement("tr");
    const statusClass = String(user.status || "Aprobado").toLowerCase();

    let actionsHtml = `
      <div class="actions-wrap">
        <button class="action-btn edit" type="button" data-action="edit-user" data-id="${escapeHtml(user.id)}">Editar</button>
        <button class="action-btn delete" type="button" data-action="delete-user" data-id="${escapeHtml(user.id)}">Eliminar</button>
      </div>
    `;

    if (user.status === "Pendiente") {
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
      <td>${escapeHtml(user.phone)}</td>
      <td>${escapeHtml(user.province || "")}</td>
      <td>${escapeHtml(user.zone || "")}</td>
      <td><span class="status-pill ${escapeHtml(statusClass)}">${escapeHtml(user.status || "Aprobado")}</span></td>
      <td class="actions-cell">${actionsHtml}</td>
    `;

    DOM.usersTableBody.appendChild(row);
  });
}

DOM.usersTableBody.addEventListener("click", function (e) {
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

  if (action === "approve-user") {
    const updatedUsers = users.map(item => {
      if (item.id !== id) return item;
      return { ...item, status: "Aprobado" };
    });
    setUsers(updatedUsers);
    showMessage(DOM.authMessage, "Usuario aprobado correctamente.", "success");
    renderUsers();
    updateStats();
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
    fillFilterOptions();
    renderAll();
    updateRegisterTabVisibility();
    updateAdminAccess();
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
  const allUsers = getUsers();
  const session = getCurrentSession();

  populateSelect(
    DOM.filterProvince,
    uniqueSortedValues(visibleVoters.map(voter => voter.province)),
    "Todas"
  );

  populateSelect(
    DOM.filterMunicipio,
    uniqueSortedValues(visibleVoters.map(voter => voter.municipio)),
    "Todos"
  );

  populateSelect(
    DOM.filterSector,
    uniqueSortedValues(visibleVoters.map(voter => voter.sector)),
    "Todos"
  );

  populateSelect(
    DOM.filterMesa,
    uniqueSortedValues(visibleVoters.map(voter => voter.mesa)),
    "Todas"
  );

  let registrarUsers = [];

  if (session && session.role === "Administrador General") {
    registrarUsers = allUsers.filter(user => user.status === "Aprobado");
  } else if (session) {
    registrarUsers = allUsers.filter(user => user.id === session.id);
  }

  populateSelect(
    DOM.filterRegistrar,
    uniqueSortedValues(registrarUsers.map(user => user.username)),
    "Todos"
  );
}

function getFilteredVoters() {
  const voters = getVisibleVoters();
  const q = DOM.searchInput.value.trim().toLowerCase();
  const province = DOM.filterProvince.value;
  const municipio = DOM.filterMunicipio.value;
  const sector = DOM.filterSector.value;
  const mesa = DOM.filterMesa.value;
  const role = DOM.filterRole.value;
  const registrar = DOM.filterRegistrar.value;

  return voters.filter(voter => {
    const matchesSearch =
      !q ||
      String(voter.name || "").toLowerCase().includes(q) ||
      String(voter.cedula || "").toLowerCase().includes(q) ||
      String(voter.phone || "").toLowerCase().includes(q) ||
      String(voter.province || "").toLowerCase().includes(q) ||
      String(voter.municipio || "").toLowerCase().includes(q) ||
      String(voter.sector || "").toLowerCase().includes(q) ||
      String(voter.mesa || "").toLowerCase().includes(q) ||
      String(voter.recinto || "").toLowerCase().includes(q) ||
      String(voter.registeredBy || "").toLowerCase().includes(q) ||
      String(voter.registeredByName || "").toLowerCase().includes(q) ||
      String(voter.registeredByRole || "").toLowerCase().includes(q) ||
      String(voter.registeredByZone || "").toLowerCase().includes(q);

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
  const ordered = [...filtered].sort((a, b) => {
    const aDate = new Date(a.createdAtISO || 0).getTime();
    const bDate = new Date(b.createdAtISO || 0).getTime();
    return bDate - aDate;
  });

  DOM.votersTableBody.innerHTML = "";

  if (isAdminGeneral()) {
    DOM.voterActionsHead.textContent = "Acciones";
  } else {
    DOM.voterActionsHead.textContent = "Estado";
  }

  if (!ordered.length) {
    DOM.votersTableBody.innerHTML = `
      <tr>
        <td colspan="13">No hay registros para mostrar con los filtros seleccionados.</td>
      </tr>
    `;
    DOM.filteredCountBadge.textContent = "0 resultados";
    return;
  }

  ordered.forEach(voter => {
    const row = document.createElement("tr");

    const actionsHtml = isAdminGeneral()
      ? `
        <div class="actions-wrap">
          <button class="action-btn edit" type="button" data-action="edit-voter" data-id="${escapeHtml(voter.id)}">Editar</button>
          <button class="action-btn delete" type="button" data-action="delete-voter" data-id="${escapeHtml(voter.id)}">Eliminar</button>
        </div>
      `
      : `<span class="readonly-note">Solo lectura</span>`;

    row.innerHTML = `
      <td>${escapeHtml(voter.name)}</td>
      <td>${escapeHtml(voter.cedula)}</td>
      <td>${escapeHtml(voter.phone)}</td>
      <td>${escapeHtml(voter.province)}</td>
      <td>${escapeHtml(voter.municipio)}</td>
      <td>${escapeHtml(voter.sector)}</td>
      <td>${escapeHtml(voter.mesa)}</td>
      <td>${escapeHtml(voter.recinto)}</td>
      <td>${escapeHtml(voter.registeredByName)} (${escapeHtml(voter.registeredBy)})</td>
      <td>${escapeHtml(voter.registeredByRole)}</td>
      <td>${escapeHtml(voter.registeredByZone)}</td>
      <td>${escapeHtml(voter.updatedAt || voter.createdAt)}</td>
      <td class="actions-cell">${actionsHtml}</td>
    `;
    DOM.votersTableBody.appendChild(row);
  });

  DOM.filteredCountBadge.textContent = `${ordered.length} resultado${ordered.length !== 1 ? "s" : ""}`;
}

DOM.votersTableBody.addEventListener("click", function (e) {
  const target = e.target.closest("button");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) return;

  if (!isAdminGeneral()) {
    alert("Solo un Administrador General puede gestionar registros.");
    return;
  }

  const voters = getVoters();
  const voter = voters.find(item => item.id === id);

  if (!voter) {
    alert("No se encontró el registro.");
    return;
  }

  if (action === "edit-voter") {
    fillVoterForm(voter);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (action === "delete-voter") {
    const confirmed = confirm("¿Deseas eliminar este registro?");
    if (!confirmed) return;

    const updatedVoters = voters.filter(item => item.id !== id);
    setVoters(updatedVoters);

    if (DOM.editingVoterId.value === id) {
      resetVoterForm();
    }

    showMessage(DOM.voterMessage, "Registro eliminado correctamente.", "success");
    fillFilterOptions();
    renderAll();
  }
});

function renderSearchResults() {
  const filtered = getFilteredVoters();
  const ordered = [...filtered]
    .sort((a, b) => {
      const aDate = new Date(a.createdAtISO || 0).getTime();
      const bDate = new Date(b.createdAtISO || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 12);

  DOM.searchResults.innerHTML = "";

  if (!ordered.length) {
    DOM.searchResults.innerHTML = `
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
      <h4>${escapeHtml(voter.name)}</h4>
      <p><strong>Cédula:</strong> ${escapeHtml(voter.cedula)}</p>
      <p><strong>Ubicación:</strong> ${escapeHtml(voter.sector)}, ${escapeHtml(voter.municipio)}, ${escapeHtml(voter.province)}</p>
      <p><strong>Mesa:</strong> ${escapeHtml(voter.mesa)} | <strong>Recinto:</strong> ${escapeHtml(voter.recinto)}</p>
      <p><strong>Registrado por:</strong> ${escapeHtml(voter.registeredByName)} (${escapeHtml(voter.registeredBy)})</p>
      <p><strong>Rol:</strong> ${escapeHtml(voter.registeredByRole)} | <strong>Zona:</strong> ${escapeHtml(voter.registeredByZone)}</p>
      <p><strong>Última fecha:</strong> ${escapeHtml(voter.updatedAt || voter.createdAt)}</p>
    `;
    DOM.searchResults.appendChild(item);
  });
}

function updateStats() {
  const voters = getVisibleVoters();
  const users = getVisibleUsers();

  DOM.totalVoters.textContent = voters.length;
  DOM.totalUsers.textContent = users.length;

  const todayKey = getTodayDateKey();
  const todayCount = voters.filter(voter => {
    const sourceDate = voter.createdAtISO || voter.createdAt || voter.id;
    return getDateKey(sourceDate) === todayKey;
  }).length;

  DOM.todayVoters.textContent = todayCount;

  const provinces = new Set(
    voters
      .map(voter => voter.province)
      .filter(Boolean)
      .map(value => value.trim())
  );

  DOM.activeProvinces.textContent = provinces.size;
}

function getProvinceCounts() {
  const voters = getVisibleVoters();
  const counts = {};

  voters.forEach(voter => {
    const province = normalizeText(voter.province);
    if (!province) return;
    counts[province] = (counts[province] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count || a.province.localeCompare(b.province, "es"));
}

function renderProvinceRanking() {
  const provinceCounts = getProvinceCounts();
  DOM.provinceRanking.innerHTML = "";

  if (!provinceCounts.length) {
    DOM.provinceRanking.innerHTML = `
      <div class="result-item">
        <p>Aún no hay provincias registradas para mostrar.</p>
      </div>
    `;
    DOM.chartSummaryBadge.textContent = "0 provincias activas";
    return;
  }

  DOM.chartSummaryBadge.textContent = `${provinceCounts.length} provincia${provinceCounts.length !== 1 ? "s" : ""} activas`;

  provinceCounts.slice(0, 8).forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "ranking-item";
    div.innerHTML = `
      <div class="ranking-item-left">
        <div class="ranking-number">${index + 1}</div>
        <div>
          <h4>${escapeHtml(item.province)}</h4>
          <p>Registros visibles en esta provincia</p>
        </div>
      </div>
      <div class="ranking-count">${item.count}</div>
    `;
    DOM.provinceRanking.appendChild(div);
  });
}

function drawProvinceChart() {
  const canvas = DOM.provinceChart;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const data = getProvinceCounts().slice(0, 10);

  const parentWidth = canvas.parentElement.clientWidth;
  const width = Math.max(parentWidth - 10, 300);
  const height = 320;

  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  ctx.clearRect(0, 0, width, height);

  if (!data.length) {
    ctx.fillStyle = "#61758f";
    ctx.font = "16px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("Aún no hay datos para mostrar en el gráfico.", width / 2, height / 2);
    return;
  }

  const padding = { top: 20, right: 20, bottom: 70, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...data.map(item => item.count), 1);
  const stepX = chartWidth / data.length;
  const barWidth = Math.min(42, stepX * 0.56);

  ctx.strokeStyle = "#e6edf6";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    const value = Math.round(maxValue - (maxValue / 4) * i);
    ctx.fillStyle = "#7f91a8";
    ctx.font = "12px Segoe UI";
    ctx.textAlign = "right";
    ctx.fillText(String(value), padding.left - 8, y + 4);
  }

  data.forEach((item, index) => {
    const x = padding.left + stepX * index + (stepX - barWidth) / 2;
    const barHeight = (item.count / maxValue) * chartHeight;
    const y = padding.top + chartHeight - barHeight;

    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, "#0a4a8a");
    gradient.addColorStop(1, "#ef2d26");

    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, barWidth, barHeight, 12, true, false);

    ctx.fillStyle = "#102b4c";
    ctx.font = "700 12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(String(item.count), x + barWidth / 2, y - 8);

    const label = item.province.length > 12 ? `${item.province.slice(0, 12)}…` : item.province;
    ctx.save();
    ctx.translate(x + barWidth / 2, padding.top + chartHeight + 16);
    ctx.rotate(-Math.PI / 6);
    ctx.fillStyle = "#5f728b";
    ctx.font = "12px Segoe UI";
    ctx.textAlign = "right";
    ctx.fillText(label, 0, 0);
    ctx.restore();
  });
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function renderAnalytics() {
  renderProvinceRanking();
  drawProvinceChart();
}

function renderAll() {
  renderVotersTable();
  renderSearchResults();
  renderUsers();
  updateStats();
  renderAnalytics();
}

function loadDashboard() {
  const session = getCurrentSession();
  if (!session) return;

  DOM.authSection.classList.add("hidden");
  DOM.dashboardSection.classList.remove("hidden");

  DOM.currentUserInfo.textContent = `${session.name} | ${session.role} | ${session.province || ""} | ${session.zone || ""}`;

  if (session.role === "Administrador General") {
    DOM.usersSection.classList.remove("section-hidden");
  } else {
    DOM.usersSection.classList.add("section-hidden");
  }

  updateAdminAccess();
  fillFilterOptions();
  renderAll();
}

function clearFilters() {
  DOM.searchInput.value = "";
  DOM.filterProvince.value = "";
  DOM.filterMunicipio.value = "";
  DOM.filterSector.value = "";
  DOM.filterMesa.value = "";
  DOM.filterRole.value = "";
  DOM.filterRegistrar.value = "";
  renderVotersTable();
  renderSearchResults();
  renderAnalytics();
}

[
  DOM.searchInput,
  DOM.filterProvince,
  DOM.filterMunicipio,
  DOM.filterSector,
  DOM.filterMesa,
  DOM.filterRole,
  DOM.filterRegistrar
].forEach(element => {
  element.addEventListener("input", () => {
    renderVotersTable();
    renderSearchResults();
    renderAnalytics();
  });

  element.addEventListener("change", () => {
    renderVotersTable();
    renderSearchResults();
    renderAnalytics();
  });
});

DOM.clearFiltersBtn.addEventListener("click", clearFilters);

function exportToExcel() {
  const session = getCurrentSession();

  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  const voters = session.role === "Administrador General"
    ? getFilteredVoters()
    : getFilteredVoters().filter(voter => voter.registeredById === session.id);

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
    if (session.role === "Administrador General") {
      if (voter.registeredByRole !== currentRole) {
        currentRole = voter.registeredByRole;
        currentRegistrar = "";
        html += `
          <tr>
            <td class="group" colspan="12">ROL: ${escapeHtml(voter.registeredByRole)}</td>
          </tr>
        `;
      }

      if (voter.registeredByName !== currentRegistrar) {
        currentRegistrar = voter.registeredByName;
        html += `
          <tr>
            <td class="subgroup" colspan="12">
              REGISTRADOR: ${escapeHtml(voter.registeredByName)} (${escapeHtml(voter.registeredBy)}) | ZONA: ${escapeHtml(voter.registeredByZone)} | PROVINCIA ASIGNADA: ${escapeHtml(voter.registeredByProvince)}
            </td>
          </tr>
        `;
      }
    }

    html += `
      <tr>
        <td>${escapeHtml(voter.name)}</td>
        <td>${escapeHtml(voter.cedula)}</td>
        <td>${escapeHtml(voter.phone)}</td>
        <td>${escapeHtml(voter.province)}</td>
        <td>${escapeHtml(voter.municipio)}</td>
        <td>${escapeHtml(voter.sector)}</td>
        <td>${escapeHtml(voter.mesa)}</td>
        <td>${escapeHtml(voter.recinto)}</td>
        <td>${escapeHtml(voter.registeredByName)} (${escapeHtml(voter.registeredBy)})</td>
        <td>${escapeHtml(voter.registeredByRole)}</td>
        <td>${escapeHtml(voter.registeredByZone)}</td>
        <td>${escapeHtml(voter.updatedAt || voter.createdAt)}</td>
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
  link.download = session.role === "Administrador General"
    ? "reporte_general_registros.xls"
    : `mis_registros_${session.username}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

DOM.exportBtn.addEventListener("click", exportToExcel);

window.addEventListener("resize", () => {
  if (!DOM.dashboardSection.classList.contains("hidden")) {
    drawProvinceChart();
  }
});

populateProvinceSelects();
normalizeUsers();
updateRegisterTabVisibility();
updateRoleOptions();
resetUserForm();
resetVoterForm();
updateInitialHint();
updateAdminAccess();

if (getSession()) {
  loadDashboard();
} else {
  DOM.authSection.classList.remove("hidden");
  DOM.dashboardSection.classList.add("hidden");
}