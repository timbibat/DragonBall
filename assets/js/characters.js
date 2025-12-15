const raceColors = {
    "Saiyan": "#FFD700",
    "Human": "#87CEEB",
    "Namekian": "#76EE00",
    "Frieza Race": "#9370DB",
    "Android": "#C0C0C0",
    "Majin": "#FF69B4",
    "God": "#FF4500",
    "Angel": "#E0FFFF",
    "Unknown": "#6c757d"
};

var cardContainer = document.getElementById("cardContainer");
var loadingBar = document.getElementById("loadingBar");
var paginationControls = document.getElementById("paginationControls");

var page = 1;
var totalPages = 1;

function searchCharacters() {
    var searchTerm = document.getElementById("searchInput").value;
    page = 1;
    loadCharacters(searchTerm);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    loadCharacters();
}

const loadCharacters = async (searchTerm = "") => {
    cardContainer.innerHTML = "";
    loadingBar.style.width = "20%";
    const isDarkMode = localStorage.getItem('theme') !== 'light';
    const cardBgClass = isDarkMode ? "bg-dark text-white" : "bg-white text-dark border";

    let url;
    if (searchTerm) {
        url = `https://dragonball-api.com/api/characters?name=${searchTerm}`;
    } else {
        url = `https://dragonball-api.com/api/characters?page=${page}&limit=12`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Character not found");
        const data = await response.json();
        let characterList = [];

        if (Array.isArray(data)) {
            if (data.length === 0) throw new Error("No characters found");

            characterList = data;
            paginationControls.style.display = "none";
        } else {
            characterList = data.items;
            totalPages = data.meta.totalPages;
            paginationControls.style.display = "flex";
            updatePagination();
        }

        characterList.forEach((character) => {
            var themeColor = raceColors[character.race] || "#DCD0C0";

            cardContainer.innerHTML += `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 fade-in">
                    <div class="card h-100 shadow-lg ${cardBgClass}">
                        <div class="card-img-top d-flex justify-content-center align-items-center p-3" 
                             style="background: radial-gradient(circle, ${themeColor}40, transparent 70%); height: 250px;">
                            <img src="${character.image}" class="img-fluid" style="max-height: 100%; object-fit: contain;">
                        </div>
                        <div class="card-body text-center d-flex flex-column">
                            <h5 class="fw-bold text-warning fst-italic mb-2">${character.name}</h5>
                            
                            <div class="mb-3">
                                <span class="badge rounded-pill shadow-sm" style="background-color: ${themeColor}; color: black; font-size: 0.9rem;">
                                    ${character.race}
                                </span>
                            </div>
                            <hr class="my-1 border-secondary opacity-25">
                            <div class="d-flex flex-column justify-content-center gap-1 mt-2 small">
                                <div class="d-flex justify-content-between px-3">
                                    <span class="text-secondary fw-bold">Ki:</span>
                                    <span class="fw-bold">${character.ki}</span>
                                </div>
                                <div class="d-flex justify-content-between px-3">
                                    <span class="text-secondary fw-bold">Max Ki:</span>
                                    <span class="fw-bold text-warning">${character.maxKi}</span>
                                </div>
                                <div class="d-flex justify-content-between px-3">
                                    <span class="text-secondary fw-bold">Affiliation:</span>
                                    <span class="fst-italic text-info">${character.affiliation}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        loadingBar.style.width = "100%";
        loadingBar.innerText = "COMPLETE";
        setTimeout(() => { loadingBar.style.width = "0%"; loadingBar.innerText = ""; }, 500);

    } catch (error) {
        console.error("Error:", error);
        loadingBar.style.width = "0%";
        paginationControls.style.display = "none";

        cardContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-question-circle display-1 text-secondary mb-3"></i>
                <h3 class="text-white">No Character Found</h3>
                <p class="text-secondary">We couldn't find "${searchTerm}" in the database.</p>
                <button class="btn btn-outline-warning" onclick="resetSearch()">Return to Archive</button>
            </div>
        `;
    }
}

function updatePagination() {
    paginationControls.innerHTML = "";

    const isDarkMode = localStorage.getItem('theme') !== 'light';
    const btnBaseClass = isDarkMode ? "btn-dark border-secondary" : "btn-outline-dark";
    const btnTextClass = isDarkMode ? "text-secondary" : "";

    var prevDisabled = (page === 1) ? "disabled" : "";
    paginationControls.innerHTML += `
            <button class="btn ${btnBaseClass} px-3" onclick="prevPage()" ${prevDisabled}>
                <i class="bi bi-caret-left-fill"></i>
            </button>`;

    let start = page - 1;
    if (start < 1) start = 1;

    let end = start + 2;
    if (end > totalPages) {
        end = totalPages;
        start = end - 2;
        if (start < 1) start = 1;
    }

    for (let i = start; i <= end; i++) {
        var activeClass = (i === page)
            ? "btn-warning fw-bold text-dark"
            : `${btnBaseClass} ${btnTextClass}`;

        var activeStyle = (i === page) ? "box-shadow: 0 0 15px rgba(255, 193, 7, 0.6); z-index: 10;" : "";

        paginationControls.innerHTML += `
                <button class="btn ${activeClass} px-4" style="${activeStyle}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
    }

    var nextDisabled = (page >= totalPages) ? "disabled" : "";
    paginationControls.innerHTML += `
            <button class="btn ${btnBaseClass} px-3" onclick="nextPage()" ${nextDisabled}>
                <i class="bi bi-caret-right-fill"></i>
            </button>`;
}

function nextPage() {
    if (page < totalPages) {
        page++;
        loadCharacters();
    }
}

function prevPage() {
    if (page > 1) {
        page--;
        loadCharacters();
    }
}

function goToPage(num) {
    if (num !== page) {
        page = num;
        loadCharacters();
    }
}

loadCharacters();