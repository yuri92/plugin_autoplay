let player;

function getNextActivityLink() {
    return $('#next-activity-link').attr('href');
}

function initFasceOrarie() {
    setInterval(() => {
        try{
            const currentDate = new Date();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();

            const isMorning = (hours > 9 && minutes)

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

                clearInterval(interval);
            } catch {

            }
        }, 3000)
    }

}



$(window).on('load',() => {
    init();
})