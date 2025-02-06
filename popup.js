document.addEventListener("DOMContentLoaded", () => {
  fetch('https://raw.githubusercontent.com/Zan1456/qna-extension/refs/heads/main/data.json')
    .then(response => response.json())
    .then(data => {
      const searchInput = document.getElementById("search");
      const resultsList = document.getElementById("results");
      const filterButtons = document.querySelectorAll(".filter-btn");
      const infoToggle = document.getElementById("info-toggle");
      const helpModal = document.getElementById("help-modal");
      const closeModalButton = document.getElementById("close-modal");
      let currentFilter = localStorage.getItem("currentFilter") || "all";
      let savedSearch = localStorage.getItem("searchTerm") || "";

      searchInput.value = savedSearch; // Visszaállítja a keresési mező értékét

      function formatValue(value) {
        if (value.includes("◢◤")) {
          return `<div class="listed"><ul>${value.split("◢◤").map(item => `<li>${item.trim()}</li>`).join('')}</ul></div>`;
        } else {
          return `<div class="notlist">${value}</div>`;
        }
      }

      function renderResults(results) {
        resultsList.innerHTML = "";
        if (!results.length) {
          resultsList.innerHTML = '<li class="no-results">Nincs találat.</li>';
          return;
        }
        results.forEach(item => {
          const li = document.createElement("li");
          li.className = "result-item";
          li.innerHTML = `
            <span class="name">${item.name}</span>
            <span class="value">${formatValue(item.value)}</span>
            ${item.image ? `<a href="${item.image}" target="_blank">
              <img src="${item.image}" alt="${item.name}" class="result-image">
            </a>` : ""}
          `;
          resultsList.appendChild(li);
        });

        localStorage.setItem("searchResults", JSON.stringify(results)); // Mentés localStorage-be
      }

      function applyFilter(query) {
        const filteredData = data.filter(item => {
          if (currentFilter === "questions") return item.name.toLowerCase().includes(query);
          if (currentFilter === "answers") return item.value.toLowerCase().includes(query);
          if (currentFilter === "with-images") return item.image && (item.name.toLowerCase().includes(query) || item.value.toLowerCase().includes(query));
          return item.name.toLowerCase().includes(query) || item.value.toLowerCase().includes(query);
        });
        renderResults(filteredData);
      }

      filterButtons.forEach(button => {
        button.addEventListener("click", () => {
          document.querySelector(".filter-btn.active").classList.remove("active");
          button.classList.add("active");
          currentFilter = button.dataset.filter;
          localStorage.setItem("currentFilter", currentFilter);
          applyFilter(searchInput.value.toLowerCase());
        });
      });

      searchInput.addEventListener("input", () => {
        localStorage.setItem("searchTerm", searchInput.value);
        applyFilter(searchInput.value.toLowerCase());
      });

      // Visszaállítás és automatikus keresés az elmentett szöveg alapján
      if (savedSearch) {
        applyFilter(savedSearch.toLowerCase());
      } else {
        renderResults(data);
      }

      infoToggle.addEventListener("click", () => {
        helpModal.classList.toggle("hidden");
      });
      closeModalButton.addEventListener("click", () => {
        helpModal.classList.add("hidden");
      });
    })
    .catch(error => console.error("Hiba a JSON betöltésekor:", error));

  // Téma váltás
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const savedTheme = localStorage.getItem("theme") || "light";
  body.className = savedTheme;
  themeToggle.innerHTML = `<i class="fas ${savedTheme === "dark" ? "fa-sun" : "fa-moon"}"></i>`;

  themeToggle.addEventListener("click", () => {
    const newTheme = body.className === "light" ? "dark" : "light";
    body.className = newTheme;
    localStorage.setItem("theme", newTheme);
    themeToggle.innerHTML = `<i class="fas ${newTheme === "dark" ? "fa-sun" : "fa-moon"}"></i>`;
  });
});

var manifestdetails = chrome.runtime.getManifest();
document.getElementById("version").innerText = "v" + manifestdetails.version;