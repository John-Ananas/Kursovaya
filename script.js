let resume = {
    name: "", email: "", phone: "", photo: "",
    jobs: [],
    edu: [],
    skills: [],
    courses: "", certs: "", lang: "",
    template: "marketing"
};

let step = 0;
const stepsCount = 5;

const templates = [
    { id: "it", name: "IT-специалист" },
    { id: "marketing", name: "Маркетолог" },
    { id: "accountant", name: "Бухгалтер" },
    { id: "engineer", name: "Инженер" },
    { id: "manager", name: "Менеджер" }
];

function renderForm() {
    let html = "";
    
    if (step === 0) {
        html = `
            <h3>Личные данные</h3>
            <input type="text" id="name" placeholder="ФИО" value="${resume.name}">
            <input type="email" id="email" placeholder="Email" value="${resume.email}">
            <input type="tel" id="phone" placeholder="Телефон" value="${resume.phone}">
            <input type="text" id="photo" placeholder="Фото (URL)" value="${resume.photo}">
            <select id="template">
                ${templates.map(t => `<option value="${t.id}" ${resume.template === t.id ? "selected" : ""}>${t.name}</option>`).join('')}
            </select>
        `;
    }
    else if (step === 1) {
        html = `<h3>Опыт работы</h3><div id="jobsList">`;
        resume.jobs.forEach((job, i) => {
            html += `<div class="item">
                <input placeholder="Компания" id="jobComp${i}" value="${job.company}">
                <input placeholder="Должность" id="jobPos${i}" value="${job.position}">
                <input placeholder="Период" id="jobPeriod${i}" value="${job.period}">
                <button onclick="removeJob(${i})">❌</button>
            </div>`;
        });
        html += `<button onclick="addJob()">+ Добавить</button></div>`;
    }
    else if (step === 2) {
        html = `<h3>Образование</h3><div id="eduList">`;
        resume.edu.forEach((e, i) => {
            html += `<div class="item">
                <input placeholder="Учебное заведение" id="eduInst${i}" value="${e.institution}">
                <input placeholder="Специальность" id="eduSpec${i}" value="${e.specialty}">
                <input placeholder="Годы" id="eduYear${i}" value="${e.years}">
                <button onclick="removeEdu(${i})">❌</button>
            </div>`;
        });
        html += `<button onclick="addEdu()">+ Добавить</button></div>`;
    }
    else if (step === 3) {
        html = `<h3>Навыки</h3><div id="skillsList">`;
        resume.skills.forEach((s, i) => {
            html += `<div class="item">
                <input placeholder="Навык" id="skillName${i}" value="${s.name}">
                <select id="skillLevel${i}">
                    <option ${s.level === "Начальный" ? "selected" : ""}>Начальный</option>
                    <option ${s.level === "Средний" ? "selected" : ""}>Средний</option>
                    <option ${s.level === "Продвинутый" ? "selected" : ""}>Продвинутый</option>
                </select>
                <button onclick="removeSkill(${i})">❌</button>
            </div>`;
        });
        html += `<button onclick="addSkill()">+ Добавить</button></div>`;
    }
    else if (step === 4) {
        html = `
            <h3>Дополнительно</h3>
            <textarea id="courses" placeholder="Курсы">${resume.courses}</textarea>
            <textarea id="certs" placeholder="Сертификаты">${resume.certs}</textarea>
            <input id="lang" placeholder="Языки" value="${resume.lang}">
        `;
    }
    
    document.getElementById("form-area").innerHTML = html;
    updateButtons();
}

function saveForm() {
    if (step === 0) {
        resume.name = document.getElementById("name")?.value || "";
        resume.email = document.getElementById("email")?.value || "";
        resume.phone = document.getElementById("phone")?.value || "";
        resume.photo = document.getElementById("photo")?.value || "";
        resume.template = document.getElementById("template")?.value || "marketing";
    }
    else if (step === 1) {
        for (let i = 0; i < resume.jobs.length; i++) {
            resume.jobs[i].company = document.getElementById(`jobComp${i}`)?.value || "";
            resume.jobs[i].position = document.getElementById(`jobPos${i}`)?.value || "";
            resume.jobs[i].period = document.getElementById(`jobPeriod${i}`)?.value || "";
        }
    }
    else if (step === 2) {
        for (let i = 0; i < resume.edu.length; i++) {
            resume.edu[i].institution = document.getElementById(`eduInst${i}`)?.value || "";
            resume.edu[i].specialty = document.getElementById(`eduSpec${i}`)?.value || "";
            resume.edu[i].years = document.getElementById(`eduYear${i}`)?.value || "";
        }
    }
    else if (step === 3) {
        for (let i = 0; i < resume.skills.length; i++) {
            resume.skills[i].name = document.getElementById(`skillName${i}`)?.value || "";
            resume.skills[i].level = document.getElementById(`skillLevel${i}`)?.value || "Средний";
        }
    }
    else if (step === 4) {
        resume.courses = document.getElementById("courses")?.value || "";
        resume.certs = document.getElementById("certs")?.value || "";
        resume.lang = document.getElementById("lang")?.value || "";
    }
    
    updatePreview();
    saveToStorage();
}

function addJob() { resume.jobs.push({ company: "", position: "", period: "" }); renderForm(); }
function removeJob(i) { resume.jobs.splice(i, 1); renderForm(); saveForm(); }
function addEdu() { resume.edu.push({ institution: "", specialty: "", years: "" }); renderForm(); }
function removeEdu(i) { resume.edu.splice(i, 1); renderForm(); saveForm(); }
function addSkill() { resume.skills.push({ name: "", level: "Средний" }); renderForm(); }
function removeSkill(i) { resume.skills.splice(i, 1); renderForm(); saveForm(); }

function updatePreview() {
    const preview = document.getElementById("preview");
    preview.className = `preview-card ${resume.template}`;
    
    let jobsHtml = resume.jobs.map(j => `<div><b>${j.position}</b> — ${j.company} (${j.period})</div>`).join("");
    let eduHtml = resume.edu.map(e => `<div><b>${e.institution}</b> — ${e.specialty} (${e.years})</div>`).join("");
    let skillsHtml = `<ul>${resume.skills.map(s => `<li>${s.name} (${s.level})</li>`).join("")}</ul>`;
    
    preview.innerHTML = `
        ${resume.photo ? `<img src="${resume.photo}" style="width:80px; border-radius:50%; float:right;">` : ""}
        <h2>${resume.name || "Имя не указано"}</h2>
        <p>📧 ${resume.email || "—"} | 📞 ${resume.phone || "—"}</p>
        <hr>
        <h3>💼 Опыт</h3>${jobsHtml || "<p>—</p>"}
        <h3>🎓 Образование</h3>${eduHtml || "<p>—</p>"}
        <h3>⚙️ Навыки</h3>${resume.skills.length ? skillsHtml : "<p>—</p>"}
        <h3>📚 Дополнительно</h3>
        <p>${resume.courses ? "Курсы: " + resume.courses + "<br>" : ""}
        ${resume.certs ? "Сертификаты: " + resume.certs + "<br>" : ""}
        ${resume.lang ? "Языки: " + resume.lang : ""}
        ${!resume.courses && !resume.certs && !resume.lang ? "—" : ""}</p>
    `;
    
    showTips();
}

function showTips() {
    let tips = [];
    if (!resume.name) tips.push("❌ Укажите ФИО");
    if (resume.skills.length < 3) tips.push("⚠️ Добавьте хотя бы 3 навыка");
    if (resume.jobs.length === 0) tips.push("💼 Добавьте опыт работы");
    if (tips.length === 0) tips.push("✅ Отлично! Резюме готово к экспорту");
    document.getElementById("tipsList").innerHTML = tips.map(t => `<li>${t}</li>`).join("");
}

async function exportPDF() {
    const el = document.getElementById("preview");
    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const w = 190, h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 10, 10, w, h);
    pdf.save("resume.pdf");
    alert("PDF готов!");
}

function next() { saveForm(); if (step < stepsCount - 1) { step++; renderForm(); } else { alert("Резюме готово!"); } }
function prev() { saveForm(); if (step > 0) { step--; renderForm(); } }
function updateButtons() {
    document.getElementById("prevBtn").disabled = (step === 0);
    document.getElementById("nextBtn").innerText = (step === stepsCount - 1) ? "🏁 Готово" : "Далее ▶";
}

function saveToStorage() { localStorage.setItem("resume", JSON.stringify(resume)); }
function loadFromStorage() {
    const saved = localStorage.getItem("resume");
    if (saved) {
        resume = JSON.parse(saved);
        updatePreview();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadFromStorage();
    renderForm();
    updatePreview();
    document.getElementById("nextBtn").onclick = next;
    document.getElementById("prevBtn").onclick = prev;
    document.getElementById("pdfBtn").onclick = exportPDF;
    document.querySelectorAll(".step").forEach(el => {
        el.onclick = () => { saveForm(); step = parseInt(el.dataset.step); renderForm(); };
    });
});

window.addJob = addJob; window.removeJob = removeJob;
window.addEdu = addEdu; window.removeEdu = removeEdu;
window.addSkill = addSkill; window.removeSkill = removeSkill;
