const characters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "~",
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  "{",
  "[",
  "}",
  "]",
  ",",
  "|",
  ":",
  ";",
  "<",
  ">",
  ".",
  "?",
  "/",
];

const genPass = document.querySelector(".generate-btn");
const passwordBoxes = document.querySelectorAll(".password-box");
const theme = document.querySelector("#theme");
const prevPass = document.querySelector(".previous-passwords");
const hint = document.querySelector("#hint");
const hide = document.querySelector("#hide");
const bigContainer = document.querySelector(".bigContainer");
const deleteLS = document.querySelector("#deleteLS");

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
  while (password.length < length) {
    const char = characters[Math.floor(Math.random() * characters.length)];
    if (!password.includes(char)) {
      password += char;
    }
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

let remeberHide = JSON.parse(localStorage.getItem("remeberHide")) || false;

if (!remeberHide) {
  prevPass.style.display = prevPass.style.display === "none" ? "flex" : "none";
  document.querySelector("#srcHide").src = remeberHide
    ? "hide.svg"
    : "show.svg";
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
    ? "show.svg"
    : "hide.svg";
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
  localStorage.removeItem("copiedPasswords");
  copiedPasswords = [];
  updatePrevPass();
  if (!remeberHide) {
    hide.style.display = "block";
  }
  document.querySelector("#deleted").src = "tick.svg";
  setTimeout(() => {
    document.querySelector("#deleted").src = "delete.svg";
  }, 1500);
});
