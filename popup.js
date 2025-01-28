fetch('https://raw.githubusercontent.com/Zan1456/qna-extension/refs/heads/main/data.json')
  .then(response => response.json())
  .then(data => {
    const searchInput = document.getElementById("search");
    const resultsList = document.getElementById("results");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let currentFilter = "all";

    const savedSearchTerm = localStorage.getItem("searchTerm") || "";
    const savedFilter = localStorage.getItem("currentFilter") || "all";
    searchInput.value = savedSearchTerm;
    currentFilter = savedFilter;

    function renderResults(results) {
      resultsList.innerHTML = "";

      if (results.length === 0) {
        const noResults = document.createElement("li");
        noResults.textContent = "Nincs találat.";
        noResults.className = "no-results";
        resultsList.appendChild(noResults);
        return;
      }

      results.forEach(item => {
        const li = document.createElement("li");
        li.className = "result-item";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = item.name;
        nameSpan.className = "name";

        const valueSpan = document.createElement("span");
        valueSpan.textContent = item.value;
        valueSpan.className = "value";

        if (item.image) {
          const imgLink = document.createElement("a");
          imgLink.href = item.image;
          imgLink.target = "_blank";

          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.name || "Kép";
          img.className = "result-image";

          imgLink.appendChild(img);
          li.appendChild(nameSpan);
          li.appendChild(imgLink);
        } else {
          li.appendChild(nameSpan);
        }

        li.appendChild(valueSpan);
        resultsList.appendChild(li);
      });
    }

    function applyFilter(query) {
      const filteredData = data.filter(item => {
        switch (currentFilter) {
          case "questions":
            return item.name.toLowerCase().includes(query);
          case "answers":
            return item.value.toLowerCase().includes(query);
          case "with-images":
            return item.image && (item.name.toLowerCase().includes(query) || item.value.toLowerCase().includes(query));
          default:
            return item.name.toLowerCase().includes(query) || item.value.toLowerCase().includes(query);
        }
      });
      renderResults(filteredData);
    }

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        localStorage.setItem("currentFilter", currentFilter);
        const query = searchInput.value.toLowerCase();
        applyFilter(query);
      });
    });

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      localStorage.setItem("searchTerm", searchInput.value);
      applyFilter(query);
    });

    const initializeSearch = () => {
      if (savedSearchTerm || savedFilter !== "all") {
        applyFilter(savedSearchTerm.toLowerCase());
        const activeButton = Array.from(filterButtons).find(btn => btn.dataset.filter === savedFilter);
        if (activeButton) {
          filterButtons.forEach(btn => btn.classList.remove("active"));
          activeButton.classList.add("active");
        }
      } else {
        renderResults(data);
      }
    };

    initializeSearch();
  })
  .catch(error => console.error("Hiba a JSON betöltésekor:", error));


// Dark-Light mode
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme") || "light";
body.className = savedTheme;
themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const currentTheme = body.className;
  const newTheme = currentTheme === "light" ? "dark" : "light";
  body.className = newTheme;
  localStorage.setItem("theme", newTheme);
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

// Tippek
const helpModal = document.getElementById("help-modal");
const closeModalButton = document.getElementById("close-modal");
const infoToggle = document.getElementById("info-toggle");

const isFirstUse = localStorage.getItem("firstUse") === null;

if (isFirstUse) {
  helpModal.classList.remove("hidden");
  localStorage.setItem("firstUse", "false");
}

closeModalButton.addEventListener("click", () => {
  helpModal.classList.add("hidden");
});

infoToggle.addEventListener("click", () => {
  helpModal.classList.remove("hidden");
});