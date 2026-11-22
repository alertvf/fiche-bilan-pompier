const WEBAPP =
"https://script.google.com/macros/s/AKfycbx63elSxOu2Ed287ZORTx6gwp3AltAMlirRoU11hPfP5ddbxcM4EUJsIyNoigUJxdvf/exec";
let sharedHistory = [];
let editIndex = -1;

function getData() {
    return {
        date: date.value,
        heure: heure.value,
        intervention: intervention.value,
        zone: zone.value,

        nom: nom.value,
        prenom: prenom.value,
        age: age.value,
        sexe: sexe.value,

        fc: fc.value,
        ta: ta.value,
        fr: fr.value,
        sat: sat.value,
        temperature: temp.value,
        glycemie: glycemie.value,

        glasgow: glasgow.value,
        eva: eva.value,
        localisationDouleur: douleur.value,

        antecedents: antecedents.value,
        allergies: allergies.value,
        traitements: traitements.value,

        motif: motif.value,
        observations: observations.value,

        destination: destination.value
    };
}

async function saveBil() {

    const bilan = getData();

    let historique =
        JSON.parse(localStorage.getItem("bilans") || "[]");

    if (editIndex > -1) {
        historique[editIndex] = bilan;
        editIndex = -1;
    } else {
        historique.unshift(bilan);
    }

    localStorage.setItem(
        "bilans",
        JSON.stringify(historique)
    );

    renderHistorique();

    try {
        await fetch(WEBAPP, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bilan)
        });
    } catch (e) {
        console.error(e);
    }

    alert("Bilan enregistré");
}

function newBil() {

    document
        .querySelectorAll("input, textarea")
        .forEach(el => {

            if (el.id !== "search") {
                el.value = "";
            }

        });

    sexe.selectedIndex = 0;
    glasgow.selectedIndex = 0;
    eva.selectedIndex = 0;
    destination.selectedIndex = 0;

    date.value =
        new Date().toISOString().split("T")[0];

    editIndex = -1;
}

let historique =
    sharedHistory;

historique =
    historique.filter(h =>
        (
            (h.Nom || "")
            .toLowerCase()
            .includes(filtre)
        )
        ||
        (
            (h["Prénom"] || "")
            .toLowerCase()
            .includes(filtre)
        )
    );

    histBody.innerHTML =
        historique.map((b, i) => `

<tr>

<td>${b.Date || ""}</td>

<td>${b.Nom || ""} ${b["Prénom"] || ""}</td>

<td>${b.Intervention || ""}</td>

<td>

<button
class="btn-view"
onclick="showBil(${i})">
👁 Voir
</button>

<button
class="btn-edit"
onclick="editBil(${i})">
✏ Modifier
</button>

<button
class="btn-delete"
onclick="deleteBil(${i})">
🗑 Supprimer
</button>

</td>

</tr>

`).join("");
}

function showBil(i) {

    const historique =
        JSON.parse(localStorage.getItem("bilans") || "[]");

    const b = historique[i];

    modalContent.innerHTML = `

<h2>${b.nom} ${b.prenom}</h2>

<h3>Intervention</h3>

<p><b>Date :</b> ${b.date}</p>
<p><b>Heure :</b> ${b.heure}</p>
<p><b>Numéro intervention :</b> ${b.intervention}</p>
<p><b>Zone :</b> ${b.zone}</p>

<hr>

<h3>Victime</h3>

<p><b>Nom :</b> ${b.nom}</p>
<p><b>Prénom :</b> ${b.prenom}</p>
<p><b>Âge :</b> ${b.age}</p>
<p><b>Sexe :</b> ${b.sexe}</p>

<hr>

<h3>Constantes</h3>

<p><b>Fréquence cardiaque :</b> ${b.fc}</p>

<p><b>Tension artérielle :</b> ${b.ta}</p>

<p><b>Fréquence respiratoire :</b> ${b.fr}</p>

<p><b>Saturation en oxygène :</b> ${b.sat}</p>

<p><b>Température :</b> ${b.temperature}</p>

<p><b>Glycémie :</b> ${b.glycemie}</p>

<hr>

<h3>Évaluation</h3>

<p><b>Score de Glasgow :</b> ${b.glasgow}</p>

<p><b>EVA :</b> ${b.eva}</p>

<p><b>Localisation douleur :</b>
${b.localisationDouleur}</p>

<hr>

<h3>Médical</h3>

<p><b>Antécédents :</b><br>
${b.antecedents}</p>

<p><b>Allergies :</b><br>
${b.allergies}</p>

<p><b>Traitements :</b><br>
${b.traitements}</p>

<hr>

<h3>Bilan</h3>

<p><b>Motif :</b><br>
${b.motif}</p>

<p><b>Observations :</b><br>
${b.observations}</p>

<p><b>Destination :</b><br>
${b.destination}</p>

<hr>

<button onclick="window.print()">
🖨️ Imprimer ce bilan
</button>

`;

    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

function editBil(i) {

    const historique =
        JSON.parse(localStorage.getItem("bilans") || "[]");

    const b = historique[i];

    date.value = b.date || "";
    heure.value = b.heure || "";
    intervention.value = b.intervention || "";
    zone.value = b.zone || "";

    nom.value = b.nom || "";
    prenom.value = b.prenom || "";
    age.value = b.age || "";
    sexe.value = b.sexe || "";

    fc.value = b.fc || "";
    ta.value = b.ta || "";
    fr.value = b.fr || "";
    sat.value = b.sat || "";

    temp.value = b.temperature || "";
    glycemie.value = b.glycemie || "";

    glasgow.value = b.glasgow || "";
    eva.value = b.eva || "";

    douleur.value =
        b.localisationDouleur || "";

    antecedents.value =
        b.antecedents || "";

    allergies.value =
        b.allergies || "";

    traitements.value =
        b.traitements || "";

    motif.value =
        b.motif || "";

    observations.value =
        b.observations || "";

    destination.value =
        b.destination || "";

    editIndex = i;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteBil(i) {

    if (
        !confirm(
            "Supprimer ce bilan ?"
        )
    ) {
        return;
    }

    let historique =
        JSON.parse(localStorage.getItem("bilans") || "[]");

    historique.splice(i, 1);

    localStorage.setItem(
        "bilans",
        JSON.stringify(historique)
    );

    renderHistorique();
}
async function chargerHistoriquePartage() {

    try {

        const response =
            await fetch(WEBAPP);

        sharedHistory =
            await response.json();

        console.log("Historique partagé :", sharedHistory);
 
renderHistorique();

    } catch (err) {

        console.error(err);

    }

}
window.onload = async () => {

    date.value =
        new Date()
        .toISOString()
        .split("T")[0];

    await chargerHistoriquePartage();

};
