let turnoCorrente = 1;
let timer;
let tempoRimanente = 120; // 2 minuti
let mercatoAperto = false;

// Configurazione iniziale dei grafici
const ctxAzioni = document.getElementById('graficoAzioni').getContext('2d');
const ctxObbligazioni = document.getElementById('graficoObbligazioni').getContext('2d');
const ctxCripto = document.getElementById('graficoCripto').getContext('2d');
const ctxMateriePrime = document.getElementById('graficoMateriePrime').getContext('2d');

const graficoAzioni = new Chart(ctxAzioni, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Prezzo Azioni',
            data: [],
            borderColor: 'blue',
            fill: false
        }]
    }
});

const graficoObbligazioni = new Chart(ctxObbligazioni, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Prezzo Obbligazioni',
            data: [],
            borderColor: 'green',
            fill: false
        }]
    }
});

const graficoCripto = new Chart(ctxCripto, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Prezzo Criptovalute',
            data: [],
            borderColor: 'purple',
            fill: false
        }]
    }
});

const graficoMateriePrime = new Chart(ctxMateriePrime, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Prezzo Materie Prime',
            data: [],
            borderColor: 'orange',
            fill: false
        }]
    }
});

document.addEventListener("DOMContentLoaded", function() {
    avviaTimer(); // Avvia automaticamente il timer quando la pagina è caricata
    aggiornaGrafici(); // Aggiorna i grafici subito all'avvio del gioco
});

function prossimoTurno() {
    if (turnoCorrente >= 20) {
        alert("FINE PARTITA: salva con nome per tenere i risultati o premi reset per cominciare una nuova partita.");
        return;
    }
    turnoCorrente++;
    document.getElementById('turnoCorrente').innerText = turnoCorrente;
    avviaTimer(); // Riavvia il timer per il nuovo turno
    aggiornaGrafici();
}

function avviaTimer() {
    tempoRimanente = 120; // Reset tempo a 2 minuti
    document.getElementById('timer').innerText = formattaTempo(tempoRimanente);
    clearInterval(timer);
    timer = setInterval(aggiornaTimer, 1000);
}

function aggiornaTimer() {
    if (tempoRimanente > 0) {
        tempoRimanente--;
        document.getElementById('timer').innerText = formattaTempo(tempoRimanente);
    } else {
        chiusuraMercato();
        document.getElementById('timer').innerText = "Mercato Chiuso"; // Mostra "Mercato Chiuso" al posto del timer
        alert("Il mercato è chiuso.");
    }
}

function chiusuraMercato() {
    clearInterval(timer);
    mercatoAperto = false;
}

function resetGioco() {
    turnoCorrente = 1;
    document.getElementById('turnoCorrente').innerText = turnoCorrente;
    chiusuraMercato();
    alert("Gioco resettato.");
}

function formattaTempo(secondi) {
    const minuti = Math.floor(secondi / 60);
    const sec = secondi % 60;
    return `${minuti}:${sec < 10 ? '0' : ''}${sec}`;
}

function incrementaPrezzo(asset) {
    let prezzoAttuale = document.getElementById(`prezzoAttuale${asset}`).innerText;
    prezzoAttuale = parseInt(prezzoAttuale) + 1;
    document.getElementById(`prezzoAttuale${asset}`).innerText = prezzoAttuale;
    aggiornaGrafici();
}

function decrementaPrezzo(asset) {
    let prezzoAttuale = document.getElementById(`prezzoAttuale${asset}`).innerText;
    if (prezzoAttuale > 0) {
        prezzoAttuale = parseInt(prezzoAttuale) - 1;
        document.getElementById(`prezzoAttuale${asset}`).innerText = prezzoAttuale;
        aggiornaGrafici();
    }
}

function aggiornaGrafici() {
    const prezzoAzioni = parseInt(document.getElementById('prezzoAttualeAzioni').innerText);
    const prezzoObbligazioni = parseInt(document.getElementById('prezzoAttualeObbligazioni').innerText);
    const prezzoCripto = parseInt(document.getElementById('prezzoAttualeCripto').innerText);
    const prezzoMateriePrime = parseInt(document.getElementById('prezzoAttualeMateriePrime').innerText);

    aggiornaPrezzoGrafico(graficoAzioni, 'Turno ' + turnoCorrente, prezzoAzioni);
    aggiornaPrezzoGrafico(graficoObbligazioni, 'Turno ' + turnoCorrente, prezzoObbligazioni);
    aggiornaPrezzoGrafico(graficoCripto, 'Turno ' + turnoCorrente, prezzoCripto);
    aggiornaPrezzoGrafico(graficoMateriePrime, 'Turno ' + turnoCorrente, prezzoMateriePrime);
}

function aggiornaPrezzoGrafico(grafico, etichetta, prezzo) {
    const ultimoIndice = grafico.data.labels.length - 1;

    // Se l'ultima etichetta corrisponde al turno corrente, aggiorna solo l'ultimo punto dati
    if (grafico.data.labels[ultimoIndice] === etichetta) {
        grafico.data.datasets[0].data[ultimoIndice] = prezzo;
    } else {
        // Altrimenti, aggiungi una nuova etichetta e un nuovo punto dati
        grafico.data.labels.push(etichetta);
        grafico.data.datasets[0].data.push(prezzo);
    }
    grafico.update();
}
