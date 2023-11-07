//init localStorage
(function(){
    let localStorageVideos = localStorage.getItem('seenVideos');
    if(!localStorageVideos){
        localStorage.setItem('seenVideos','[]');
    }
})()

const defineUtils = () => {
    const formatTime = (timeInMillis) => {
        const date = new Date(timeInMillis);
        const formatNumber = number => number < 10 ? '0' + number : number
        return `${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}:${formatNumber(date.getSeconds())}`
    }

    const getDateInMillis = (hours, minutes) => {
        const date = new Date();
        date.setHours(hours, minutes);

        return date
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    }

    const getRandomMs = (min, max) => {
        return getRandomInt(min, max) * 1000;
    }

    const getNextActivityLink = () => {
        let nextActivityLink = $('#next-activity-button a').attr('href');

        if (!nextActivityLink) {
            nextActivityLink = $('#next-activity-link').attr('href');
        }

        return nextActivityLink
    }

    const tryToGoToNextPage = (reload = true) => {
        const nextActivity = getNextActivityLink()

        if (nextActivity) {
            window.location.href = nextActivity;
        } else {
            if (reload) {
                window.location.reload();
            }
        }
    }

    const showNotification = (title, body) => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        } else {
            const options = {
                body,
                dir: 'ltr'
            };

            return new Notification(title, options);
        }
    }

    const getSeenVideos = () => JSON.parse(localStorage.getItem('seenVideos'));

    const getCurrentVideoId = () => new URLSearchParams(window.location.search).get('id');

    const addSeenVideo = () => {
        let seenVideos = new Set([getCurrentVideoId(), ...getSeenVideos()]);
        localStorage.setItem('seenVideos', JSON.stringify([...seenVideos]));
    }

    const updateSeenTimer = (duration) => {
        let currentTimer = Number(localStorage.getItem("seenTimer"));
        currentTimer += duration;
        localStorage.setItem("seenTimer", currentTimer);
    }

    const hasVideoBeenSeen = () => getSeenVideos().includes(getCurrentVideoId());

    const convertSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        } else {
            return `${minutes}m`
        }
    }


    return {
        formatTime,
        getDateInMillis,
        getRandomInt,
        getRandomMs,
        getNextActivityLink,
        tryToGoToNextPage,
        showNotification,
        addSeenVideo,
        hasVideoBeenSeen,
        updateSeenTimer,
        convertSeconds
    }
};
const Utils = defineUtils();