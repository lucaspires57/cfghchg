const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const accuracyEl = document.getElementById("accuracy");

const message = document.getElementById("message");
const countdown = document.getElementById("countdown");
const crosshair = document.getElementById("crosshair");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const result = document.getElementById("result");
const finalScore = document.getElementById("finalScore");
const finalStats = document.getElementById("finalStats");


let score = 0;
let time = 30;

let clicks = 0;
let hits = 0;

/* NOVO:
   conta somente os acertos consecutivos
*/
let streak = 0;

let running = false;
let countingDown = false;

let timer = null;
let countdownTimer = null;

let targetSize = 70;


/* =========================
   ATUALIZAR PLACAR
========================= */

function updateStats() {

    scoreEl.textContent = score;
    timeEl.textContent = time;

    const accuracy =
        clicks > 0
            ? Math.round((hits / clicks) * 100)
            : 0;

    accuracyEl.textContent = accuracy + "%";
}


/* =========================
   POSIÇÃO DO ALVO
========================= */

function randomPosition() {

    const rect =
        gameArea.getBoundingClientRect();

    const padding =
        targetSize / 2 + 10;

    const x =
        padding +
        Math.random() *
        (rect.width - padding * 2);

    const y =
        padding +
        Math.random() *
        (rect.height - padding * 2);

    target.style.left = x + "px";
    target.style.top = y + "px";
}


/* =========================
   MOSTRAR ALVO
========================= */

function showTarget() {

    randomPosition();

    target.style.display = "block";
}


/* =========================
   CONTAGEM 3 2 1 COMEÇAR
========================= */

function startCountdown() {

    countingDown = true;
    running = false;

    target.style.display = "none";

    crosshair.classList.remove("show");

    message.style.display = "none";

    countdown.classList.add("show");

    const numbers = [
        "3",
        "2",
        "1",
        "COMEÇAR!"
    ];

    let index = 0;

    countdown.textContent = numbers[index];

    countdown.classList.add("animate");


    countdownTimer = setInterval(() => {

        index++;

        if (index >= numbers.length) {

            clearInterval(countdownTimer);

            countdownTimer = null;

            setTimeout(() => {

                if (!countingDown) {
                    return;
                }

                countdown.classList.remove("show");

                countingDown = false;

                beginGame();

            }, 500);

            return;
        }


        countdown.textContent =
            numbers[index];


        countdown.classList.remove(
            "animate"
        );

        void countdown.offsetWidth;

        countdown.classList.add(
            "animate"
        );

    }, 900);
}


/* =========================
   COMEÇAR PARTIDA
========================= */

function beginGame() {

    score = 0;
    time = 30;
    clicks = 0;
    hits = 0;

    /* NOVO:
       começa a partida com
       0 acertos consecutivos
    */
    streak = 0;

    targetSize = 70;

    running = true;

    target.style.width =
        targetSize + "px";

    target.style.height =
        targetSize + "px";

    updateStats();

    result.classList.remove("show");

    startBtn.disabled = true;

    restartBtn.disabled = false;

    crosshair.classList.add("show");

    showTarget();


    clearInterval(timer);

    timer = setInterval(() => {

        time--;

        updateStats();

        if (time <= 0) {

            endGame();

        }

    }, 1000);
}


/* =========================
   INICIAR JOGO
========================= */

function startGame() {

    if (running || countingDown) {
        return;
    }

    score = 0;
    time = 30;
    clicks = 0;
    hits = 0;

    /* Zera a sequência */
    streak = 0;

    updateStats();

    result.classList.remove("show");

    startBtn.disabled = true;

    restartBtn.disabled = false;

    startCountdown();
}


/* =========================
   REINICIAR JOGO
========================= */

function restartGame() {

    running = false;
    countingDown = false;


    /* Cancela cronômetro */

    clearInterval(timer);
    timer = null;


    /* Cancela contagem */

    clearInterval(countdownTimer);
    countdownTimer = null;


    /* Esconde elementos */

    target.style.display = "none";

    crosshair.classList.remove(
        "show"
    );

    countdown.classList.remove(
        "show"
    );


    /* Zera jogo */

    score = 0;
    time = 30;
    clicks = 0;
    hits = 0;

    /* NOVO:
       zera sequência também
    */
    streak = 0;

    targetSize = 70;


    updateStats();


    /* Esconde resultado */

    result.classList.remove(
        "show"
    );


    /* Mensagem inicial */

    message.style.display = "flex";

    message.innerHTML = `
        <div>
            <strong>Pronto?</strong>
            Clique em "Iniciar Jogo"
            para começar.
        </div>
    `;


    /* Botões */

    startBtn.disabled = false;

    restartBtn.disabled = false;
}


/* =========================
   FINALIZAR JOGO
========================= */

function endGame() {

    running = false;
    countingDown = false;

    clearInterval(timer);

    timer = null;

    target.style.display = "none";

    crosshair.classList.remove(
        "show"
    );


    message.style.display = "flex";

    message.innerHTML = `
        <div>
            <strong>Tempo esgotado!</strong>
            Clique em "Reiniciar"
            para jogar novamente.
        </div>
    `;


    startBtn.disabled = false;

    restartBtn.disabled = false;


    const accuracy =
        clicks > 0
            ? Math.round(
                (hits / clicks) * 100
            )
            : 0;


    finalScore.textContent =
        score +
        (
            score === 1
                ? " ponto"
                : " pontos"
        );


    finalStats.textContent =
        `${hits} acertos • ` +
        `${clicks} cliques • ` +
        `${accuracy}% de precisão`;


    result.classList.add(
        "show"
    );
}


/* =========================
   ACERTOU O ALVO
========================= */

target.addEventListener(
    "click",
    (event) => {

        if (!running) {
            return;
        }

        event.stopPropagation();

        clicks++;

        hits++;

        /* Cada acerto vale 10 pontos */

        score += 10;


        /* =========================
           SEQUÊNCIA DE ACERTOS
        ========================= */

        streak++;


        /*
           A cada 10 ACERTOS SEGUIDOS
           ganha +5 segundos
        */

        if (streak === 10) {

            time += 5;

            /*
               Depois de ganhar o bônus,
               começa uma nova sequência
            */

            streak = 0;


            /* =========================
               AVISO +5 SEGUNDOS
            ========================= */

            const bonus =
                document.createElement("div");

            bonus.textContent =
                "+5 SEGUNDOS!";

            bonus.style.position =
                "absolute";

            bonus.style.top =
                "20px";

            bonus.style.left =
                "50%";

            bonus.style.transform =
                "translateX(-50%)";

            bonus.style.color =
                "#00ff66";

            bonus.style.fontSize =
                "28px";

            bonus.style.fontWeight =
                "bold";

            bonus.style.textShadow =
                "0 2px 5px #000";

            bonus.style.zIndex =
                "50";

            bonus.style.pointerEvents =
                "none";

            gameArea.appendChild(
                bonus
            );


            setTimeout(() => {

                bonus.remove();

            }, 1000);
        }


        updateStats();


        /* =========================
           ANIMAÇÃO DO ALVO
        ========================= */

        target.classList.remove("hit");

        void target.offsetWidth;

        target.classList.add("hit");


        /* =========================
           ALVO FICA MENOR
        ========================= */

        targetSize =
            Math.max(
                44,
                70 -
                Math.floor(hits / 5) * 4
            );


        target.style.width =
            targetSize + "px";

        target.style.height =
            targetSize + "px";


        /* =========================
           NOVA POSIÇÃO
        ========================= */

        showTarget();

    }
);


/* =========================
   ERROU O TIRO
========================= */

gameArea.addEventListener(
    "click",
    (event) => {

        if (!running) {
            return;
        }

        if (event.target !== target) {

            clicks++;

            /*
               ERROU:
               zera a sequência de acertos
            */

            streak = 0;


            /*
               Perde 2 pontos
            */

            score =
                Math.max(
                    0,
                    score - 2
                );


            updateStats();
        }
    }
);


/* =========================
   MIRA SEGUE O MOUSE
========================= */

gameArea.addEventListener(
    "mousemove",
    (event) => {

        if (!running) {
            return;
        }

        const rect =
            gameArea.getBoundingClientRect();

        const x =
            event.clientX -
            rect.left;

        const y =
            event.clientY -
            rect.top;

        crosshair.style.left =
            x + "px";

        crosshair.style.top =
            y + "px";
    }
);


/* =========================
   BOTÕES
========================= */

startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    restartGame
);


/* =========================
   REDIMENSIONAR TELA
========================= */

window.addEventListener(
    "resize",
    () => {

        if (running) {

            randomPosition();

        }

    }
);


/* =========================
   INICIALIZAÇÃO
========================= */

updateStats();
