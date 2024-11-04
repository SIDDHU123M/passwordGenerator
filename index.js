const characters = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "~`!@#$%^&*()_-+={[}]|:;<>,.?/",
};

const genPass = document.querySelector(".generate-btn");
const passwordBoxes = document.querySelectorAll(".password-box");
const theme = document.querySelector("#theme");
const prevPass = document.querySelector(".previous-passwords");
const hint = document.querySelector("#hint");
const hide = document.querySelector("#hide");
const bigContainer = document.querySelector(".bigContainer");
const deleteLS = document.querySelector("#deleteLS");

const options = {
  uppercase: document.querySelector("#uppercase"),
  lowercase: document.querySelector("#lowercase"),
  numbers: document.querySelector("#numbers"),
  symbols: document.querySelector("#symbols"),
};

passwordBoxes.forEach((box) => (box.textContent = "Pass"));

const updatePassList = () => {
  const passList = document.querySelectorAll(".password-list");
  passList.forEach((pass) => {
    pass.addEventListener("click", () => {
      navigator.clipboard.writeText(pass.textContent);
    });
  });
};

const generatePassword = (length) => {
  let password = "";
  let availableCharacters = "";

  if (options.uppercase.checked) availableCharacters += characters.uppercase;
  if (options.lowercase.checked) availableCharacters += characters.lowercase;
  if (options.numbers.checked) availableCharacters += characters.numbers;
  if (options.symbols.checked) availableCharacters += characters.symbols;

  if (availableCharacters.length === 0) return "Select options";

  while (password.length < length) {
    const char =
      availableCharacters[
        Math.floor(Math.random() * availableCharacters.length)
      ];
    password += char;
  }
  return password;
};

genPass.addEventListener("click", () => {
  passwordBoxes.forEach((box) => (box.textContent = generatePassword(12)));
});

let copiedPasswords = JSON.parse(localStorage.getItem("copiedPasswords")) || [];

const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

hint.style.display = "block";

const updatePrevPass = () => {
  prevPass.innerHTML = copiedPasswords
    .map((pass) => `<div class="password-list">${escapeHtml(pass)}</div>`)
    .join("");
  if (JSON.parse(localStorage.getItem("copiedPasswords"))) {
    hint.style.display = "none";
  }
};

updatePrevPass();

document.body.addEventListener("change", updatePrevPass);

document.body.addEventListener("click", (event) => {
  if (event.target.matches(".password-boxx img")) {
    const img = event.target;
    const box = img.parentElement.querySelector(".password-box");
    const password = box.textContent;

    navigator.clipboard.writeText(password);

    if (!copiedPasswords.includes(password) && password !== "Pass") {
      if (copiedPasswords.length === 5) {
        copiedPasswords.shift();
      }
      copiedPasswords.push(password);
      localStorage.setItem("copiedPasswords", JSON.stringify(copiedPasswords));
      updatePrevPass();
      updatePassList();
    }

    img.src = "tick.svg";
    img.style.filter = "invert(1)";
    setTimeout(() => {
      img.src = "copy.svg";
      img.style.filter = "invert(0)";
    }, 1000);
  }
});

theme.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");
});

let remeberHide = JSON.parse(localStorage.getItem("remeberHide")) || true;

if (remeberHide) {
  prevPass.style.display = prevPass.style.display === "none" ? "flex" : "none";
  document.querySelector("#srcHide").src = remeberHide
    ? "show.svg"
    : "hide.svg";
  if (window.matchMedia("(max-width: 767)").matches) {
    bigContainer.style.flexDirection = "column";
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    bigContainer.style.flexDirection =
      bigContainer.style.flexDirection === "column" ? "row" : "column";
  }
  hint.style.display = "none";
}

hide.addEventListener("click", () => {
  document.querySelector("#srcHide").src = remeberHide
    ? "hide.svg"
    : "show.svg";
  prevPass.style.display = prevPass.style.display === "none" ? "flex" : "none";
  if (window.matchMedia("(max-width: 767)").matches) {
    bigContainer.style.flexDirection = "column";
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    bigContainer.style.flexDirection =
      bigContainer.style.flexDirection === "column" ? "row" : "column";
  }
  hint.style.display = "none";

  remeberHide = !remeberHide;
  localStorage.setItem("remeberHide", JSON.stringify(remeberHide));
});

deleteLS.addEventListener("click", () => {
  hide.style.display = "block";
  localStorage.removeItem("copiedPasswords");
  copiedPasswords = [];
  updatePrevPass();
  document.querySelector("#deleted").src = "tick.svg";
  setTimeout(() => {
    document.querySelector("#deleted").src = "delete.svg";
  }, 1500);
});
