
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

    bilan.numeroIntervention =
        historique[editIndex].numeroIntervention;

    historique[editIndex] = bilan;
    editIndex = -1;

} else {

    const maintenant = new Date();

    bilan.numeroIntervention =
        maintenant.getFullYear().toString() +
        String(maintenant.getMonth() + 1).padStart(2, "0") +
        String(maintenant.getDate()).padStart(2, "0") +
        "-" +
        Date.now().toString().slice(-4);

    historique.unshift(bilan);
}

    localStorage.setItem(
        "bilans",
        JSON.stringify(historique)
    );

    ;
renderHistorique();

    console.log("NUMERO :", bilan.numeroIntervention);
console.log(bilan);

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
function renderHistorique() {

    const filtre =
        search.value.toLowerCase();
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
console.log("Historique filtré :", historique);
    
    histBody.innerHTML = "";

historique.forEach((b, i) => {

    console.log(b);
    
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${b.numeroIntervention || ""}</td>
    <td>${b.Nom || b.nom || ""}</td>
    <td>${b.Zone || b.zone || ""}</td>
    <td>
        <button onclick="showBil(${i})">
            👁 Voir
        </button>
    </td>
`;

    histBody.appendChild(row);

});

    }

function showBil(i) {

    const b = sharedHistory[i];

    modalContent.innerHTML = `

    <h2>Fiche bilan n° ${b.numeroIntervention || ""}</h2>

<p><b>N° Intervention :</b> ${b.numeroIntervention || ""}</p>
<p><b>Zone :</b> ${b.zone || ""}</p>

    <hr>

    <h3>Victime</h3>

    <p><b>Nom :</b> ${b.Nom || ""}</p>
    <p><b>Prénom :</b> ${b["Prénom"] || ""}</p>
    <p><b>Âge :</b> ${b["Âge"] || ""}</p>
    <p><b>Sexe :</b> ${b.Sexe || ""}</p>

    <hr>

    <h3>Constantes</h3>

    <p><b>Fréquence cardiaque :</b> ${b.FC || ""}</p>
    <p><b>Tension artérielle :</b> ${b.TA || ""}</p>
    <p><b>Fréquence respiratoire :</b> ${b.FR || ""}</p>
    <p><b>Saturation en oxygène :</b> ${b.SAT || ""}</p>
    <p><b>Température :</b> ${b["Température"] || ""}</p>
    <p><b>Glycémie :</b> ${b["Glycémie"] || ""}</p>

    <hr>

    <h3>Évaluation</h3>

    <p><b>Score de Glasgow :</b> ${b.Glasgow || ""}</p>
    <p><b>EVA :</b> ${b.EVA || ""}</p>
    <p><b>Localisation douleur :</b> ${b["Localisation douleur"] || ""}</p>

    <hr>

    <h3>Médical</h3>

    <p><b>Antécédents :</b><br>${b["Antécédents"] || ""}</p>

    <p><b>Allergies :</b><br>${b.Allergies || ""}</p>

    <p><b>Traitements :</b><br>${b.Traitements || ""}</p>

    <hr>

    <h3>Bilan</h3>

    <p><b>Motif :</b><br>${b.Motif || ""}</p>

    <p><b>Observations :</b><br>${b.Observations || ""}</p>

    <p><b>Destination :</b><br>${b.Destination || ""}</p>

    `;

modal.style.display = "block";

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

function closeModal() {

    document.getElementById("modal").style.display = "none";

}
