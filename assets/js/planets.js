var planetContainer = document.getElementById("planetContainer");
var planetLoadingBar = document.getElementById("loadingBar");
var planetPagination = document.getElementById("paginationControls");

var page = 1;
var totalPages = 1;

function searchPlanets() {
    var searchTerm = document.getElementById("searchInput").value;
    page = 1;
    loadPlanets(searchTerm);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    loadPlanets();
}

const loadPlanets = async (searchTerm = "") => {
    planetContainer.innerHTML = "";
    planetLoadingBar.style.width = "20%";
    planetLoadingBar.innerText = "SCANNING GALAXY...";

    const isDarkMode = localStorage.getItem('theme') !== 'light';
    const cardBgClass = isDarkMode ? "bg-dark text-white" : "bg-white text-dark border";

    let url;
    if (searchTerm) {
        url = `https://dragonball-api.com/api/planets?name=${searchTerm}`;
    } else {
        url = `https://dragonball-api.com/api/planets?page=${page}&limit=8`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Planet not found");
        const data = await response.json();
        let planetList = [];
        
        if (Array.isArray(data)) {
            planetList = data;
            planetPagination.style.display = "none"; 
        } else {
            planetList = data.items;
            totalPages = data.meta.totalPages;
            planetPagination.style.display = "flex";
            updatePagination();
        }

        planetList.forEach((planet) => {
            const statusBadge = planet.isDestroyed
                ? '<span class="badge rounded-pill bg-danger shadow-sm">DESTROYED</span>'
                : '<span class="badge rounded-pill bg-success shadow-sm">INTACT</span>';

            planetContainer.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 fade-in">
                <div class="card h-100 shadow-lg overflow-hidden ${cardBgClass}">
                    <div class="card-img-top position-relative p-0" style="height: 200px; overflow: hidden;">
                        <img src="${planet.image}" class="w-100 h-100" style="object-fit: cover; filter: brightness(0.8);">
                    </div>
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="fw-bold text-warning fst-italic text-uppercase mb-2">${planet.name}</h5>
                        <div class="mb-3">
                            ${statusBadge}
                        </div>
                        <hr class="my-1 border-secondary opacity-25">
                        <div class="d-flex flex-column justify-content-center mt-3 small flex-grow-1">
                             <div class="d-flex flex-column align-items-center">
                                <span class="text-secondary fw-bold text-uppercase" style="font-size: 0.75rem;">Description</span>
                                <p class="opacity-75 mt-1 mb-0" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                    ${planet.description || "No description available."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        planetLoadingBar.style.width = "100%";
        planetLoadingBar.innerText = "COMPLETE";
        setTimeout(() => { planetLoadingBar.style.width = "0%"; planetLoadingBar.innerText = ""; }, 500);

    } catch (error) {
        console.error("Error loading planets:", error);
        planetLoadingBar.style.width = "0%";
        planetPagination.style.display = "none";
        
        planetContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-globe2 display-1 text-secondary mb-3"></i>
                <h3 class="${isDarkMode ? 'text-white' : 'text-dark'}">No Planet Found</h3>
                <p class="text-secondary">The coordinates for "${searchTerm}" do not exist in the archive.</p>
                <button class="btn btn-outline-warning" onclick="resetSearch()">Return to Galaxy Map</button>
            </div>
        `;
    }
}

function updatePagination() {
    planetPagination.innerHTML = "";

    const isDarkMode = localStorage.getItem('theme') !== 'light';
    const btnBaseClass = isDarkMode ? "btn-dark border-secondary" : "btn-outline-dark";
    const btnTextClass = isDarkMode ? "text-secondary" : "";

    var prevDisabled = (page === 1) ? "disabled" : "";
    planetPagination.innerHTML += `
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

        planetPagination.innerHTML += `
            <button class="btn ${activeClass} px-4" style="${activeStyle}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }

    var nextDisabled = (page >= totalPages) ? "disabled" : "";
    planetPagination.innerHTML += `
        <button class="btn ${btnBaseClass} px-3" onclick="nextPage()" ${nextDisabled}>
            <i class="bi bi-caret-right-fill"></i>
        </button>`;
}

function nextPage() {
    if (page < totalPages) {
        page++;
        loadPlanets();
    }
}

function prevPage() {
    if (page > 1) {
        page--;
        loadPlanets();
    }
}

function goToPage(num) {
    if (num !== page) {
        page = num;
        loadPlanets();
    }
}

loadPlanets();