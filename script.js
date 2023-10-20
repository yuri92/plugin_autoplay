let player;

function getNextActivityLink() {
    return $('#next-activity-link').attr('href');
}

function init() {
    let nextActivityLink = getNextActivityLink();

    if(nextActivityLink){
        window.location.href = nextActivityLink;
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