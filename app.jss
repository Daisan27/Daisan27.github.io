// =========================
// Portfolio Script
// GitHub API Integration
// =========================

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const repoList = document.querySelector("#repo-list");
const githubStatus = document.querySelector("#github-status");
const githubProfile = document.querySelector("#github-profile");
const githubTitle = document.querySelector("#github-title");

year.textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const fallbackRepos = [
  {
    name: "automation-control-system",
    description: "Contoh project sistem kontrol otomasi berbasis mikrokontroler dan sensor industri.",
    html_url: "#",
    language: "Arduino",
    stargazers_count: 0,
    forks_count: 0,
  },
  {
    name: "plc-hmi-learning",
    description: "Dokumentasi pembelajaran PLC, HMI, dan konsep otomasi industri.",
    html_url: "#",
    language: "PLC",
    stargazers_count: 0,
    forks_count: 0,
  },
  {
    name: "instrumentation-dashboard",
    description: "Contoh dashboard sederhana untuk monitoring data instrumentasi.",
    html_url: "#",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
  },
];

function renderRepos(repos) {
  repoList.innerHTML = "";

  repos.slice(0, 6).forEach((repo) => {
    const description = repo.description || "Repository ini belum memiliki deskripsi.";
    const language = repo.language || "General";

    const card = document.createElement("article");
    card.className = "repo-card reveal visible";
    card.innerHTML = `
      <div>
        <h3>${repo.name}</h3>
        <p>${description}</p>
        <div class="repo-meta">
          <span>${language}</span>
          <span>★ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
        </div>
      </div>
      <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noopener">Lihat Repository →</a>
    `;

    repoList.appendChild(card);
  });
}

async function loadGithubRepos() {
  const username = document.body.dataset.githubUser;

  if (!username || username === "GITHUB_USERNAME") {
    githubTitle.textContent = "Repository Preview";
    githubStatus.textContent = "Masukkan username GitHub di file index.html agar repository asli tampil otomatis.";
    githubProfile.href = "https://github.com/";
    renderRepos(fallbackRepos);
    return;
  }

  githubProfile.href = `https://github.com/${username}`;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

    if (!response.ok) {
      throw new Error("GitHub user tidak ditemukan atau limit API tercapai.");
    }

    const repos = await response.json();

    if (!repos.length) {
      githubStatus.textContent = "Belum ada repository publik yang tersedia.";
      renderRepos(fallbackRepos);
      return;
    }

    githubStatus.textContent = `Menampilkan ${Math.min(repos.length, 6)} repository terbaru dari GitHub.`;
    renderRepos(repos);
  } catch (error) {
    githubStatus.textContent = error.message;
    renderRepos(fallbackRepos);
  }
}

loadGithubRepos();
