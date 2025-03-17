const cards = [
    { 
        name: "Zwykła karta", 
        rarity: "common", 
        chance: 50, 
        subCards: [
            //MARVEL
            { name: "MARCIN STARK", image: "images/Mstark.jpg" },
            { name: "CZARNY WDOWIEC", image: "images/Swdowa.jpg" },
            { name: "MS. PLONEK", image: "images/Pmarvel.jpg" },
            //DC
            { name: "POBIN", image: "images/Ppobin.jpg" },
            { name: "HARLEY CZOP", image: "images/Mharley.jpg" },
            { name: "CZOPER", image: "images/Mjoker.jpg" },
            //GOW
            { name: "IRYTUJĄCY ŁEB", image: "images/Pmimir.jpg" },
            //WIEDŹMIN
            { name: "UMA", image: "images/Suma.jpg" },
            //BLOODBORN
            { name: "PLEBS II", image: "images/Pplebs.jpg" },
            //HORIZON
            { name: "OLGIEREND", image: "images/Oerend.jpg" },
            { name: "KACPALO", image: "images/Kkotalo.jpg" },
            { name: "PRADAWNY CZOP", image: "images/Mrost.jpg" }
        ]
    },
    { 
        name: "Rzadka karta", 
        rarity: "rare", 
        chance: 30, 
        subCards: [
            //MARVEL
            { name: "PUNISHCZOP", image: "images/Mpunish.jpg" },
            //DC
            { name: "CZOPER & HARLEY CZOP", image: "images/Mjh.jpg" },
            //GOW
            { name: "WSZECHOJCIEC", image: "images/Kodyn.jpg" },
            { name: "BALDUR", image: "images/Obal.jpg" },
            { name: "ATREUSEK", image: "images/Satr.jpg" },
            //HORIZON
            { name: "ŚMIERTKOY", image: "images/Saloy.jpg" }
        ]
    },
    { 
        name: "Epicka karta", 
        rarity: "epic", 
        chance: 15, 
        subCards: [
            //MARVEL
            { name: "DOCTOR STRANGE", image: "images/Kstrange.jpg" },
            { name: "SCARLET WITCH", image: "images/Owanda.jpg" },
            //DC
            { name: "FATBAT & POBIN", image: "images/MPbr.jpg" },
            //WIEDŻMIN
            { name: "LAMBERT I ESKEL", image: "images/KSlamesk.jpg" },
            //BLOODBORN
            { name: "LIGA TROPICIELI", image: "images/OKMliga.jpg" }
        ]
    },
    { 
        name: "Legendarna karta", 
        rarity: "legendary", 
        chance: 5, 
        subCards: [
            //MARVEL
            { name: "DOCTOR STRANGE & SCARLET WITCH", image: "images/OKws.jpg" },
            //DC
            { name: "FATBAT", image: "images/Mfatbat.jpg" },
            //GOW
            { name: "GOD OF HUNGER", image: "images/Mgoh.jpg" },
            //WIEDŻMIN
            { name: "OLGIERD", image: "images/Olgierd.jpg" },
            { name: "CZOP Z WIEJSKIEJ", image: "images/Mgeralt.jpg" },
            //BLOODBORN
            { name: "LADY ŚMIERTKA", image: "images/Slady.jpg" }
        ]
    }
];

let playerCollection = []; 
let currentUser = null;
let openCount = 0;
const MAX_OPENS = 1000;

function openBox() {
    const random = Math.random() * 100;
    let cumulativeChance = 0;

    for (const card of cards) {
        cumulativeChance += card.chance;
        if (random <= cumulativeChance) {
            const subCards = card.subCards;
            const specificCard = subCards[Math.floor(Math.random() * subCards.length)];
            return { ...specificCard, rarity: card.rarity };
        }
    }
}

function updateCollection(card) {
    const isCardInCollection = playerCollection.some(c => c.name === card.name);

    if (!isCardInCollection) {
        playerCollection.push(card);
    }
    renderCollection();
    saveProgress();
}

function renderCollection() {
    const collectionDiv = document.getElementById('collectionCards');
    collectionDiv.innerHTML = "";

    const rarities = ["legendary", "epic", "rare", "common"];
    rarities.forEach(rarity => {
        const collectedCards = playerCollection.filter(card => card.rarity === rarity);
        const totalCount = cards.find(card => card.rarity === rarity).subCards.length;

        collectionDiv.innerHTML += `
            <h3>${capitalize(rarity)} karty (${collectedCards.length}/${totalCount})</h3>
            <div id="section-${rarity}" style="display: flex; flex-wrap: wrap; margin-bottom: 20px;"></div>
        `;

        const sectionDiv = document.getElementById(`section-${rarity}`);
        collectedCards.forEach((card, index) => { // Dodajemy index
            sectionDiv.innerHTML += `
                <div style="display: inline-block; margin: 10px; text-align: center;">
                    <img src="${card.image}" alt="${card.name}" style="width: 100px; height: auto;">
                    <p>${card.name}</p> 
                </div>
            `;
        });
    });
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function removeCard(cardName) {
    const cardIndex = playerCollection.findIndex(card => card.name === cardName);
    if (cardIndex !== -1) {
        playerCollection.splice(cardIndex, 1);
        saveProgress();
        renderCollection();
    }
}

function saveProgress() {
    if (currentUser) {
        localStorage.setItem(currentUser, JSON.stringify(playerCollection));
    }
}

function loadProgress() {
    if (currentUser) {
        const savedData = localStorage.getItem(currentUser);
        playerCollection = savedData ? JSON.parse(savedData) : [];
        renderCollection();
    }
}

function loadOpenData() {
    if (currentUser) {
        const data = JSON.parse(localStorage.getItem(`${currentUser}_openData`)) || {};
        const today = new Date().toISOString().split('T')[0];

        if (data.date !== today) {
            openCount = 0;
            saveOpenData();
        } else {
            openCount = data.openCount || 0;
        }

        updateOpenBoxButton();
    }
}

function saveOpenData() {
    if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        const data = { date: today, openCount };
        localStorage.setItem(`${currentUser}_openData`, JSON.stringify(data));
    }
}

function updateOpenBoxButton() {
    const openBoxButton = document.getElementById('openBox');
    if (openCount >= MAX_OPENS) {
        openBoxButton.disabled = true;
        openBoxButton.innerText = 'Limit otwarć osiągnięty';
    } else {
        openBoxButton.disabled = false;
        openBoxButton.innerText = `Otwórz skrzynkę (${MAX_OPENS - openCount} pozostało)`;
    }
}

document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        currentUser = username;
        document.getElementById('welcomeUser').innerText = username;
        document.getElementById('login').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        loadProgress();
        loadOpenData();
    } else {
        alert('Proszę wpisać nazwę użytkownika!');
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    saveProgress();
    saveOpenData();
    currentUser = null;
    document.getElementById('login').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('username').value = '';
});

document.getElementById('openBox').addEventListener('click', () => {
    if (openCount < MAX_OPENS) {
        const card = openBox();
        const resultDiv = document.getElementById('result');

        resultDiv.innerHTML = `
            <h2>Wylosowałeś: ${card.name} (${card.rarity})</h2>
            <img src="${card.image}" alt="${card.name}" style="width: 200px; height: auto;">
        `;
        updateCollection(card);

        openCount++;
        saveOpenData();
        updateOpenBoxButton();
    }
});
