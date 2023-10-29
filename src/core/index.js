const {showNotification, getRandomMs} = Utils;
let player;

/**
 * Rimuove la dialog con l'avvertimento del mancato play del video
 * Diminuisce l'initInterval a 1 secondo per far partire il video QUASI subito
 */
function manualRestart(){
    $('body').removeClass('modal-background');
    $('.modal').hide();
    initInterval = 1000;
    init();
}

/**
 * L'errore <i>"Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first."</i>
 * si verifica per via di un aggiornamento introdotto da Chrome nel 2018: i video non possono partire in automatico se
 * prima l'utente non interagisce con la pagina. Basta quindi un click per risolvere anche per tutti i video successivi.
 *
 * - Se la pagina non è in focus, fa comparire una notifica per avvisare l'utente. Se l'utente clicca sulla notifica e
 * ritorna manualmente sulla pagina, il video riprenderà automaticamente, perché l'interazione con una notifica è essa stessa
 * un'interazione con la pagina.
 *
 * - Se l'utente non clicca sulla notifica, mostra a video una modale bloccante che obbligherà l'utente a cliccare su
 * un pulsante. In quel momento, l'utente avrà effettivamente interagito con la pagina, quindi il video potrà ripartire.
 */
function managePlayError(err) {
    console.error(err);
    if(document.hidden){
        const notification = showNotification('ERRORE', 'Attenzione, il video non è partito. Clicca qui per avviarlo manualmente oppure torna alla pagina');
        notification.onclick = () => {
            window.parent.focus();
            notification.close();
            manualRestart()
        }
    }

    $('<style>').text(`.modal-header h3,.modal-header label{box-sizing:border-box;line-height:50px}.modal{right:0;text-align:center;bottom:0;margin:auto;width:100%;border:22em solid gray;height:100%;background-color:#fff;box-sizing:border-box;z-index:9999;display:block}.modal>p{padding:15px;margin:0}.modal-header{background-color:#f9f9f9;border-bottom:1px solid #ddd;text-align:center;box-sizing:border-box;height:50px}.modal-header h3{margin:0;padding-left:15px;color:#4d4d4d;font-size:16px;display:inline-block}.modal-header label{border-left:1px solid #ddd;float:right;padding:0 15px;cursor:pointer}.modal-header label:hover img{opacity:.6}`).appendTo(document.head)

    $('body').addClass('modal-background').prepend(`
        <div class="modal">
            <div class="modal-header">
             <h3>PLUGIN CORSO</h3>
            </div>
            <p>Il video non è partito in modalità automatica.</p>
            <p>Cliccare sul pulsante sottostante per farlo partire manualmente.</p>
            <button style="padding:2em; margin: 0 6em" id="manual-restart">Avvio manuale</button>
        </div>`
    )

    $('#manual-restart').on('click', () => manualRestart())
}

/**
 * Il video è partito correttamente.
 * 1. Manda una notifica per avvisare che il video è iniziato
 * 2. Gestisce l'evento di fine del video, in cui proverà ad andare alla pagina successiva
 * 3. Inizializza il controllo delle fasce orarie
 * 4. Ogni 30 secondi, controlla di essere nella fascia oraria corretta. Se non lo è, mette in pausa il video.
 */
function managePlaySuccess() {
    const titoloCorso = $('#region-main h2').text();
    showNotification('Video iniziato', titoloCorso);
    $('#force-start').hide();

    player.on('ended', () => {
        setTimeout(() => {
            Utils.tryToGoToNextPage();
        }, getRandomMs(5, 15))
    })

    //init fasce orarie
    let isVideoPaused = false;
    setInterval(() => {

        if (!isCorrectFasciaOraria()) {
            if (!isVideoPaused) {
                player.pause();
                isVideoPaused = true;
                showNotification('Inizio fascia oraria protetta', 'Video messo in pausa');

            }
        } else {
            if (isVideoPaused) {
                player.play();
                isVideoPaused = false;
                showNotification('Fine fascia oraria protetta', 'Video ripreso');
            }
        }

    }, 30000)
}

let initInterval = getRandomMs(5, 8);
/**
 * Avvio del video:
 * - Controlla che all'interno della pagina sia presente il pulsante "Next activity", in tal caso aspetta un lasso di tempo
 * variabile e va alla pagina successiva
 * - Se non trova il pulsante, fa partire il video.
 */
function init() {
    let nextActivityLink = Utils.getNextActivityLink();

    if (nextActivityLink) {
        setTimeout(() => {
            Utils.tryToGoToNextPage(false);
        }, getRandomMs(3, 6))

    } else {
        const interval = setInterval(() => {
            player = new Vimeo.Player($('iframe')[0]);

            player.ready().then(() => {
                player.play().then(() => {
                    clearInterval(interval);
                    managePlaySuccess();

                }).catch(err => {
                    clearInterval(interval);
                    managePlayError(err);
                });

            })
        }, initInterval)
    }
}

$(window).on('load', () => {
    const interval = setInterval(() => {
        if (isCorrectFasciaOraria()) {
            clearInterval(interval)
            init();
        }
    }, 1000)
})