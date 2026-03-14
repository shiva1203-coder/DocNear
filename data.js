// ─── DocNear Data Store ───────────────────────────────────────
// All application data: doctors, categories, bookings stored in localStorage

const CATEGORIES = [
    { id: 'all', name: 'All', icon: 'fa-layer-group', color: '#94a3b8' },
    { id: 'cardiology', name: 'Cardiology', icon: 'fa-heart-pulse', color: '#ff6b9d' },
    { id: 'dermatology', name: 'Dermatology', icon: 'fa-hand-dots', color: '#ffa96b' },
    { id: 'pediatrics', name: 'Pediatrics', icon: 'fa-baby', color: '#6bddff' },
    { id: 'orthopedics', name: 'Orthopedics', icon: 'fa-bone', color: '#a78bfa' },
    { id: 'neurology', name: 'Neurology', icon: 'fa-brain', color: '#f472b6' },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: 'fa-eye', color: '#34d399' },
    { id: 'ent', name: 'ENT', icon: 'fa-ear-listen', color: '#fbbf24' },
    { id: 'general', name: 'General Medicine', icon: 'fa-stethoscope', color: '#60a5fa' },
    { id: 'dentistry', name: 'Dentistry', icon: 'fa-tooth', color: '#c084fc' },
    { id: 'gynecology', name: 'Gynecology', icon: 'fa-person-pregnant', color: '#fb7185' },
    { id: 'psychiatry', name: 'Psychiatry', icon: 'fa-comments', color: '#2dd4bf' },
    { id: 'gastroenterology', name: 'Gastroenterology', icon: 'fa-stomach', color: '#f97316' },
];

const DEFAULT_DOCTORS = [
    {
        id: 'd1',
        name: 'Dr. Anika Sharma',
        specialty: 'cardiology',
        branch: 'allopathy',
        rating: 4.9,
        experience: 15,
        fee: 800,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM']
        },
        location: { lat: 13.0827, lng: 80.2707, address: '42 Anna Salai, Chennai, Tamil Nadu' },
        phone: '+91 98765 43210',
        email: 'dr.anika@docnear.com',
        about: 'Senior Cardiologist with over 15 years of experience in interventional cardiology and heart failure management.'
    },
    {
        id: 'd2',
        name: 'Dr. Rajesh Kumar',
        specialty: 'orthopedics',
        branch: 'allopathy',
        rating: 4.8,
        experience: 12,
        fee: 700,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
            slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '04:00 PM', '04:30 PM', '05:00 PM']
        },
        location: { lat: 13.0604, lng: 80.2496, address: '15 T. Nagar, Chennai, Tamil Nadu' },
        phone: '+91 98765 43211',
        email: 'dr.rajesh@docnear.com',
        about: 'Expert orthopedic surgeon specializing in joint replacement and sports medicine.'
    },
    {
        id: 'd3',
        name: 'Dr. Priya Menon',
        specialty: 'dermatology',
        branch: 'allopathy',
        rating: 4.7,
        experience: 10,
        fee: 600,
        avatar: '',
        availability: {
            days: ['Mon', 'Wed', 'Thu', 'Sat'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM']
        },
        location: { lat: 13.0475, lng: 80.2090, address: '88 Adyar, Chennai, Tamil Nadu' },
        phone: '+91 98765 43212',
        email: 'dr.priya@docnear.com',
        about: 'Board-certified dermatologist specializing in cosmetic dermatology and skin cancer treatment.'
    },
    {
        id: 'd4',
        name: 'Dr. Suresh Babu',
        specialty: 'general',
        branch: 'homeopathy',
        rating: 4.6,
        experience: 20,
        fee: 400,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            slots: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '05:00 PM', '05:30 PM', '06:00 PM']
        },
        location: { lat: 13.0878, lng: 80.2785, address: '5 Mylapore, Chennai, Tamil Nadu' },
        phone: '+91 98765 43213',
        email: 'dr.suresh@docnear.com',
        about: 'Renowned homeopathic practitioner with 20 years of experience in chronic disease management and holistic healing.'
    },
    {
        id: 'd5',
        name: 'Dr. Lakshmi Narayanan',
        specialty: 'pediatrics',
        branch: 'allopathy',
        rating: 4.9,
        experience: 18,
        fee: 650,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM']
        },
        location: { lat: 13.0674, lng: 80.2376, address: '22 Kodambakkam, Chennai, Tamil Nadu' },
        phone: '+91 98765 43214',
        email: 'dr.lakshmi@docnear.com',
        about: 'Pediatrician with extensive experience in neonatal care, childhood immunization, and developmental disorders.'
    },
    {
        id: 'd6',
        name: 'Dr. Arjun Patel',
        specialty: 'neurology',
        branch: 'allopathy',
        rating: 4.8,
        experience: 14,
        fee: 900,
        avatar: '',
        availability: {
            days: ['Tue', 'Wed', 'Thu', 'Fri'],
            slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM']
        },
        location: { lat: 13.0569, lng: 80.2425, address: '60 Mambalam, Chennai, Tamil Nadu' },
        phone: '+91 98765 43215',
        email: 'dr.arjun@docnear.com',
        about: 'Neurologist specializing in stroke management, epilepsy treatment, and neurodegenerative disorders.'
    },
    {
        id: 'd7',
        name: 'Dr. Meena Sundaram',
        specialty: 'ophthalmology',
        branch: 'allopathy',
        rating: 4.7,
        experience: 11,
        fee: 550,
        avatar: '',
        availability: {
            days: ['Mon', 'Wed', 'Fri', 'Sat'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM']
        },
        location: { lat: 13.1067, lng: 80.2840, address: '33 Royapettah, Chennai, Tamil Nadu' },
        phone: '+91 98765 43216',
        email: 'dr.meena@docnear.com',
        about: 'Ophthalmologist specializing in LASIK surgery, cataract treatment, and glaucoma management.'
    },
    {
        id: 'd8',
        name: 'Dr. Vikram Singh',
        specialty: 'ent',
        branch: 'allopathy',
        rating: 4.5,
        experience: 9,
        fee: 500,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Thu', 'Sat'],
            slots: ['10:00 AM', '10:30 AM', '11:00 AM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM']
        },
        location: { lat: 13.0732, lng: 80.2609, address: '78 Egmore, Chennai, Tamil Nadu' },
        phone: '+91 98765 43217',
        email: 'dr.vikram@docnear.com',
        about: 'ENT specialist with expertise in sinus surgery, hearing disorders, and voice problems.'
    },
    {
        id: 'd9',
        name: 'Dr. Kavitha Rajan',
        specialty: 'gynecology',
        branch: 'allopathy',
        rating: 4.9,
        experience: 16,
        fee: 750,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Fri'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM']
        },
        location: { lat: 13.0418, lng: 80.2341, address: '12 Velachery, Chennai, Tamil Nadu' },
        phone: '+91 98765 43218',
        email: 'dr.kavitha@docnear.com',
        about: 'Senior gynecologist and obstetrician specializing in high-risk pregnancies and minimally invasive surgery.'
    },
    {
        id: 'd10',
        name: 'Dr. Ravi Chandran',
        specialty: 'psychiatry',
        branch: 'homeopathy',
        rating: 4.6,
        experience: 13,
        fee: 450,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM', '05:00 PM']
        },
        location: { lat: 13.0950, lng: 80.2150, address: '45 Kilpauk, Chennai, Tamil Nadu' },
        phone: '+91 98765 43219',
        email: 'dr.ravi@docnear.com',
        about: 'Homeopathic psychiatrist with a holistic approach to mental health, anxiety, and depression management.'
    },
    {
        id: 'd11',
        name: 'Dr. Deepa Krishnan',
        specialty: 'dentistry',
        branch: 'allopathy',
        rating: 4.8,
        experience: 8,
        fee: 500,
        avatar: '',
        availability: {
            days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '03:00 PM', '03:30 PM', '04:00 PM']
        },
        location: { lat: 13.0520, lng: 80.2555, address: '90 Nungambakkam, Chennai, Tamil Nadu' },
        phone: '+91 98765 43220',
        email: 'dr.deepa@docnear.com',
        about: 'Cosmetic dentist specializing in smile design, dental implants, and root canal therapy.'
    },
    {
        id: 'd12',
        name: 'Dr. Mohan Das',
        specialty: 'gastroenterology',
        branch: 'allopathy',
        rating: 4.7,
        experience: 17,
        fee: 850,
        avatar: '',
        availability: {
            days: ['Tue', 'Wed', 'Thu', 'Fri'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM']
        },
        location: { lat: 13.0340, lng: 80.2680, address: '67 Thiruvanmiyur, Chennai, Tamil Nadu' },
        phone: '+91 98765 43221',
        email: 'dr.mohan@docnear.com',
        about: 'Gastroenterologist specializing in endoscopy, liver diseases, and inflammatory bowel conditions.'
    },
    {
        id: 'd13',
        name: 'Dr. Sandhya Rao',
        specialty: 'dermatology',
        branch: 'homeopathy',
        rating: 4.5,
        experience: 11,
        fee: 350,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Sat'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '05:00 PM', '05:30 PM', '06:00 PM']
        },
        location: { lat: 13.0700, lng: 80.2300, address: '28 Ashok Nagar, Chennai, Tamil Nadu' },
        phone: '+91 98765 43222',
        email: 'dr.sandhya@docnear.com',
        about: 'Homeopathic dermatologist focused on treating chronic skin conditions like eczema, psoriasis, and vitiligo naturally.'
    },
    {
        id: 'd14',
        name: 'Dr. Ganesh Iyer',
        specialty: 'cardiology',
        branch: 'homeopathy',
        rating: 4.4,
        experience: 19,
        fee: 500,
        avatar: '',
        availability: {
            days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
            slots: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '04:00 PM', '04:30 PM', '05:00 PM']
        },
        location: { lat: 13.1100, lng: 80.2600, address: '14 Perambur, Chennai, Tamil Nadu' },
        phone: '+91 98765 43223',
        email: 'dr.ganesh@docnear.com',
        about: 'Holistic heart care specialist using homeopathic remedies for hypertension, arrhythmia, and preventive cardiology.'
    },
    {
        id: 'd15',
        name: 'Dr. Nithya Venkatesh',
        specialty: 'pediatrics',
        branch: 'homeopathy',
        rating: 4.7,
        experience: 10,
        fee: 300,
        avatar: '',
        availability: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM']
        },
        location: { lat: 13.0450, lng: 80.2400, address: '7 Guindy, Chennai, Tamil Nadu' },
        phone: '+91 98765 43224',
        email: 'dr.nithya@docnear.com',
        about: 'Homeopathic pediatrician specializing in natural remedies for childhood ailments, immunity building, and allergy treatments.'
    },
    // New Doctors (Ayurveda, Siddha, Unani, Naturopathy) from across India
    {
        id: 'd16',
        name: 'Dr. Anjali Nair',
        specialty: 'general',
        branch: 'ayurveda',
        rating: 4.9,
        experience: 12,
        fee: 600,
        avatar: '',
        availability: { days: ['Mon', 'Wed', 'Fri'], slots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
        location: { lat: 10.8505, lng: 76.2711, address: 'Kerala Ayurveda Centre, Palakkad, Kerala' },
        phone: '+91 91234 56789', email: 'dr.anjali@docnear.com',
        about: 'Expert in Panchakarma and lifestyle disorders management through Ayurveda.'
    },
    {
        id: 'd17',
        name: 'Dr. Murugan Pillai',
        specialty: 'general',
        branch: 'siddha',
        rating: 4.8,
        experience: 25,
        fee: 400,
        avatar: '',
        availability: { days: ['Tue', 'Thu', 'Sat'], slots: ['10:00 AM', '04:00 PM', '05:00 PM'] },
        location: { lat: 9.9252, lng: 78.1198, address: 'Madurai Siddha Vaidya Salai, Madurai, Tamil Nadu' },
        phone: '+91 91234 56780', email: 'dr.murugan@docnear.com',
        about: 'Traditional Siddha practitioner specializing in Varmam therapy and chronic diseases.'
    },
    {
        id: 'd18',
        name: 'Dr. Rashid Khan',
        specialty: 'general',
        branch: 'unani',
        rating: 4.6,
        experience: 15,
        fee: 500,
        avatar: '',
        availability: { days: ['Mon', 'Tue', 'Thu', 'Fri'], slots: ['11:00 AM', '12:00 PM', '06:00 PM'] },
        location: { lat: 28.6139, lng: 77.2090, address: 'Hamdard Wellness, New Delhi' },
        phone: '+91 91234 56781', email: 'dr.rashid@docnear.com',
        about: 'Unani specialist focusing on Regimental Therapy (Ilaj-bil-Tadbeer) and dietotherapy.'
    },
    {
        id: 'd19',
        name: 'Dr. Swati Deshpande',
        specialty: 'dermatology',
        branch: 'ayurveda',
        rating: 4.7,
        experience: 8,
        fee: 700,
        avatar: '',
        availability: { days: ['Wed', 'Fri', 'Sat'], slots: ['02:00 PM', '03:00 PM', '04:00 PM'] },
        location: { lat: 18.5204, lng: 73.8567, address: 'Pune Ayurvedic Clinic, Pune, Maharashtra' },
        phone: '+91 91234 56782', email: 'dr.swati@docnear.com',
        about: 'Specializes in Ayurvedic skin treatments and hair care solutions using natural herbs.'
    },
    {
        id: 'd20',
        name: 'Dr. Ramesh Gupta',
        specialty: 'orthopedics',
        branch: 'naturopathy',
        rating: 4.5,
        experience: 18,
        fee: 550,
        avatar: '',
        availability: { days: ['Mon', 'Thu', 'Sat'], slots: ['08:00 AM', '09:00 AM', '10:00 AM'] },
        location: { lat: 12.9716, lng: 77.5946, address: 'Nature Cure Institute, Bangalore, Karnataka' },
        phone: '+91 91234 56783', email: 'dr.ramesh@docnear.com',
        about: 'Naturopathic expert in treating arthritis and joint pains through yoga, diet, and hydrotherapy.'
    },
    {
        id: 'd21',
        name: 'Dr. Fatima Begum',
        specialty: 'gynecology',
        branch: 'unani',
        rating: 4.8,
        experience: 14,
        fee: 600,
        avatar: '',
        availability: { days: ['Tue', 'Wed', 'Fri'], slots: ['09:00 AM', '01:00 PM'] },
        location: { lat: 17.3850, lng: 78.4867, address: 'Charminar Unani Hospital, Hyderabad, Telangana' },
        phone: '+91 91234 56784', email: 'dr.fatima@docnear.com',
        about: 'Specialist in women\'s health and hormonal balance using Unani medicine.'
    },
    {
        id: 'd22',
        name: 'Dr. Velu Swamy',
        specialty: 'neurology',
        branch: 'siddha',
        rating: 4.9,
        experience: 30,
        fee: 300,
        avatar: '',
        availability: { days: ['Mon', 'Sun'], slots: ['07:00 AM', '08:00 AM', '09:00 AM'] },
        location: { lat: 8.7139, lng: 77.7567, address: 'Agasthiyar Siddha Centre, Tirunelveli, Tamil Nadu' },
        phone: '+91 91234 56785', email: 'dr.velu@docnear.com',
        about: 'Renowned Siddha Varma Asan treating neurological disorders and paralysis.'
    },
    {
        id: 'd23',
        name: 'Dr. Vikram Sethi',
        specialty: 'general',
        branch: 'naturopathy',
        rating: 4.6,
        experience: 11,
        fee: 800,
        avatar: '',
        availability: { days: ['Mon', 'Tue', 'Wed', 'Thu'], slots: ['05:00 PM', '06:00 PM'] },
        location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai Wellness Hub, Mumbai, Maharashtra' },
        phone: '+91 91234 56786', email: 'dr.vikram@docnear.com',
        about: 'Lifestyle coach and Naturopath focusing on detox, weight loss, and stress management.'
    },
    {
        id: 'd24',
        name: 'Dr. Meera Reddy',
        specialty: 'ophthalmology',
        branch: 'ayurveda',
        rating: 4.7,
        experience: 9,
        fee: 500,
        avatar: '',
        availability: { days: ['Thu', 'Fri', 'Sat'], slots: ['10:00 AM', '11:00 AM', '03:00 PM'] },
        location: { lat: 13.6288, lng: 79.4192, address: 'Tirupati Ayurvedic Nethralaya, Tirupati, Andhra Pradesh' },
        phone: '+91 91234 56787', email: 'dr.meera@docnear.com',
        about: 'Ayurvedic eye specialist treating vision problems with Netra Tarpanam and herbal medicines.'
    },
    {
        id: 'd25',
        name: 'Dr. Kabir Ahmed',
        specialty: 'cardiology',
        branch: 'allopathy',
        rating: 4.8,
        experience: 20,
        fee: 1200,
        avatar: '',
        availability: { days: ['Mon', 'Tue', 'Wed'], slots: ['10:00 AM', '02:00 PM'] },
        location: { lat: 22.5726, lng: 88.3639, address: 'Kolkata Heart Institute, Kolkata, West Bengal' },
        phone: '+91 91234 56788', email: 'dr.kabir@docnear.com',
        about: 'Senior Interventional Cardiologist.'
    },
    {
        id: 'd26',
        name: 'Dr. Preeti Sharma',
        specialty: 'dentistry',
        branch: 'allopathy',
        rating: 4.6,
        experience: 7,
        fee: 600,
        avatar: '',
        availability: { days: ['Sat', 'Sun'], slots: ['09:00 AM', '05:00 PM'] },
        location: { lat: 26.9124, lng: 75.7873, address: 'Jaipur Smiles, Jaipur, Rajasthan' },
        phone: '+91 91234 56790', email: 'dr.preeti@docnear.com',
        about: 'Cosmetic dentist and implantologist.'
    },
    {
        id: 'd27',
        name: 'Dr. Ashok Kumar',
        specialty: 'gastroenterology',
        branch: 'ayurveda',
        rating: 4.5,
        experience: 16,
        fee: 450,
        avatar: '',
        availability: { days: ['Mon', 'Fri'], slots: ['08:00 AM', '06:00 PM'] },
        location: { lat: 25.3176, lng: 82.9739, address: 'Varanasi Ayurveda Bhawan, Varanasi, UP' },
        phone: '+91 91234 56791', email: 'dr.ashok@docnear.com',
        about: 'Treats digestive disorders using traditional Ayurvedic formulations.'
    }
];

// ─── Data Access Layer ──────────────────────────────────────
const DataStore = {
    init() {
        if (!localStorage.getItem('docnear_doctors')) {
            localStorage.setItem('docnear_doctors', JSON.stringify(DEFAULT_DOCTORS));
        }
        if (!localStorage.getItem('docnear_bookings')) {
            localStorage.setItem('docnear_bookings', JSON.stringify([]));
        }
        if (!localStorage.getItem('docnear_admin')) {
            localStorage.setItem('docnear_admin', JSON.stringify({ username: 'shiva12', password: '1480' }));
        }
        if (!localStorage.getItem('docnear_doctor_requests')) {
            localStorage.setItem('docnear_doctor_requests', JSON.stringify([]));
        }
    },

    getDoctorRequests() {
        return JSON.parse(localStorage.getItem('docnear_doctor_requests') || '[]');
    },

    addDoctorRequest(request) {
        const requests = this.getDoctorRequests();
        request.id = 'req' + Date.now();
        request.status = 'pending';
        request.requestedAt = new Date().toISOString();
        requests.push(request);
        localStorage.setItem('docnear_doctor_requests', JSON.stringify(requests));
        return request;
    },

    deleteDoctorRequest(id) {
        const requests = this.getDoctorRequests().filter(r => r.id !== id);
        localStorage.setItem('docnear_doctor_requests', JSON.stringify(requests));
    },

    getDoctors() {
        try {
            return JSON.parse(localStorage.getItem('docnear_doctors') || '[]');
        } catch (e) {
            console.error('Error parsing doctors data', e);
            return [];
        }
    },

    getDoctorById(id) {
        return this.getDoctors().find(d => d.id === id);
    },

    saveDoctors(doctors) {
        localStorage.setItem('docnear_doctors', JSON.stringify(doctors));
    },

    addDoctor(doctor) {
        const doctors = this.getDoctors();
        doctor.id = 'd' + Date.now();
        doctors.push(doctor);
        this.saveDoctors(doctors);
        return doctor;
    },

    updateDoctor(id, updates) {
        const doctors = this.getDoctors();
        const idx = doctors.findIndex(d => d.id === id);
        if (idx !== -1) {
            doctors[idx] = { ...doctors[idx], ...updates };
            this.saveDoctors(doctors);
            return doctors[idx];
        }
        return null;
    },

    deleteDoctor(id) {
        const doctors = this.getDoctors().filter(d => d.id !== id);
        this.saveDoctors(doctors);
    },

    getBookings() {
        try {
            return JSON.parse(localStorage.getItem('docnear_bookings') || '[]');
        } catch (e) {
            console.error('Error parsing bookings data', e);
            return [];
        }
    },

    addBooking(booking) {
        const bookings = this.getBookings();
        booking.id = 'b' + Date.now();
        booking.status = 'confirmed';
        booking.createdAt = new Date().toISOString();
        bookings.push(booking);
        localStorage.setItem('docnear_bookings', JSON.stringify(bookings));
        return booking;
    },

    updateBookingStatus(id, status) {
        const bookings = this.getBookings();
        const idx = bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
            bookings[idx].status = status;
            localStorage.setItem('docnear_bookings', JSON.stringify(bookings));
        }
    },

    deleteBooking(id) {
        const bookings = this.getBookings().filter(b => b.id !== id);
        localStorage.setItem('docnear_bookings', JSON.stringify(bookings));
    },

    validateAdmin(username, password) {
        try {
            const admin = JSON.parse(localStorage.getItem('docnear_admin') || '{}');
            return admin.username === username && admin.password === password;
        } catch (e) { return false; }
    },

    isAdminLoggedIn() {
        return sessionStorage.getItem('docnear_admin_session') === 'true';
    },

    loginAdmin() {
        sessionStorage.setItem('docnear_admin_session', 'true');
    },

    logoutAdmin() {
        sessionStorage.removeItem('docnear_admin_session');
    }
};
