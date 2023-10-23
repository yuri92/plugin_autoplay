let player;

function getNextActivityLink() {
    let nextActivityLink = $('#next-activity-button a').attr('href');

    if(!nextActivityLink){
        nextActivityLink = $('#next-activity-link').attr('href');
    }

    return nextActivityLink
}

function tryToGoToNextPage(reload = true) {
    const nextActivity = getNextActivityLink()

    if(nextActivity){
        window.location.href = nextActivity;
    } else {
        if(reload) {
            window.location.reload();
        }
    }

}

function getDateInMillis(hours, minutes) {
    const date = new Date();
    date.setHours(hours, minutes);

    return date
}

function isCorrectFasciaOraria() {
    const currentTime = Date.now();

    const fineLavoro = getDateInMillis(17, 55);
    const inizioLavoro = getDateInMillis(9, 5)

    const pausaPranzoStart = getDateInMillis(12, 55);
    const pausaPranzoEnd = getDateInMillis(14, 5);

    if (currentTime < inizioLavoro) {
        //è mattina, mettiamo in pausa
        return false;
    } else if (currentTime > fineLavoro) {
        //è sera, mettiamo in pausa
        return false
    } else if (currentTime >= pausaPranzoStart && currentTime <= pausaPranzoEnd) {
        // è pausa pranzo, mettiamo in pausa
        return false;
    }

    return true;
}

function initFasceOrarie() {
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

    }, 60000)
}

function getRandomMs(min, max) {
    min = Math.ceil(min * 1000);
    max = Math.floor(max * 1000);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function init() {
    let nextActivityLink = getNextActivityLink();

    if (nextActivityLink) {
        setTimeout(() => {
            tryToGoToNextPage(false);
        }, getRandomMs(3,6))

    } else {
        const interval = setInterval(() => {
            try {
                player = new Vimeo.Player($('iframe')[0]);

                player.play();
                const titoloCorso = $('#region-main h2').text();
                showNotification('Video iniziato', titoloCorso);

                player.on('ended', () => {
                    console.log('video finito, vado al prossimo')
                    setTimeout(() => {
                        tryToGoToNextPage();
                    }, getRandomMs(5, 15))
                })

                initFasceOrarie();
                clearInterval(interval);
            } catch {

            }
        }, getRandomMs(5, 8))
    }
}

function showNotification(title, body) {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    } else {
        const options = {
            body,
            dir: 'ltr'
        };
        const notification = new Notification(title, options);
    }
}

$(window).on('load', () => {
    const interval = setInterval(() => {
        if (isCorrectFasciaOraria()) {
            init();
            clearInterval(interval)
        }
    }, 1000)
})