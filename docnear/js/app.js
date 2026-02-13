// ─── DocNear Application Logic ───────────────────────────────
// Handles routing, rendering, search, booking, map, and admin

let map = null;
let userLocation = null;
let currentBranch = 'all';
let currentSpecialty = null;
let currentSearchQuery = '';
let bookingDoctorId = null;
let selectedTimeSlot = null;

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    DataStore.init();
    renderCategories();
    renderDoctors();
    initMap();
    setupNavScroll();
    if (DataStore.isAdminLoggedIn()) showAdminDashboard();
    // Set min date for booking
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// ─── NAVIGATION / ROUTING ────────────────────────────────────
function navigateTo(page) {
    // Hide all pages
    document.getElementById('mainContent').classList.remove('hidden-page');
    document.querySelectorAll('.info-page, .admin-page').forEach(p => p.classList.remove('active'));
    // Update nav
    document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`[data-page="${page}"]`).forEach(l => l.classList.add('active'));

    if (page === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        document.getElementById('mainContent').classList.add('hidden-page');
        const pageMap = { about: 'aboutPage', emergency: 'emergencyPage', privacy: 'privacyPage', admin: 'adminPage' };
        const el = document.getElementById(pageMap[page]);
        if (el) { el.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

function setupNavScroll() {
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ─── CATEGORIES RENDERING ────────────────────────────────────
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = CATEGORIES.map(cat => `
    <div class="glass-card category-card" onclick="filterBySpecialty('${cat.id}')">
      <div class="icon-wrap" style="background:${cat.color}20;color:${cat.color};">
        <i class="fa-solid ${cat.icon}"></i>
      </div>
      <h4>${cat.name}</h4>
    </div>
  `).join('');
}

// ─── DOCTOR RENDERING ────────────────────────────────────────
function renderDoctors() {
    const doctors = DataStore.getDoctors();
    let filtered = doctors;
    if (currentBranch !== 'all') filtered = filtered.filter(d => d.branch === currentBranch);
    if (currentSpecialty) filtered = filtered.filter(d => d.specialty === currentSpecialty);
    if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        filtered = filtered.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q) ||
            getCategoryName(d.specialty).toLowerCase().includes(q)
        );
    }

    const grid = document.getElementById('doctorsGrid');
    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
      <i class="fa-solid fa-user-doctor" style="font-size:3rem;color:var(--text-muted);margin-bottom:16px;"></i>
      <p style="color:var(--text-muted);font-size:1.1rem;">No doctors found matching your criteria</p>
      <button class="btn-primary" style="margin-top:20px;" onclick="resetFilters()">Reset Filters</button>
    </div>`;
        return;
    }

    grid.innerHTML = filtered.map(doc => {
        const cat = CATEGORIES.find(c => c.id === doc.specialty);
        const color = cat ? cat.color : '#00d2ff';
        const initials = doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('');
        const catName = cat ? cat.name : doc.specialty;
        const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
        return `
    <div class="glass-card doctor-card fade-in">
      <span class="branch-tag ${doc.branch}">${doc.branch}</span>
      <div class="doctor-header">
        <div class="doctor-avatar" style="background:linear-gradient(135deg,${color}88,${color}44);">${initials}</div>
        <div class="doctor-info">
          <h3>${doc.name}</h3>
          <p class="specialty">${catName}</p>
        </div>
      </div>
      <div class="doctor-meta">
        <span class="meta-item"><i class="fa-solid fa-star rating-star"></i> ${doc.rating}</span>
        <span class="meta-item"><i class="fa-solid fa-briefcase-medical"></i> ${doc.experience} yrs</span>
        <span class="meta-item"><i class="fa-solid fa-indian-rupee-sign"></i> ₹${doc.fee}</span>
      </div>
      <div class="doctor-availability">
        ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d =>
            `<span class="day-badge ${doc.availability.days.includes(d) ? 'available' : ''} ${d === todayDay && doc.availability.days.includes(d) ? 'today' : ''}">${d}</span>`
        ).join('')}
      </div>
      <div class="doctor-actions">
        <button class="btn-book" onclick="openBookingModal('${doc.id}')"><i class="fa-solid fa-calendar-check"></i> Book Now</button>
        <button class="btn-map" onclick="focusDoctor('${doc.id}')" title="View on map"><i class="fa-solid fa-location-dot"></i></button>
      </div>
    </div>`;
    }).join('');
}

function getCategoryName(id) {
    const cat = CATEGORIES.find(c => c.id === id);
    return cat ? cat.name : id;
}

// ─── FILTERS ─────────────────────────────────────────────────
function filterBranch(branch) {
    currentBranch = branch;
    document.querySelectorAll('.branch-btn').forEach(b => b.classList.remove('active'));

    // Construct the button ID dynamically
    const btnId = 'branch' + branch.charAt(0).toUpperCase() + branch.slice(1);
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.classList.add('active');
    }

    renderDoctors();
}

function filterBySpecialty(specialtyId) {
    if (specialtyId === 'all') {
        currentSpecialty = null;
    } else {
        currentSpecialty = currentSpecialty === specialtyId ? null : specialtyId;
    }
    renderDoctors();
    document.getElementById('doctors-section').scrollIntoView({ behavior: 'smooth' });
}

function resetFilters() {
    currentBranch = 'all'; currentSpecialty = null; currentSearchQuery = '';
    document.getElementById('heroSearch').value = '';
    document.querySelectorAll('.branch-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('branchAll').classList.add('active');
    renderDoctors();
}

// ─── SEARCH ──────────────────────────────────────────────────
function handleSearch(e) {
    if (e.key === 'Enter') executeSearch();
}

function executeSearch() {
    currentSearchQuery = document.getElementById('heroSearch').value.trim();
    renderDoctors();
    document.getElementById('doctors-section').scrollIntoView({ behavior: 'smooth' });
}

// ─── MAP ─────────────────────────────────────────────────────
function initMap() {
    map = L.map('map-container').setView([13.0827, 80.2707], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Try to get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                    className: '',
                    html: '<div style="width:16px;height:16px;background:var(--accent-cyan);border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(0,210,255,0.5);"></div>',
                    iconSize: [16, 16], iconAnchor: [8, 8]
                })
            }).addTo(map).bindPopup('<strong>Your Location</strong>');
            map.setView([userLocation.lat, userLocation.lng], 13);
            addDoctorMarkers();
        }, () => addDoctorMarkers());
    } else { addDoctorMarkers(); }

    // Fix map render on scroll into view
    setTimeout(() => map.invalidateSize(), 500);
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) map.invalidateSize(); });
    });
    observer.observe(document.getElementById('map-section'));
}

function addDoctorMarkers() {
    const doctors = DataStore.getDoctors();
    doctors.forEach(doc => {
        const cat = CATEGORIES.find(c => c.id === doc.specialty);
        const color = cat ? cat.color : '#00d2ff';
        const dist = userLocation ? getDistance(userLocation.lat, userLocation.lng, doc.location.lat, doc.location.lng) : null;
        const marker = L.marker([doc.location.lat, doc.location.lng], {
            icon: L.divIcon({
                className: '',
                html: `<div style="width:32px;height:32px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;border:2px solid rgba(255,255,255,0.5);box-shadow:0 2px 10px rgba(0,0,0,0.3);"><i class="fa-solid ${cat ? cat.icon : 'fa-stethoscope'}" style="font-size:14px;"></i></div>`,
                iconSize: [32, 32], iconAnchor: [16, 32]
            })
        }).addTo(map);

        marker.bindPopup(`
      <div class="map-popup">
        <h4>${doc.name}</h4>
        <p>${getCategoryName(doc.specialty)}</p>
        <p>${doc.location.address}</p>
        <p>${doc.location.address}</p>
        ${dist ? `<p class="distance"><i class="fa-solid fa-route"></i> ${dist} km away</p>` : ''}
        <a href="https://www.google.com/maps/dir/?api=1&destination=${doc.location.lat},${doc.location.lng}" target="_blank" class="btn-directions"><i class="fa-solid fa-diamond-turn-right"></i> Get Directions</a>
      </div>
    `);
        marker._docId = doc.id;
    });
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function focusDoctor(docId) {
    const doc = DataStore.getDoctorById(docId);
    if (!doc) return;
    navigateTo('home');
    setTimeout(() => {
        document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            map.invalidateSize();
            map.setView([doc.location.lat, doc.location.lng], 15);
            map.eachLayer(layer => {
                if (layer._docId === docId) layer.openPopup();
            });
        }, 500);
    }, 100);
}

// ─── BOOKING ─────────────────────────────────────────────────
function openBookingModal(docId) {
    bookingDoctorId = docId;
    selectedTimeSlot = null;
    const doc = DataStore.getDoctorById(docId);
    if (!doc) return;

    const cat = CATEGORIES.find(c => c.id === doc.specialty);
    const color = cat ? cat.color : '#00d2ff';
    const initials = doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('');

    document.getElementById('modalDoctorInfo').innerHTML = `
    <div class="doctor-avatar" style="background:linear-gradient(135deg,${color}88,${color}44);width:50px;height:50px;font-size:1.2rem;">${initials}</div>
    <div>
      <h4 style="font-size:1rem;margin-bottom:2px;">${doc.name}</h4>
      <p style="color:var(--text-secondary);font-size:0.85rem;">${getCategoryName(doc.specialty)} • ₹${doc.fee}</p>
    </div>
  `;
    document.getElementById('bookingDate').value = '';
    document.getElementById('timeSlots').innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">Select a date first</p>';
    document.getElementById('patientName').value = '';
    document.getElementById('patientPhone').value = '';
    document.getElementById('patientEmail').value = '';
    document.getElementById('bookingContent').style.display = 'block';
    document.getElementById('bookingSuccess').style.display = 'none';
    document.getElementById('bookingModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('open');
    document.body.style.overflow = '';
    bookingDoctorId = null;
    selectedTimeSlot = null;
}

function loadTimeSlots() {
    const date = document.getElementById('bookingDate').value;
    if (!date || !bookingDoctorId) return;
    const doc = DataStore.getDoctorById(bookingDoctorId);
    if (!doc) return;

    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date + 'T00:00:00').getDay()];
    if (!doc.availability.days.includes(dayName)) {
        document.getElementById('timeSlots').innerHTML = `<p style="color:var(--accent-pink);font-size:0.85rem;">Doctor is not available on ${dayName}. Please choose another date.</p>`;
        return;
    }

    const bookedSlots = DataStore.getBookings()
        .filter(b => b.doctorId === bookingDoctorId && b.date === date && b.status === 'confirmed')
        .map(b => b.timeSlot);

    document.getElementById('timeSlots').innerHTML = doc.availability.slots.map(slot => {
        const isBooked = bookedSlots.includes(slot);
        return `<button type="button" class="time-slot ${isBooked ? 'booked' : ''}" 
      ${isBooked ? 'disabled' : `onclick="selectTimeSlot(this,'${slot}')"`}>${slot}</button>`;
    }).join('');
}

function selectTimeSlot(el, slot) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    selectedTimeSlot = slot;
}

function confirmBooking() {
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const email = document.getElementById('patientEmail').value.trim();
    const date = document.getElementById('bookingDate').value;

    if (!name || !phone || !date || !selectedTimeSlot) {
        showToast('Please fill all fields and select a time slot', 'error');
        return;
    }

    const doc = DataStore.getDoctorById(bookingDoctorId);
    DataStore.addBooking({ doctorId: bookingDoctorId, doctorName: doc.name, patientName: name, patientPhone: phone, patientEmail: email, date, timeSlot: selectedTimeSlot });

    document.getElementById('bookingContent').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
    document.getElementById('successMsg').textContent = `Your appointment with ${doc.name} on ${date} at ${selectedTimeSlot} has been confirmed.`;
    showToast('Appointment booked successfully!', 'success');
}

// ─── ADMIN ───────────────────────────────────────────────────
function adminLoginAction() {
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value.trim();
    if (DataStore.validateAdmin(u, p)) {
        DataStore.loginAdmin();
        showAdminDashboard();
        showToast('Welcome, Admin!', 'success');
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').classList.add('active');
    renderAdminStats();
    switchAdminTab('doctors', document.querySelector('.admin-tab'));
}

function adminLogout() {
    DataStore.logoutAdmin();
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').classList.remove('active');
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    showToast('Logged out successfully', 'success');
}

function renderAdminStats() {
    const docs = DataStore.getDoctors();
    const bookings = DataStore.getBookings();
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    document.getElementById('adminStats').innerHTML = `
    <div class="glass-card stat-card"><div class="stat-number" style="color:var(--accent-cyan);">${docs.length}</div><div class="stat-label">Total Doctors</div></div>
    <div class="glass-card stat-card"><div class="stat-number" style="color:var(--accent-green);">${bookings.length}</div><div class="stat-label">Total Bookings</div></div>
    <div class="glass-card stat-card"><div class="stat-number" style="color:var(--accent-purple);">${confirmed}</div><div class="stat-label">Confirmed</div></div>
    <div class="glass-card stat-card"><div class="stat-number" style="color:var(--accent-pink);">${docs.filter(d => d.branch === 'allopathy').length} / ${docs.filter(d => d.branch === 'homeopathy').length} / ${docs.filter(d => ['ayurveda', 'siddha', 'unani', 'naturopathy'].includes(d.branch)).length}</div><div class="stat-label">Allo / Homeo / AYUSH</div></div>
    <div class="glass-card stat-card"><div class="stat-number" style="color:#fbbf24;">${DataStore.getDoctorRequests().length}</div><div class="stat-label">Pending Requests</div></div>
  `;
    const reqBadge = document.getElementById('reqBadge');
    if (reqBadge) {
        const reqCount = DataStore.getDoctorRequests().length;
        reqBadge.textContent = reqCount > 0 ? reqCount : '';
        reqBadge.style.display = reqCount > 0 ? 'inline-block' : 'none';
    }
}

function switchAdminTab(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const content = document.getElementById('adminTabContent');

    if (tab === 'doctors') {
        const docs = DataStore.getDoctors();
        content.innerHTML = `<div class="admin-table-wrap"><table class="admin-table">
      <thead><tr><th>Name</th><th>Specialty</th><th>Branch</th><th>Fee</th><th>Actions</th></tr></thead>
      <tbody>${docs.map(d => `<tr>
        <td>${d.name}</td><td>${getCategoryName(d.specialty)}</td><td>${d.branch}</td><td>₹${d.fee}</td>
        <td><button class="btn-sm btn-edit" onclick="editDoctorForm('${d.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-sm btn-delete" onclick="deleteDoctor('${d.id}')"><i class="fa-solid fa-trash"></i></button></td>
      </tr>`).join('')}</tbody></table></div>`;
    } else if (tab === 'bookings') {
        const bookings = DataStore.getBookings();
        content.innerHTML = bookings.length === 0 ? '<p style="color:var(--text-muted);text-align:center;padding:40px;">No bookings yet</p>' :
            `<div class="admin-table-wrap"><table class="admin-table">
      <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${bookings.map(b => `<tr>
        <td>${b.patientName}</td><td>${b.doctorName || 'N/A'}</td><td>${b.date}</td><td>${b.timeSlot}</td>
        <td><span class="status-badge status-${b.status}">${b.status}</span></td>
        <td>${b.status === 'confirmed' ? `<button class="btn-sm btn-delete" onclick="cancelBooking('${b.id}')">Cancel</button>` : '—'}
        <button class="btn-sm btn-delete" onclick="deleteBookingAdmin('${b.id}')"><i class="fa-solid fa-trash"></i></button></td>
      </tr>`).join('')}</tbody></table></div>`;
    } else if (tab === 'addDoctor') {
        renderDoctorForm(content);
    } else if (tab === 'requests') {
        const reqs = DataStore.getDoctorRequests();
        content.innerHTML = reqs.length === 0 ? '<p style="color:var(--text-muted);text-align:center;padding:40px;">No pending requests</p>' :
            `<div class="admin-table-wrap"><table class="admin-table">
      <thead><tr><th>Name</th><th>Specialty</th><th>Exp/Fee</th><th>Contact</th><th>Certificate</th><th>Requested</th><th>Actions</th></tr></thead>
      <tbody>${reqs.map(r => `<tr>
        <td>${r.name}<br><small style="color:var(--text-muted);">${r.branch}</small></td>
        <td>${getCategoryName(r.specialty)}</td>
        <td>${r.experience} yrs<br>₹${r.fee}</td>
        <td>${r.phone}<br><small>${r.email}</small></td>
        <td>${r.certificate ? `<button class="btn-sm" style="background:#3b82f6;color:#fff;" onclick="viewCertificate('${r.id}')"><i class="fa-solid fa-file-contract"></i> View</button>` : '<span style="color:var(--text-muted);">N/A</span>'}</td>
        <td>${new Date(r.requestedAt).toLocaleDateString()}</td>
        <td>
          <button class="btn-sm btn-edit" onclick="approveRequest('${r.id}')" title="Approve"><i class="fa-solid fa-check"></i></button>
          <button class="btn-sm btn-delete" onclick="rejectRequest('${r.id}')" title="Reject"><i class="fa-solid fa-xmark"></i></button>
        </td>
      </tr>`).join('')}</tbody></table></div>`;
    }
}

function viewCertificate(reqId) {
    const req = DataStore.getDoctorRequests().find(r => r.id === reqId);
    if (req && req.certificate) {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(
                `<iframe src="${req.certificate}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
            );
        } else {
            showToast('Please allow popups to view certificate', 'error');
        }
    } else {
        showToast('Certificate not found', 'error');
    }
}

function renderDoctorForm(container, doc = null) {
    const isEdit = !!doc;
    container.innerHTML = `
    <h3 style="margin-bottom:20px;">${isEdit ? 'Edit' : 'Add New'} Doctor</h3>
    <div class="admin-form-grid">
      <div class="form-group"><label>Full Name</label><input class="form-control" id="dfName" value="${doc ? doc.name : ''}"></div>
      <div class="form-group"><label>Specialty</label><select class="form-control" id="dfSpecialty">
        ${CATEGORIES.map(c => `<option value="${c.id}" ${doc && doc.specialty === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>Branch</label><select class="form-control" id="dfBranch">
        <option value="allopathy" ${doc && doc.branch === 'allopathy' ? 'selected' : ''}>Allopathy</option>
        <option value="ayurveda" ${doc && doc.branch === 'ayurveda' ? 'selected' : ''}>Ayurveda</option>
        <option value="homeopathy" ${doc && doc.branch === 'homeopathy' ? 'selected' : ''}>Homeopathy</option>
        <option value="siddha" ${doc && doc.branch === 'siddha' ? 'selected' : ''}>Siddha</option>
        <option value="unani" ${doc && doc.branch === 'unani' ? 'selected' : ''}>Unani</option>
        <option value="naturopathy" ${doc && doc.branch === 'naturopathy' ? 'selected' : ''}>Naturopathy</option></select></div>
      <div class="form-group"><label>Experience (years)</label><input type="number" class="form-control" id="dfExp" value="${doc ? doc.experience : ''}"></div>
      <div class="form-group"><label>Consultation Fee (₹)</label><input type="number" class="form-control" id="dfFee" value="${doc ? doc.fee : ''}"></div>
      <div class="form-group"><label>Rating</label><input type="number" step="0.1" max="5" class="form-control" id="dfRating" value="${doc ? doc.rating : '4.5'}"></div>
      <div class="form-group"><label>Phone</label><input class="form-control" id="dfPhone" value="${doc ? doc.phone : ''}"></div>
      <div class="form-group"><label>Email</label><input class="form-control" id="dfEmail" value="${doc ? doc.email : ''}"></div>
      <div class="form-group full-width"><label>Address</label><input class="form-control" id="dfAddress" value="${doc ? doc.location.address : ''}"></div>
      <div class="form-group"><label>Latitude</label><input type="number" step="0.0001" class="form-control" id="dfLat" value="${doc ? doc.location.lat : '13.0827'}"></div>
      <div class="form-group"><label>Longitude</label><input type="number" step="0.0001" class="form-control" id="dfLng" value="${doc ? doc.location.lng : '80.2707'}"></div>
      
      <div class="form-group full-width">
        <label>Pin Location on Map</label>
        <div id="adminMap" style="height: 300px; border-radius: 12px; border: 1px solid var(--glass-border);"></div>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;">Drag marker or click to set location</p>
      </div>

      <div class="form-group full-width"><label>Available Days (comma-separated: Mon,Tue,Wed...)</label>
        <input class="form-control" id="dfDays" value="${doc ? doc.availability.days.join(',') : 'Mon,Tue,Wed,Thu,Fri'}"></div>
      <div class="form-group full-width"><label>Time Slots (comma-separated: 09:00 AM,09:30 AM...)</label>
        <input class="form-control" id="dfSlots" value="${doc ? doc.availability.slots.join(',') : '09:00 AM,09:30 AM,10:00 AM,10:30 AM,11:00 AM'}"></div>
      <div class="form-group full-width"><label>About</label><textarea class="form-control" id="dfAbout" rows="3">${doc ? doc.about : ''}</textarea></div>
      <div class="full-width">
        <button class="btn-primary" onclick="${isEdit ? `saveEditDoctor('${doc.id}')` : 'saveNewDoctor()'}">
          <i class="fa-solid fa-${isEdit ? 'save' : 'plus'}"></i> ${isEdit ? 'Save Changes' : 'Add Doctor'}
        </button>
      </div>
    </div>`;

    // Initialize Admin Map
    setTimeout(() => {
        initAdminMap(doc ? doc.location.lat : 13.0827, doc ? doc.location.lng : 80.2707);
    }, 500);
}

let adminMap = null;
let adminMarker = null;

function initAdminMap(lat, lng) {
    if (adminMap) { adminMap.remove(); adminMap = null; }

    const container = document.getElementById('adminMap');
    if (!container) return;

    adminMap = L.map('adminMap').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(adminMap);

    adminMarker = L.marker([lat, lng], { draggable: true }).addTo(adminMap);

    adminMap.on('click', function (e) {
        updateAdminMarker(e.latlng);
    });

    adminMarker.on('dragend', function (e) {
        updateAdminMarker(e.target.getLatLng());
    });
}

function updateAdminMarker(latlng) {
    adminMarker.setLatLng(latlng);
    document.getElementById('dfLat').value = latlng.lat.toFixed(4);
    document.getElementById('dfLng').value = latlng.lng.toFixed(4);
}

function saveNewDoctor() {
    const d = getDoctorFormData();
    if (!d) return;
    DataStore.addDoctor(d);
    showToast('Doctor added successfully!', 'success');
    renderAdminStats();
    switchAdminTab('doctors', document.querySelector('.admin-tab'));
    renderDoctors();
    reloadMapMarkers();
}

function editDoctorForm(id) {
    const doc = DataStore.getDoctorById(id);
    if (!doc) return;
    const content = document.getElementById('adminTabContent');
    renderDoctorForm(content, doc);
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
}

function saveEditDoctor(id) {
    const d = getDoctorFormData();
    if (!d) return;
    DataStore.updateDoctor(id, d);
    showToast('Doctor updated successfully!', 'success');
    renderAdminStats();
    switchAdminTab('doctors', document.querySelector('.admin-tab'));
    renderDoctors();
    reloadMapMarkers();
}

function getDoctorFormData() {
    const name = document.getElementById('dfName').value.trim();
    const fee = parseInt(document.getElementById('dfFee').value);
    const exp = parseInt(document.getElementById('dfExp').value);
    if (!name || !fee || !exp) { showToast('Please fill required fields', 'error'); return null; }
    return {
        name, specialty: document.getElementById('dfSpecialty').value,
        branch: document.getElementById('dfBranch').value,
        experience: exp, fee, rating: parseFloat(document.getElementById('dfRating').value) || 4.5,
        phone: document.getElementById('dfPhone').value.trim(),
        email: document.getElementById('dfEmail').value.trim(),
        about: document.getElementById('dfAbout').value.trim(),
        location: {
            lat: parseFloat(document.getElementById('dfLat').value) || 13.0827,
            lng: parseFloat(document.getElementById('dfLng').value) || 80.2707,
            address: document.getElementById('dfAddress').value.trim()
        },
        availability: {
            days: document.getElementById('dfDays').value.split(',').map(s => s.trim()),
            slots: document.getElementById('dfSlots').value.split(',').map(s => s.trim())
        }
    };
}

function deleteDoctor(id) {
    if (!confirm('Delete this doctor?')) return;
    DataStore.deleteDoctor(id);
    showToast('Doctor deleted', 'success');
    renderAdminStats();
    switchAdminTab('doctors', document.querySelector('.admin-tab'));
    renderDoctors();
    reloadMapMarkers();
}

function cancelBooking(id) {
    DataStore.updateBookingStatus(id, 'cancelled');
    showToast('Booking cancelled', 'success');
    renderAdminStats();
    switchAdminTab('bookings', document.querySelectorAll('.admin-tab')[1]);
}

function deleteBookingAdmin(id) {
    if (!confirm('Delete this booking?')) return;
    DataStore.deleteBooking(id);
    showToast('Booking deleted', 'success');
    renderAdminStats();
    switchAdminTab('bookings', document.querySelectorAll('.admin-tab')[1]);
}

function reloadMapMarkers() {
    if (!map) return;
    map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
    addDoctorMarkers();
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-exclamation'}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ─── JOIN REQUESTS ──────────────────────────────────────────
let joinMap = null;
let joinMarker = null;

function openJoinModal() {
    document.getElementById('joinModal').classList.add('open');
    document.body.style.overflow = 'hidden';

    // Initialize map if not exists
    setTimeout(() => {
        if (!joinMap) {
            joinMap = L.map('joinMap').setView([20.5937, 78.9629], 5); // Center on India
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(joinMap);

            joinMap.on('click', function (e) {
                const lat = e.latlng.lat.toFixed(4);
                const lng = e.latlng.lng.toFixed(4);
                document.getElementById('joinLat').value = lat;
                document.getElementById('joinLng').value = lng;

                if (joinMarker) {
                    joinMarker.setLatLng(e.latlng);
                } else {
                    joinMarker = L.marker(e.latlng).addTo(joinMap);
                }
            });
        }
        joinMap.invalidateSize();
    }, 500);
}

function closeJoinModal() {
    document.getElementById('joinModal').classList.remove('open');
    document.body.style.overflow = '';
}

function submitJoinRequest() {
    const name = document.getElementById('joinName').value.trim();
    const specialty = document.getElementById('joinSpecialty').value;
    const branch = document.getElementById('joinBranch').value;
    const exp = document.getElementById('joinExp').value;
    const fee = document.getElementById('joinFee').value;
    const phone = document.getElementById('joinPhone').value.trim();
    const email = document.getElementById('joinEmail').value.trim();
    const address = document.getElementById('joinAddress').value.trim();
    const about = document.getElementById('joinAbout').value.trim();
    const lat = document.getElementById('joinLat').value;
    const lng = document.getElementById('joinLng').value;
    const certFile = document.getElementById('joinCert').files[0];

    if (!name || !specialty || !exp || !fee || !phone || !email || !lat || !lng || !certFile) {
        showToast('Please fill all fields, upload certificate, and pin location', 'error');
        return;
    }

    if (certFile.size > 1024 * 1024) { // 1MB limit
        showToast('Certificate file is too large (max 1MB)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const request = {
            name, specialty, branch, experience: parseInt(exp), fee: parseInt(fee),
            phone, email, about,
            location: { lat: parseFloat(lat), lng: parseFloat(lng), address },
            availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], slots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
            rating: 4.5,
            certificate: e.target.result, // Base64 string
            certName: certFile.name
        };

        DataStore.addDoctorRequest(request);
        showToast('Request submitted successfully! We will contact you soon.', 'success');
        closeJoinModal();

        // Clear form
        document.querySelectorAll('#joinModal input, #joinModal textarea').forEach(i => i.value = '');
        document.getElementById('joinSpecialty').selectedIndex = 0;
        if (joinMarker) { joinMap.removeLayer(joinMarker); joinMarker = null; }

        // Refresh admin stats if open (simulation)
        if (DataStore.isAdminLoggedIn()) renderAdminStats();
    };
    reader.readAsDataURL(certFile);
}

function approveRequest(id) {
    const reqs = DataStore.getDoctorRequests();
    const req = reqs.find(r => r.id === id);
    if (!req) return;

    // Move to doctors
    const { id: reqId, status, requestedAt, ...doctorData } = req;
    DataStore.addDoctor(doctorData);
    DataStore.deleteDoctorRequest(id);

    showToast(`${req.name} has been approved and added!`, 'success');
    renderAdminStats();
    switchAdminTab('requests', document.querySelectorAll('.admin-tab')[2]);
    renderDoctors();
    reloadMapMarkers();
}

function rejectRequest(id) {
    if (!confirm('Reject this request? This cannot be undone.')) return;
    DataStore.deleteDoctorRequest(id);
    showToast('Request rejected', 'success');
    renderAdminStats();
    switchAdminTab('requests', document.querySelectorAll('.admin-tab')[2]);
}
