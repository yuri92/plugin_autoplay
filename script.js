let player;

function getNextActivityLink() {
    return $('#next-activity-link').attr('href');
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
            }
        } else {
            if (isVideoPaused) {
                player.play();
                isVideoPaused = false;
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
            window.location.href = nextActivityLink;
        }, getRandomMs(5, 10))

    } else {
        const interval = setInterval(() => {
            try {
                player = new Vimeo.Player($('iframe')[0]);

                player.play();

                player.on('ended', () => {
                    console.log('video finito, vado al prossimo')
                    setTimeout(() => {
                        nextActivityLink = getNextActivityLink();
                        if (nextActivityLink) {
                            window.location.href = nextActivityLink;
                        } else {
                            window.location.reload();
                        }
                    }, getRandomMs(5, 15))
                })

                initFasceOrarie();
                clearInterval(interval);
            } catch {

            }
        }, getRandomMs(5, 8))
    }
}

$(window).on('load', () => {
    init();
    const interval = setInterval(() => {
        if (isCorrectFasciaOraria()) {
            clearInterval(interval)
        }
    }, 1000)
})