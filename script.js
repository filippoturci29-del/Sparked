/* ===============================================
   CONFIGURAZIONE E GESTIONE UI
   =============================================== */

/* --- GESTIONE POPUP (Login/Register) --- */
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

if(registerLink) registerLink.addEventListener('click', ()=> { wrapper.classList.add('active'); });
if(loginLink) loginLink.addEventListener('click', ()=> { wrapper.classList.remove('active'); });
if(btnPopup) btnPopup.addEventListener('click', ()=> { wrapper.classList.add('active-popup'); });
if(iconClose) iconClose.addEventListener('click', ()=> { wrapper.classList.remove('active-popup'); });

/* --- NUOVA FUNZIONE: Apre Login da bottoni esterni --- */
function openLogin() {
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) {
        wrapper.classList.add('active-popup'); 
        wrapper.classList.remove('active');    
    }
}
window.openLogin = openLogin;

/* --- MENU IMPOSTAZIONI --- */
const settingsMenu = document.getElementById('settingsDropdown');

function toggleSettings() {
    const menu = document.getElementById('settingsDropdown');
    if(menu) menu.classList.toggle('open');
}
window.toggleSettings = toggleSettings;

window.addEventListener('click', function(e) {
    if (settingsMenu && !e.target.closest('.btnSettings') && !e.target.closest('.settings-dropdown')) {
        settingsMenu.classList.remove('open');
    }
});

/* --- DARK/LIGHT MODE --- */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if(localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    if(themeToggle) themeToggle.checked = true;
}

if(themeToggle) {
    themeToggle.addEventListener('change', function() {
        if(this.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* ===============================================
   GESTIONE UTENTE E STATO
   =============================================== */
window.onload = function() {
    if(typeof loadCountries === 'function') loadCountries(); 
    checkLoginStatus(); 
    
    // Inizializza Pagina Esplora
    if (document.getElementById('discovery-grid')) {
        initServicesPage();
    }
    // Inizializza Chat
    if (document.getElementById('messages-area')) {
        initChatSystem();
    }
    // Inizializza Profilo
    if (document.getElementById('display-name')) {
        initProfilePage();
    }
};

function checkLoginStatus() {
    const savedName = localStorage.getItem('user_name');
    const greetingBox = document.getElementById('user-greeting');
    const loginButton = document.getElementById('btnLogin'); 
    const heroBtn = document.querySelector('.btn-hero');
    const sideBtn = document.querySelector('.btn-side-login');

    if (savedName) {
        if(loginButton) loginButton.style.setProperty('display', 'none', 'important');
        if(heroBtn) heroBtn.style.display = 'none';
        if(sideBtn) sideBtn.style.display = 'none';
        if(greetingBox) {
            greetingBox.style.display = 'block';
            greetingBox.innerHTML = `Ciao, <span>${savedName}</span>`;
        }
    } else {
        if(loginButton) loginButton.style.setProperty('display', 'flex', 'important');
        if(heroBtn) heroBtn.style.display = ''; 
        if(sideBtn) sideBtn.style.display = ''; 
        if(greetingBox) greetingBox.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_pass');
    localStorage.removeItem('user_location');
    
    showToast("Disconnessione effettuata.");
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}
window.logout = logout;

/* ===============================================
   DATABASE GEOGRAFICO MASSIVO (Mondo + Dettaglio Italia)
   =============================================== */

const worldData = {
    "Italia": { 
        "Abruzzo": ["L'Aquila", "Pescara", "Chieti", "Teramo", "Montesilvano", "Avezzano", "Vasto", "Lanciano"],
        "Basilicata": ["Potenza", "Matera", "Melfi", "Policoro"],
        "Calabria": ["Catanzaro", "Reggio Calabria", "Cosenza", "Lamezia Terme", "Crotone", "Vibo Valentia", "Castrovillari"],
        "Campania": ["Napoli", "Salerno", "Giugliano in Campania", "Torre del Greco", "Pozzuoli", "Caserta", "Castellammare di Stabia", "Afragola", "Benevento", "Avellino", "Portici", "Ercolano", "Aversa", "Sorrento", "Ischia", "Capri"],
        "Emilia-Romagna": ["Bologna", "Modena", "Parma", "Reggio nell'Emilia", "Ravenna", "Rimini", "Ferrara", "Forlì", "Piacenza", "Cesena", "Carpi", "Imola", "Faenza", "Sassuolo"],
        "Friuli-Venezia Giulia": ["Trieste", "Udine", "Pordenone", "Gorizia", "Monfalcone"],
        "Lazio": ["Roma", "Latina", "Guidonia Montecelio", "Fiumicino", "Aprilia", "Viterbo", "Pomezia", "Tivoli", "Anzio", "Velletri", "Civitavecchia", "Frosinone", "Rieti"],
        "Liguria": ["Genova", "La Spezia", "Savona", "Sanremo", "Imperia", "Rapallo"],
        "Lombardia": ["Milano", "Brescia", "Monza", "Bergamo", "Busto Arsizio", "Como", "Sesto San Giovanni", "Varese", "Cinisello Balsamo", "Pavia", "Cremona", "Vigevano", "Legnano", "Gallarate", "Rho", "Mantova", "Lecco", "Lodi", "Sondrio"],
        "Marche": ["Ancona", "Pesaro", "Fano", "Ascoli Piceno", "San Benedetto del Tronto", "Senigallia", "Macerata", "Jesi", "Civitanova Marche", "Fermo"],
        "Molise": ["Campobasso", "Termoli", "Isernia"],
        "Piemonte": ["Torino", "Novara", "Alessandria", "Asti", "Moncalieri", "Cuneo", "Collegno", "Rivoli", "Nichelino", "Settimo Torinese", "Vercelli", "Biella", "Verbania"],
        "Puglia": ["Bari", "Taranto", "Foggia", "Andria", "Lecce", "Barletta", "Brindisi", "Altamura", "Molfetta", "Cerignola", "Manfredonia", "Trani", "Bisceglie", "Gallipoli"],
        "Sardegna": ["Cagliari", "Sassari", "Quartu Sant'Elena", "Olbia", "Alghero", "Nuoro", "Oristano", "Carbonia"],
        "Sicilia": ["Palermo", "Catania", "Messina", "Siracusa", "Marsala", "Gela", "Ragusa", "Trapani", "Vittoria", "Caltanissetta", "Agrigento", "Bagheria", "Modica", "Acireale", "Mazara del Vallo"],
        "Toscana": ["Firenze", "Prato", "Livorno", "Arezzo", "Pisa", "Pistoia", "Lucca", "Grosseto", "Massa", "Carrara", "Viareggio", "Siena", "Scandicci"],
        "Trentino-Alto Adige": ["Trento", "Bolzano", "Rovereto", "Merano", "Bressanone"],
        "Umbria": ["Perugia", "Terni", "Foligno", "Città di Castello", "Spoleto", "Gubbio", "Assisi"],
        "Valle d'Aosta": ["Aosta"],
        "Veneto": ["Venezia", "Verona", "Padova", "Vicenza", "Treviso", "Rovigo", "Chioggia", "Bassano del Grappa", "San Donà di Piave", "Schio", "Mira", "Belluno"]
    }, 
    "Francia": { 
        "Île-de-France": ["Parigi", "Boulogne-Billancourt", "Saint-Denis", "Versailles"],
        "Provenza-Alpi-Costa Azzurra": ["Marsiglia", "Nizza", "Tolone", "Aix-en-Provence", "Cannes"],
        "Alvernia-Rodano-Alpi": ["Lione", "Saint-Étienne", "Grenoble", "Annecy"],
        "Nuova Aquitania": ["Bordeaux", "Limoges", "Poitiers", "Biarritz"],
        "Occitania": ["Tolosa", "Montpellier", "Nîmes", "Perpignano"],
        "Grande Est": ["Strasburgo", "Reims", "Metz", "Mulhouse"]
    },
    "Spagna": { 
        "Comunità di Madrid": ["Madrid", "Móstoles", "Alcalá de Henares", "Fuenlabrada"],
        "Catalogna": ["Barcellona", "L'Hospitalet de Llobregat", "Badalona", "Terrassa", "Girona"],
        "Andalusia": ["Siviglia", "Málaga", "Cordova", "Granada", "Jerez de la Frontera"],
        "Comunità Valenciana": ["Valencia", "Alicante", "Elche"],
        "Paesi Baschi": ["Bilbao", "Vitoria-Gasteiz", "San Sebastián"],
        "Galizia": ["Vigo", "A Coruña", "Ourense", "Santiago di Compostela"]
    },
    "Germania": {
        "Berlino": ["Berlino"],
        "Baviera": ["Monaco di Baviera", "Norimberga", "Augusta", "Ratisbona"],
        "Amburgo": ["Amburgo"],
        "Renania Settentrionale-Vestfalia": ["Colonia", "Düsseldorf", "Dortmund", "Essen", "Duisburg"],
        "Assia": ["Francoforte sul Meno", "Wiesbaden", "Kassel"],
        "Baden-Württemberg": ["Stoccarda", "Karlsruhe", "Mannheim", "Friburgo"]
    },
    "Regno Unito": {
        "Inghilterra": ["Londra", "Birmingham", "Manchester", "Leeds", "Liverpool", "Bristol", "Newcastle"],
        "Scozia": ["Glasgow", "Edimburgo", "Aberdeen", "Dundee"],
        "Galles": ["Cardiff", "Swansea", "Newport"],
        "Irlanda del Nord": ["Belfast", "Derry"]
    },
    "Svizzera": {
        "Zurigo": ["Zurigo", "Winterthur"],
        "Ginevra": ["Ginevra"],
        "Vaud": ["Losanna"],
        "Berna": ["Berna"],
        "Ticino": ["Lugano", "Bellinzona", "Locarno"]
    },
    "Stati Uniti": {
        "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
        "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno"],
        "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
        "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
        "Illinois": ["Chicago", "Aurora", "Naperville"],
        "Nevada": ["Las Vegas", "Reno"]
    },
    "Giappone": {
        "Kanto": ["Tokyo", "Yokohama", "Kawasaki", "Saitama"],
        "Kansai": ["Osaka", "Kyoto", "Kobe"],
        "Chubu": ["Nagoya"],
        "Hokkaido": ["Sapporo"],
        "Kyushu": ["Fukuoka"]
    },
    "Brasile": {
        "San Paolo": ["San Paolo", "Guarulhos", "Campinas"],
        "Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias"],
        "Distretto Federale": ["Brasilia"],
        "Bahia": ["Salvador"]
    },
    "Cina": {
        "Municipalità": ["Pechino", "Shanghai", "Tianjin", "Chongqing"],
        "Guangdong": ["Guangzhou", "Shenzhen", "Dongguan"],
        "Zhejiang": ["Hangzhou", "Ningbo"],
        "Sichuan": ["Chengdu"]
    },
    "Australia": {
        "Nuovo Galles del Sud": ["Sydney", "Newcastle"],
        "Victoria": ["Melbourne", "Geelong"],
        "Queensland": ["Brisbane", "Gold Coast"],
        "Australia Occidentale": ["Perth"]
    },
    "Argentina": {
        "Buenos Aires": ["Buenos Aires", "La Plata", "Mar del Plata"],
        "Córdoba": ["Córdoba"],
        "Santa Fe": ["Rosario"]
    }
};

const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const geoStatus = document.getElementById('geo-status');

// Funzione per caricare gli stati manualmente
function loadCountries() {
    if(countrySelect) {
        // Lasciamo vuoto per far funzionare la label CSS
        countrySelect.innerHTML = '<option value="" disabled selected></option>'; 
        // Ordina alfabeticamente le chiavi (Nazioni)
        const sortedCountries = Object.keys(worldData).sort();
        
        for (let country of sortedCountries) {
            let option = document.createElement('option');
            option.value = country;
            option.text = country;
            countrySelect.add(option);
        }
    }
}

// Funzioni per caricare regioni e città manualmente
window.loadStates = function() {
    if(!stateSelect) return;
    stateSelect.length = 1; citySelect.length = 1;
    stateSelect.disabled = true; citySelect.disabled = true;
    
    // Gestione classe per CSS (label che sale)
    if(countrySelect.value) countrySelect.classList.add('filled');

    const sel = countrySelect.value;
    if (worldData[sel]) {
        // Ordina alfabeticamente le regioni
        const sortedRegions = Object.keys(worldData[sel]).sort();
        
        sortedRegions.forEach(r => {
            let opt = document.createElement('option');
            opt.value = r; opt.text = r;
            stateSelect.add(opt);
        });
        stateSelect.disabled = false;
    }
};

window.loadCities = function() {
    if(!citySelect) return;
    citySelect.length = 1; citySelect.disabled = true;
    
    if(stateSelect.value) stateSelect.classList.add('filled');

    const c = countrySelect.value; 
    const s = stateSelect.value;
    
    if (worldData[c] && worldData[c][s]) {
        // Ordina alfabeticamente le città
        const sortedCities = worldData[c][s].sort();
        
        sortedCities.forEach(city => {
            let opt = document.createElement('option');
            opt.value = city; opt.text = city;
            citySelect.add(opt);
        });
        citySelect.disabled = false;
    }
    
    // Fix finale per città selezionata manualmente
    citySelect.addEventListener('change', function() {
        if(this.value) this.classList.add('filled');
    });
};

// --- NUOVA FUNZIONE RILEVA POSIZIONE (AUTO-COMPILAZIONE) ---
window.getLocation = function() {
    if (!navigator.geolocation) { 
        if(geoStatus) geoStatus.innerText = "GPS non supportato."; 
        return; 
    }
    
    if(geoStatus) geoStatus.innerText = "Ricerca satellite in corso...";
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        if(geoStatus) geoStatus.innerText = "Trovato! Recupero indirizzo...";

        try {
            // Usiamo l'API gratuita di OpenStreetMap
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            
            const address = data.address;
            
            // Recuperiamo i dati (con fallback se i nomi sono diversi)
            const detectedCountry = address.country;
            const detectedState = address.state || address.region;
            const detectedCity = address.city || address.town || address.village || address.municipality;

            // Compiliamo i campi forzando l'inserimento
            forceFillSelect(countrySelect, detectedCountry);
            
            // Sblocchiamo il prossimo
            stateSelect.disabled = false;
            forceFillSelect(stateSelect, detectedState);
            
            // Sblocchiamo l'ultimo
            citySelect.disabled = false;
            forceFillSelect(citySelect, detectedCity);

            if(geoStatus) {
                geoStatus.innerText = "Posizione applicata!";
                geoStatus.style.color = "#4cc767";
            }

        } catch (error) {
            console.error(error);
            if(geoStatus) geoStatus.innerText = "Errore nel recupero dell'indirizzo.";
        }

    }, () => {
        if(geoStatus) geoStatus.innerText = "Impossibile trovare la posizione.";
    });
};

// --- FUNZIONE FIXATA: forza il valore e aggiunge la classe .filled ---
function forceFillSelect(selectElement, value) {
    if (!selectElement || !value) return;

    // 1. Controlla se l'opzione esiste già
    let exists = false;
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value.toLowerCase() === value.toLowerCase()) {
            selectElement.selectedIndex = i;
            exists = true;
            break;
        }
    }

    // 2. Se non esiste, la creiamo al volo
    if (!exists) {
        let option = document.createElement('option');
        option.value = value;
        option.text = value;
        selectElement.add(option);
        selectElement.value = value;
    }

    // 3. FONDAMENTALE: Aggiungi la classe "filled" per il CSS
    selectElement.classList.add('filled');
    
    // 4. Trigger evento change per sicurezza
    selectElement.dispatchEvent(new Event('change'));
}

function register(event) {
    event.preventDefault(); 
    const username = document.getElementById('reg-user').value;
    localStorage.setItem('user_name', username);
    localStorage.setItem('user_location', "Milano, Italia"); 
    
    document.getElementById('popupOverlay').classList.add('active-popup');
    wrapper.classList.remove('active');
    checkLoginStatus(); 
}
window.register = register;

function closePopup() {
    const popup = document.getElementById('popupOverlay');
    if(popup) popup.classList.remove('active-popup');
}
window.closePopup = closePopup;

function login(event) {
    event.preventDefault();
    if(!localStorage.getItem('user_name')) localStorage.setItem('user_name', 'Utente Demo');
    
    showToast("Bentornato su Sparked!");
    
    if(wrapper) wrapper.classList.remove('active-popup');
    checkLoginStatus(); 
}
window.login = login;

function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    input.type = input.type === "password" ? "text" : "password";
    icon.name = input.type === "password" ? "eye-off" : "eye";
}
window.togglePassword = togglePassword;

/* ===============================================
   LOGICA PAGINA ESPLORA (SERVICES)
   =============================================== */

const discoveryUsers = [
    { name: "Valentina", age: 24, loc: "Milano", distance: 5, img: "https://i.pravatar.cc/300?img=5", tags: ["Viaggi", "Sushi"], category: "travel" },
    { name: "Marco", age: 29, loc: "Roma", distance: 580, img: "https://i.pravatar.cc/300?img=11", tags: ["Calcio", "Cinema"], category: "sport" },
    { name: "Sofia", age: 22, loc: "Torino", distance: 140, img: "https://i.pravatar.cc/300?img=9", tags: ["Arte", "Moda"], category: "art" },
    { name: "Alessandro", age: 31, loc: "Napoli", distance: 750, img: "https://i.pravatar.cc/300?img=3", tags: ["Musica", "Pizza"], category: "art" },
    { name: "Elena", age: 26, loc: "Firenze", distance: 300, img: "https://i.pravatar.cc/300?img=1", tags: ["Libri", "Natura"], category: "travel" },
    { name: "Giovanni", age: 38, loc: "Bologna", distance: 210, img: "https://i.pravatar.cc/300?img=13", tags: ["Tech", "Cucina"], category: "tech" },
    { name: "Chiara", age: 52, loc: "Venezia", distance: 270, img: "https://i.pravatar.cc/300?img=24", tags: ["Fotografia", "Mare"], category: "art" },
    { name: "Davide", age: 19, loc: "Milano", distance: 8, img: "https://i.pravatar.cc/300?img=53", tags: ["Gaming", "Palestra"], category: "tech" },
    { name: "Roberto", age: 45, loc: "Monza", distance: 15, img: "https://i.pravatar.cc/300?img=60", tags: ["Running", "Business"], category: "sport" }
];

function initServicesPage() {
    renderUsers(discoveryUsers);
}
window.initServicesPage = initServicesPage;

function renderUsers(usersList) {
    const container = document.getElementById('discovery-grid');
    if (!container) return;

    container.innerHTML = "";
    
    // Recupera i like
    let myLikes = JSON.parse(localStorage.getItem('sparked_likes')) || [];
    
    if (usersList.length === 0) {
        container.innerHTML = `<div class="no-results">
            <p>Nessun profilo trovato con questi filtri.</p>
        </div>`;
        return;
    }
    
    usersList.forEach(u => {
        const card = document.createElement('div');
        card.classList.add('discovery-card');
        
        // Check Like
        const isLiked = myLikes.some(likedUser => likedUser.name === u.name);
        const heartIcon = isLiked ? 'heart' : 'heart-outline';
        const heartClass = isLiked ? 'liked' : '';
        
        let tagsHtml = u.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');

        card.innerHTML = `
            <div class="discovery-img-box">
                <img src="${u.img}" alt="${u.name}">
                <button class="btn-like ${heartClass}" onclick="toggleLike('${u.name}', '${u.img}', '${u.age}')">
                    <ion-icon name="${heartIcon}"></ion-icon>
                </button>
                <div class="status-dot"></div>
            </div>
            <div class="discovery-content">
                <div>
                    <div class="user-header">
                        <h3>${u.name}, ${u.age}</h3>
                        <p class="location"><ion-icon name="location-outline"></ion-icon> ${u.loc} (${u.distance}km)</p>
                    </div>
                    <div class="tags">${tagsHtml}</div>
                </div>
                <button class="btn-connect" onclick="openChat('${u.name}', '${u.img}')">
                    <ion-icon name="chatbubbles-outline"></ion-icon> Chatta ora
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funzione Toggle Like
window.toggleLike = function(name, img, age) {
    let myLikes = JSON.parse(localStorage.getItem('sparked_likes')) || [];
    const index = myLikes.findIndex(user => user.name === name);

    if (index !== -1) {
        myLikes.splice(index, 1); 
    } else {
        myLikes.push({ name: name, img: img, age: age }); 
    }

    localStorage.setItem('sparked_likes', JSON.stringify(myLikes));
    
    // Se siamo su Services, riapplica i filtri per aggiornare la vista
    if (document.getElementById('discovery-grid')) {
        applyFilters(); 
    }
};

/* --- FUNZIONE FILTRI --- */
function applyFilters() {
    const ageVal = document.getElementById('filter-age').value;
    const distVal = document.getElementById('filter-distance').value;
    const interestVal = document.getElementById('filter-interest').value;

    const myLikes = JSON.parse(localStorage.getItem('sparked_likes')) || [];

    const filtered = discoveryUsers.filter(user => {
        // Filtro Età
        let ageMatch = true;
        if (ageVal !== 'all') {
            if (ageVal === '18-25') ageMatch = user.age >= 18 && user.age <= 25;
            else if (ageVal === '25-35') ageMatch = user.age > 25 && user.age <= 35;
            else if (ageVal === '35-50') ageMatch = user.age > 35 && user.age <= 50;
            else if (ageVal === '50+') ageMatch = user.age > 50;
        }

        // Filtro Distanza
        let distMatch = true;
        if (distVal !== 'all') {
            distMatch = user.distance <= parseInt(distVal);
        }

        // Filtro Interessi (incluso "I Miei Like")
        let interestMatch = true;
        if (interestVal === 'liked') {
            interestMatch = myLikes.some(likedUser => likedUser.name === user.name);
        } else if (interestVal !== 'all') {
            interestMatch = user.category === interestVal;
        }

        return ageMatch && distMatch && interestMatch;
    });

    renderUsers(filtered);
}
window.applyFilters = applyFilters;

/* ===============================================
   PAGINA PROFILO
   =============================================== */
function initProfilePage() {
    const username = localStorage.getItem('user_name') || "Ospite";
    const displayName = document.getElementById('display-name');
    if(displayName) displayName.innerText = username;

    // Foto Profilo
    const profileImage = document.getElementById('profile-image');
    const fileInput = document.getElementById('upload-photo');
    const savedPhoto = localStorage.getItem('sparked_user_photo');
    
    if (savedPhoto && profileImage) {
        profileImage.src = savedPhoto;
    }

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64String = event.target.result;
                    if(profileImage) profileImage.src = base64String;
                    try {
                        localStorage.setItem('sparked_user_photo', base64String);
                        showToast("Foto profilo aggiornata!");
                    } catch (err) {
                        showToast("Immagine troppo grande!", "error");
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Bio
    const userBio = document.getElementById('user-bio');
    if(userBio) {
        userBio.value = localStorage.getItem('sparked_user_bio') || "";
    }

    // Caricamento Like
    const container = document.getElementById('matches-grid');
    if(container) {
        const myLikes = JSON.parse(localStorage.getItem('sparked_likes')) || [];
        container.innerHTML = "";
        
        if (myLikes.length === 0) {
            container.innerHTML = "<p style='color:#ccc; grid-column: 1/-1;'>Non hai ancora messo like a nessuno.</p>";
        } else {
            myLikes.forEach(u => {
                const card = document.createElement('div');
                card.classList.add('match-card');
                card.innerHTML = `
                    <img src="${u.img}" class="match-img" alt="${u.name}">
                    <div class="match-info">
                        <h4>${u.name}, ${u.age}</h4>
                        <button class="btn-chat" onclick="openChat('${u.name}', '${u.img}')">Chatta</button>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    }
}

window.saveBio = function() {
    const bioText = document.getElementById('user-bio').value;
    localStorage.setItem('sparked_user_bio', bioText);
    showToast("La tua bio è stata salvata!");
};

/* ===============================================
   SISTEMA CHAT 
   =============================================== */
window.openChat = function(name, img) {
    localStorage.setItem('chat_target_name', name);
    localStorage.setItem('chat_target_img', img);
    window.location.href = 'chat.html';
};

window.initChatSystem = function() {
    const name = localStorage.getItem('chat_target_name');
    const img = localStorage.getItem('chat_target_img');
    const nameEl = document.getElementById('chat-username');
    const imgEl = document.getElementById('chat-avatar');
    
    if(nameEl && name) nameEl.innerText = name;
    if(imgEl && img) imgEl.src = img;

    const area = document.getElementById('messages-area');
    if(area && area.children.length === 0) {
        setTimeout(() => {
            addMessage(`Ciao! Ho visto il tuo profilo, sembra molto interessante! 😎`, 'received');
        }, 800);
    }
};

window.sendMessage = function() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if(text !== "") {
        addMessage(text, 'sent');
        input.value = ""; 
        const delay = 1000 + Math.random() * 2000;
        setTimeout(() => {
            const reply = getAIResponse(text);
            addMessage(reply, 'received');
        }, delay);
    }
};

function getAIResponse(input) {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('ciao') || lowerInput.includes('ehi')) return "Ehilà! Come va?";
    if (lowerInput.includes('come stai')) return "Tutto bene! Tu che racconti?";
    if (lowerInput.includes('di dove sei')) return "Sono cittadina del mondo digitale! E tu?";
    if (lowerInput.includes('anni hai')) return "L'età giusta per divertirsi! 😉";
    const randoms = ["Interessante! Dimmi di più.", "Davvero? Non l'avrei mai detto!", "Che fai di bello nel tempo libero?", "Mi piace come ragioni."];
    return randoms[Math.floor(Math.random() * randoms.length)];
}

function addMessage(text, type) {
    const area = document.getElementById('messages-area');
    if(!area) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    msgDiv.innerText = text;
    area.appendChild(msgDiv);
    area.scrollTop = area.scrollHeight; 
}

window.handleEnter = function(e) {
    if(e.key === 'Enter') sendMessage();
}

/* ===============================================
   SISTEMA NOTIFICHE TOAST (NUOVO)
   =============================================== */
function showToast(message, type = 'success') {
    // 1. Crea l'elemento
    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    
    // Icona in base al tipo
    let iconName = type === 'error' ? 'alert-circle' : 'checkmark-circle';
    let color = type === 'error' ? '#ff4757' : '#4cc767';

    toast.innerHTML = `
        <ion-icon name="${iconName}" style="color: ${color}"></ion-icon>
        <span>${message}</span>
    `;

    // 2. Aggiungilo alla pagina
    document.body.appendChild(toast);

    // 3. Fallo apparire (con animazione CSS)
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // 4. Rimuovilo dopo 3 secondi
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove(); // Pulizia DOM
        }, 500);
    }, 3000);
}
// Esposto globalmente
window.showToast = showToast;

/* ===============================================
   GESTIONE CLASSE 'FILLED' PER INPUT/SELECT
   (Aggiungi questo alla fine del file)
   =============================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Seleziona tutti i select dentro i box di input
    const selects = document.querySelectorAll('.input-box select');
    
    selects.forEach(select => {
        // Funzione per aggiornare la classe
        const toggleFilled = () => {
            // Se c'è un valore (e non è vuoto), aggiungi 'filled', altrimenti rimuovi
            if (select.value !== "") {
                select.classList.add('filled');
            } else {
                select.classList.remove('filled');
            }
        };

        // Ascolta il cambiamento manuale
        select.addEventListener('change', toggleFilled);

        // Controllo iniziale (se il browser ha salvato i dati o se c'è un valore di default)
        toggleFilled();
    });
});