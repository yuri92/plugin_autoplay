let player;

function getNextActivityLink() {
    return $('#next-activity-link').attr('href');
}

function getDateInMillis(hours, minutes) {
    const date = new Date();
    date.setHours(hours, minutes);

    return date
}

function initFasceOrarie() {
    let isVideoPaused = false;
    setInterval(() => {

        if(!player){
            return;
        }

        try{
            const currentTime = Date.now();

            const pausaPranzoStart = getDateInMillis(12,55);
            const pausaPranzoEnd = getDateInMillis(14,5);

            if(currentTime >= pausaPranzoStart && currentTime <= pausaPranzoEnd){
                player.pause();
                isVideoPaused = true;
            } else {
                if(isVideoPaused){
                    player.play();
                    isVideoPaused = false;
                }
            }


        } catch {}
    }, 60000)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function init() {
    let nextActivityLink = getNextActivityLink();

    if(nextActivityLink){
        setTimeout(() => {
            window.location.href = nextActivityLink;
        }, getRandomInt(5,10))

    } else {
        const interval = setInterval(() => {
            try{
                player = new Vimeo.Player($('iframe')[0]);

                player.play();

                player.on('ended', () => {
                    console.log('video finito, vado al prossimo')
                    setTimeout(() => {
                        nextActivityLink = getNextActivityLink();
                        if(nextActivityLink){
                            window.location.href = nextActivityLink;
                        } else {
                            window.location.reload();
                        }
                    }, 8000)
                })

                initFasceOrarie();

                clearInterval(interval);
            } catch {

            }
        }, 3000)
    }

}



$(window).on('load',() => {
    init();
})