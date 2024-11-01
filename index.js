const characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "[", "}", "]", ",", "|", ":", ";", "<", ">", ".", "?", "/"];

let genPass = document.querySelector(".generate-btn");
let passwordBox = document.querySelectorAll(".password-box");
let theme = document.querySelector("#theme");
let prevPass = document.querySelector(".previous-passwords");

passwordBox[0].textContent = "Pass";
passwordBox[1].textContent = "Pass";

let passwords = (num) => {
    let parse = "";
    for (let i = 0; i < num; i++) {
        char = characters[Math.floor(Math.random() * characters.length)];
        if (!parse.includes(char)) {
            parse += char;
        }
    }
    return parse;
};
genPass.addEventListener("click", () => {
    passwordBox[0].textContent = passwords(12);
    passwordBox[1].textContent = passwords(12);
});

let copiedPasswords = JSON.parse(localStorage.getItem("copiedPasswords")) || [];

const updatePrevPass = () => {
    prevPass.innerHTML = copiedPasswords.map((pass) => `<div class="password-list">${pass}</div>`).join("");
};

updatePrevPass();

document.querySelectorAll(".password-boxx img").forEach((img) => {
    img.addEventListener("click", () => {
        let box = img.parentElement.querySelector(".password-box");
        navigator.clipboard.writeText(box.textContent);

        if (copiedPasswords.includes(box.textContent) || box.textContent === "Pass") {
            return 0;
        } else {
            if (copiedPasswords.length === 5) {
                copiedPasswords.shift();
            }
            copiedPasswords.push(box.textContent);
        }

        localStorage.setItem("copiedPasswords", JSON.stringify(copiedPasswords));
        updatePrevPass();

        img.src = "tick.svg";
        img.style.filter = "invert(1)";
        setTimeout(() => {
            img.src = "copy.svg";
            img.style.filter = "invert(0)";
        }, 1000);
    });
});

theme.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
});

document.body.addEventListener("change", () => {
    prevPass.textContent = JSON.parse(localStorage.getItem("copiedPasswords"));
});
