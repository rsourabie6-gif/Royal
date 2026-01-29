// Données des trajets
const trajets = [
    {
        id: 1,
        depart: "Ouagadougou",
        destination: "Bobo-Dioulasso",
        distance: "350 km",
        duree: "5 heures",
        prix: 5000,
        type: "interieur",
        departures: ["06:00", "08:00", "12:00", "16:00", "20:00"]
    },
    {
        id: 2,
        depart: "Ouagadougou",
        destination: "Koudougou",
        distance: "100 km",
        duree: "1h30",
        prix: 1500,
        type: "interieur",
        departures: ["07:00", "10:00", "13:00", "16:00"]
    },
    {
        id: 3,
        depart: "Bobo-Dioulasso",
        destination: "Banfora",
        distance: "85 km",
        duree: "1h15",
        prix: 1200,
        type: "interieur",
        departures: ["08:00", "11:00", "14:00", "17:00"]
    },
    {
        id: 4,
        depart: "Ouagadougou",
        destination: "Accra (Ghana)",
        distance: "900 km",
        duree: "12 heures",
        prix: 15000,
        type: "international",
        departures: ["06:00", "18:00"]
    },
    {
        id: 5,
        depart: "Ouagadougou",
        destination: "Abidjan (Côte d'Ivoire)",
        distance: "1100 km",
        duree: "15 heures",
        prix: 18000,
        type: "international",
        departures: ["07:00", "19:00"]
    },
    {
        id: 6,
        depart: "Ouagadougou",
        destination: "Lomé (Togo)",
        distance: "800 km",
        duree: "11 heures",
        prix: 14000,
        type: "international",
        departures: ["08:00"]
    },
    {
        id: 7,
        depart: "Koudougou",
        destination: "Bobo-Dioulasso",
        distance: "250 km",
        duree: "3h30",
        prix: 3500,
        type: "interieur",
        departures: ["09:00", "14:00"]
    },
    {
        id: 8,
        depart: "Ouagadougou",
        destination: "Fada N'Gourma",
        distance: "220 km",
        duree: "3 heures",
        prix: 3000,
        type: "interieur",
        departures: ["07:00", "13:00", "17:00"]
    }
];

// Données des villes disponibles
const villes = [
    "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", 
    "Ouahigouya", "Fada N'Gourma", "Dédougou", "Tenkodogo", 
    "Accra (Ghana)", "Abidjan (Côte d'Ivoire)", "Lomé (Togo)"
];

// Variables globales
let selectedTrajet = null;
let selectedPaiement = null;
let currentTicket = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les trajets
    initTrajets();
    
    // Initialiser les formulaires
    initForms();
    
    // Initialiser les filtres
    initFilters();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Initialiser les options de paiement
    initPaiementOptions();
    
    // Initialiser la date minimale pour les formulaires
    initDateInputs();
    
    // Initialiser les modales
    initModals();
});

// Fonction d'initialisation des trajets
function initTrajets() {
    const trajetsContainer = document.querySelector('.trajets-container');
    
    // Vider le conteneur
    trajetsContainer.innerHTML = '';
    
    // Créer les cartes de trajet
    trajets.forEach(trajet => {
        const trajetCard = document.createElement('div');
        trajetCard.className = `trajet-card ${trajet.type}`;
        
        trajetCard.innerHTML = `
            <div class="trajet-header">
                <div class="trajet-route">${trajet.depart} → ${trajet.destination}</div>
                <div class="trajet-type">${trajet.type === 'interieur' ? 'Intérieur' : 'International'}</div>
            </div>
            <div class="trajet-body">
                <div class="trajet-info">
                    <div class="trajet-detail">
                        <i class="fas fa-road"></i>
                        <p>Distance</p>
                        <span>${trajet.distance}</span>
                    </div>
                    <div class="trajet-detail">
                        <i class="fas fa-clock"></i>
                        <p>Durée</p>
                        <span>${trajet.duree}</span>
                    </div>
                    <div class="trajet-detail">
                        <i class="fas fa-bus"></i>
                        <p>Départs</p>
                        <span>${trajet.departures.length} par jour</span>
                    </div>
                </div>
                <div class="trajet-price">
                    <div class="price">${trajet.prix.toLocaleString()} FCFA</div>
                    <div class="trajet-actions">
                        <button class="btn btn-primary reserve-btn" data-id="${trajet.id}">Réserver</button>
                        <button class="btn btn-secondary acheter-btn" data-id="${trajet.id}">Acheter</button>
                    </div>
                </div>
            </div>
        `;
        
        trajetsContainer.appendChild(trajetCard);
    });
    
    // Ajouter les écouteurs d'événements aux boutons
    document.querySelectorAll('.reserve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const trajetId = parseInt(this.getAttribute('data-id'));
            scrollToReservation(trajetId);
        });
    });
    
    document.querySelectorAll('.acheter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const trajetId = parseInt(this.getAttribute('data-id'));
            scrollToAchat(trajetId);
        });
    });
}

// Fonction d'initialisation des formulaires
function initForms() {
    // Remplir les sélecteurs de villes
    const departSelects = document.querySelectorAll('select[id$="depart"]');
    const destinationSelects = document.querySelectorAll('select[id$="destination"]');
    
    departSelects.forEach(select => {
        villes.forEach(ville => {
            const option = document.createElement('option');
            option.value = ville;
            option.textContent = ville;
            select.appendChild(option);
        });
    });
    
    destinationSelects.forEach(select => {
        villes.forEach(ville => {
            const option = document.createElement('option');
            option.value = ville;
            option.textContent = ville;
            select.appendChild(option);
        });
    });
    
    // Formulaire de réservation
    const reservationForm = document.getElementById('reservation-form');
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleReservation();
    });
    
    // Formulaire d'achat
    const achatForm = document.getElementById('achat-form');
    achatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleAchatStep1();
    });
    
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContact();
    });
}

// Fonction d'initialisation des filtres
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Filtrer les trajets
            const filter = this.getAttribute('data-filter');
            filterTrajets(filter);
        });
    });
}

// Fonction de filtrage des trajets
function filterTrajets(filter) {
    const trajetCards = document.querySelectorAll('.trajet-card');
    
    trajetCards.forEach(card => {
        if (filter === 'tous') {
            card.style.display = 'block';
        } else {
            if (card.classList.contains(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Fonction d'initialisation du menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });
    
    // Fermer le menu au clic sur un lien
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            navUl.classList.remove('show');
        });
    });
}

// Fonction d'initialisation des options de paiement
function initPaiementOptions() {
    const paiementOptions = document.querySelectorAll('.paiement-option');
    
    paiementOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Retirer la classe selected de toutes les options
            paiementOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Ajouter la classe selected à l'option cliquée
            this.classList.add('selected');
            
            // Enregistrer le mode de paiement sélectionné
            selectedPaiement = this.getAttribute('data-paiement');
            
            // Afficher les détails de paiement
            const paiementDetails = document.getElementById('paiement-details');
            paiementDetails.classList.remove('hidden');
        });
    });
    
    // Bouton de finalisation du paiement
    const finaliserPaiementBtn = document.getElementById('finaliser-paiement');
    if (finaliserPaiementBtn) {
        finaliserPaiementBtn.addEventListener('click', handleFinaliserPaiement);
    }
}

// Fonction d'initialisation des champs de date
function initDateInputs() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Définir la date d'aujourd'hui comme date minimale
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.setAttribute('min', formattedDate);
        
        // Définir une date par défaut (demain)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedTomorrow = tomorrow.toISOString().split('T')[0];
        input.value = formattedTomorrow;
    });
}

// Fonction d'initialisation des modales
function initModals() {
    const modal = document.getElementById('ticket-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Fermer la modale en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Bouton d'envoi du ticket par WhatsApp
    const whatsappTicketBtn = document.getElementById('whatsapp-ticket');
    if (whatsappTicketBtn) {
        whatsappTicketBtn.addEventListener('click', sendTicketViaWhatsApp);
    }
    
    // Bouton de téléchargement du ticket
    const downloadTicketBtn = document.getElementById('download-ticket');
    if (downloadTicketBtn) {
        downloadTicketBtn.addEventListener('click', downloadTicket);
    }
}

// Fonction de défilement vers la réservation
function scrollToReservation(trajetId) {
    const reservationSection = document.getElementById('reservation');
    reservationSection.scrollIntoView({ behavior: 'smooth' });
    
    // Pré-remplir le formulaire si un trajet est sélectionné
    if (trajetId) {
        const trajet = trajets.find(t => t.id === trajetId);
        if (trajet) {
            document.getElementById('reservation-depart').value = trajet.depart;
            document.getElementById('reservation-destination').value = trajet.destination;
            selectedTrajet = trajet;
        }
    }
}

// Fonction de défilement vers l'achat
function scrollToAchat(trajetId) {
    const achatSection = document.getElementById('achat');
    achatSection.scrollIntoView({ behavior: 'smooth' });
    
    // Pré-remplir le formulaire si un trajet est sélectionné
    if (trajetId) {
        const trajet = trajets.find(t => t.id === trajetId);
        if (trajet) {
            document.getElementById('achat-depart').value = trajet.depart;
            document.getElementById('achat-destination').value = trajet.destination;
            selectedTrajet = trajet;
        }
    }
}

// Fonction de gestion de la réservation
function handleReservation() {
    // Récupérer les données du formulaire
    const nom = document.getElementById('reservation-nom').value;
    const phone = document.getElementById('reservation-phone').value;
    const email = document.getElementById('reservation-email').value;
    const depart = document.getElementById('reservation-depart').value;
    const destination = document.getElementById('reservation-destination').value;
    const date = document.getElementById('reservation-date').value;
    const passagers = document.getElementById('reservation-passagers').value;
    const message = document.getElementById('reservation-message').value;
    
    // Valider les données
    if (!nom || !phone || !email || !depart || !destination || !date || !passagers) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Trouver le trajet correspondant
    const trajet = trajets.find(t => t.depart === depart && t.destination === destination);
    let prix = 0;
    
    if (trajet) {
        prix = trajet.prix * parseInt(passagers);
    } else {
        // Si le trajet n'est pas dans la liste, utiliser un prix par défaut
        prix = 5000 * parseInt(passagers);
    }
    
    // Créer le message pour WhatsApp
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const whatsappMessage = `Bonjour, je souhaite réserver un billet avec Royal Transport.%0A%0A` +
                          `*Informations de réservation:*%0A` +
                          `Nom: ${nom}%0A` +
                          `Téléphone: ${phone}%0A` +
                          `Email: ${email}%0A` +
                          `Trajet: ${depart} → ${destination}%0A` +
                          `Date: ${formattedDate}%0A` +
                          `Nombre de passagers: ${passagers}%0A` +
                          `Prix estimé: ${prix.toLocaleString()} FCFA%0A` +
                          (message ? `Message: ${message}%0A` : '') +
                          `%0AJe vous remercie!`;
    
    // Ouvrir WhatsApp avec le message pré-rempli
    const whatsappUrl = `https://wa.me/22677030941?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Réinitialiser le formulaire
    document.getElementById('reservation-form').reset();
    
    // Réinitialiser la date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];
    document.getElementById('reservation-date').value = formattedTomorrow;
    
    // Afficher un message de confirmation
    alert('Votre demande de réservation a été envoyée! Vous allez être redirigé vers WhatsApp pour confirmation.');
}

// Fonction de gestion de l'achat (étape 1)
function handleAchatStep1() {
    // Récupérer les données du formulaire
    const nom = document.getElementById('achat-nom').value;
    const phone = document.getElementById('achat-phone').value;
    const email = document.getElementById('achat-email').value;
    const depart = document.getElementById('achat-depart').value;
    const destination = document.getElementById('achat-destination').value;
    const date = document.getElementById('achat-date').value;
    const passagers = document.getElementById('achat-passagers').value;
    const type = document.getElementById('achat-type').value;
    
    // Valider les données
    if (!nom || !phone || !email || !depart || !destination || !date || !passagers || !type) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Trouver le trajet correspondant
    const trajet = trajets.find(t => t.depart === depart && t.destination === destination);
    
    if (!trajet) {
        alert('Désolé, ce trajet n\'est pas disponible. Veuillez choisir un autre trajet.');
        return;
    }
    
    // Calculer le prix selon le type de siège
    let prixParPassager = trajet.prix;
    
    if (type === 'confort') {
        prixParPassager = 7500;
    } else if (type === 'vip') {
        prixParPassager = 10000;
    }
    
    const total = prixParPassager * parseInt(passagers);
    
    // Mettre à jour le récapitulatif
    document.getElementById('summary-trajet').textContent = `${depart} → ${destination}`;
    document.getElementById('summary-passagers').textContent = passagers;
    
    let typeText = 'Standard';
    if (type === 'confort') typeText = 'Confort';
    if (type === 'vip') typeText = 'VIP';
    
    document.getElementById('summary-type').textContent = typeText;
    document.getElementById('summary-total').textContent = `${total.toLocaleString()} FCFA`;
    
    // Stocker les données de l'achat pour l'étape suivante
    currentTicket = {
        nom,
        phone,
        email,
        depart,
        destination,
        date,
        passagers: parseInt(passagers),
        type,
        prixParPassager,
        total,
        trajetId: trajet.id,
        reference: `RT-${Date.now().toString().substr(-6)}`
    };
    
    // Afficher la section de paiement
    const paiementSection = document.getElementById('paiement-section');
    paiementSection.classList.remove('hidden');
    
    // Masquer le bouton de soumission initial
    const achatSubmitBtn = document.getElementById('achat-submit');
    achatSubmitBtn.classList.add('hidden');
    
    // Défiler vers la section de paiement
    paiementSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fonction de finalisation du paiement
function handleFinaliserPaiement() {
    // Vérifier qu'un mode de paiement est sélectionné
    if (!selectedPaiement) {
        alert('Veuillez sélectionner un mode de paiement');
        return;
    }
    
    // Vérifier le numéro de téléphone pour le paiement
    const paiementNumero = document.getElementById('paiement-numero').value;
    if (!paiementNumero || paiementNumero.length < 8) {
        alert('Veuillez entrer un numéro de téléphone valide pour le paiement');
        return;
    }
    
    // Simuler le processus de paiement
    simulatePaiement()
        .then(() => {
            // Générer le ticket
            generateTicket();
            
            // Afficher le ticket dans la modale
            showTicketModal();
            
            // Réinitialiser le formulaire
            resetAchatForm();
        })
        .catch(error => {
            alert(`Erreur lors du paiement: ${error}`);
        });
}

// Fonction de simulation de paiement
function simulatePaiement() {
    return new Promise((resolve, reject) => {
        // Simuler un délai de traitement
        setTimeout(() => {
            // Simuler un succès de paiement dans 90% des cas
            if (Math.random() < 0.9) {
                resolve();
            } else {
                reject('Échec du paiement. Veuillez réessayer.');
            }
        }, 1500);
    });
}

// Fonction de génération du ticket
function generateTicket() {
    if (!currentTicket) return;
    
    const ticketContent = document.getElementById('ticket-content');
    const formattedDate = new Date(currentTicket.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Générer un numéro de siège aléatoire
    const seatNumber = Math.floor(Math.random() * 40) + 1;
    const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 4)); // A à D
    const seat = `${seatNumber}${seatLetter}`;
    
    // Générer un code QR fictif (en réalité, on utiliserait une bibliothèque QR code)
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentTicket.reference}`;
    
    ticketContent.innerHTML = `
        <div class="ticket-sample">
            <div class="ticket-header">
                <h5>Royal Transport</h5>
                <p>E-TICKET</p>
            </div>
            <div class="ticket-body">
                <div class="ticket-info">
                    <p><strong>Référence:</strong> ${currentTicket.reference}</p>
                    <p><strong>Passager:</strong> ${currentTicket.nom}</p>
                    <p><strong>Téléphone:</strong> ${currentTicket.phone}</p>
                    <p><strong>Trajet:</strong> ${currentTicket.depart} → ${currentTicket.destination}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Heure de départ:</strong> 08:00</p>
                    <p><strong>Siège:</strong> ${seat}</p>
                    <p><strong>Type:</strong> ${currentTicket.type.toUpperCase()}</p>
                    <p><strong>Passagers:</strong> ${currentTicket.passagers}</p>
                    <p><strong>Prix total:</strong> ${currentTicket.total.toLocaleString()} FCFA</p>
                    <p><strong>Mode de paiement:</strong> ${selectedPaiement.toUpperCase()}</p>
                    <p><strong>Statut:</strong> <span style="color: green;">Payé</span></p>
                </div>
                <div class="ticket-qr">
                    <div class="qr-placeholder">
                        <img src="${qrCode}" alt="QR Code" style="width: 100px; height: 100px;">
                    </div>
                    <p>Code: ${currentTicket.reference}</p>
                </div>
            </div>
        </div>
    `;
}

// Fonction d'affichage de la modale du ticket
function showTicketModal() {
    const modal = document.getElementById('ticket-modal');
    modal.style.display = 'block';
}

// Fonction de réinitialisation du formulaire d'achat
function resetAchatForm() {
    // Réinitialiser le formulaire
    document.getElementById('achat-form').reset();
    
    // Cacher la section de paiement
    document.getElementById('paiement-section').classList.add('hidden');
    
    // Afficher à nouveau le bouton de soumission initial
    document.getElementById('achat-submit').classList.remove('hidden');
    
    // Réinitialiser les sélections de paiement
    document.querySelectorAll('.paiement-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    document.getElementById('paiement-details').classList.add('hidden');
    
    // Réinitialiser les champs de paiement
    document.getElementById('paiement-numero').value = '';
    document.getElementById('paiement-code').value = '';
    
    // Réinitialiser les variables
    selectedPaiement = null;
    
    // Réinitialiser la date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];
    document.getElementById('achat-date').value = formattedTomorrow;
}

// Fonction d'envoi du ticket par WhatsApp
function sendTicketViaWhatsApp() {
    if (!currentTicket) return;
    
    const formattedDate = new Date(currentTicket.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const message = `Bonjour, voici votre billet Royal Transport!%0A%0A` +
                   `*Détails du billet:*%0A` +
                   `Référence: ${currentTicket.reference}%0A` +
                   `Passager: ${currentTicket.nom}%0A` +
                   `Trajet: ${currentTicket.depart} → ${currentTicket.destination}%0A` +
                   `Date: ${formattedDate}%0A` +
                   `Heure: 08:00%0A` +
                   `Passagers: ${currentTicket.passagers}%0A` +
                   `Type: ${currentTicket.type.toUpperCase()}%0A` +
                   `Prix total: ${currentTicket.total.toLocaleString()} FCFA%0A` +
                   `%0APrésentez ce message à l'embarquement.%0A` +
                   `Bon voyage avec Royal Transport! 🚌`;
    
    const whatsappUrl = `https://wa.me/${currentTicket.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Fonction de téléchargement du ticket
function downloadTicket() {
    if (!currentTicket) return;
    
    // Créer un contenu de ticket formaté pour le téléchargement
    const formattedDate = new Date(currentTicket.date).toLocaleDateString('fr-FR');
    
    const ticketContent = `
ROYAL TRANSPORT - E-TICKET
============================

Référence: ${currentTicket.reference}
Passager: ${currentTicket.nom}
Téléphone: ${currentTicket.phone}
Email: ${currentTicket.email}

Trajet: ${currentTicket.depart} → ${currentTicket.destination}
Date: ${formattedDate}
Heure de départ: 08:00
Passagers: ${currentTicket.passagers}
Type: ${currentTicket.type.toUpperCase()}

Prix total: ${currentTicket.total.toLocaleString()} FCFA
Mode de paiement: ${selectedPaiement.toUpperCase()}
Statut: Payé

============================
Présentez ce billet à l'embarquement.
Bon voyage avec Royal Transport!
`;
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billet-royal-transport-${currentTicket.reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fonction de gestion du formulaire de contact
function handleContact() {
    const contactForm = document.getElementById('contact-form');
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    // Vérifier que tous les champs sont remplis
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });
    
    if (!allFilled) {
        alert('Veuillez remplir tous les champs du formulaire de contact');
        return;
    }
    
    // Simuler l'envoi du message
    setTimeout(() => {
        alert('Merci pour votre message! Nous vous répondrons dans les plus brefs délais.');
        contactForm.reset();
    }, 1000);
}

// Gestion du défilement fluide pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
