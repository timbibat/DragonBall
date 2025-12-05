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

const loadCharacters = async () => {
    cardContainer.innerHTML = "";
    loadingBar.style.width = "20%";
    loadingBar.innerText = "SCANNING CHARACTERS...";

    const isDarkMode = localStorage.getItem('theme') !== 'light';

    const cardBgClass = isDarkMode ? "bg-dark text-white" : "bg-white text-dark border";

    try {
        const response = await fetch(`https://dragonball-api.com/api/characters?page=${page}&limit=12`);
        const data = await response.json();

        totalPages = data.meta.totalPages;

        data.items.forEach((character) => {
            var themeColor = raceColors[character.race] || "#DCD0C0";

            cardContainer.innerHTML += `
                 <div class="col-12 col-sm-6 col-md-4 col-lg-3 fade-in">
                    <div class="card h-100 shadow-lg ${cardBgClass}">
                        <div class="card-img-top d-flex justify-content-center align-items-center p-3" 
                             style="background: radial-gradient(circle, ${themeColor}40, transparent 70%); height: 250px;">
                            <img src="${character.image}" class="img-fluid" style="max-height: 100%; object-fit: contain;">
                        </div>
                        <div class="card-body text-center">
                            <h5 class="fw-bold text-warning fst-italic">${character.name}</h5>
                            <span class="badge" style="background-color: ${themeColor}; color: black;">${character.race}</span>
                            <div class="small opacity-75 mt-2">
                                <span class="text-secondary fw-bold">Ki:</span>
                                <span class="fw-bold">${character.ki}</span></div>
                            <div class="small opacity-75 mt-2">
                                <span class="text-secondary fw-bold">Max Ki:</span>
                                <span class="fw-bold text-warning">${character.maxKi}</span></div>
                            <div class="small opacity-75 mt-2">
                                <span class="text-secondary fw-bold">Affiliation:</span>
                                <span class="fst-italic text-info fw-bold">${character.affiliation}</span></div>
                        </div>
                    </div>
                </div>`;
        });

        loadingBar.style.width = "100%";
        setTimeout(() => { loadingBar.style.width = "0%"; }, 500);
        updatePagination();

    } catch (error) {
        console.error("Error loading characters:", error);
        cardContainer.innerHTML = "<p class='text-center'>Failed to load data. The server might be down.</p>";
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