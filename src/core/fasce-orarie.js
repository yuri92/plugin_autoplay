const inizioLavoro = Utils.getDateInMillis(9, Utils.getRandomInt(2, 10))
const fineLavoro = Utils.getDateInMillis(17, Utils.getRandomInt(52, 58));

const pausaPranzoStart = Utils.getDateInMillis(12, Utils.getRandomInt(52, 58));
const pausaPranzoEnd = Utils.getDateInMillis(14, Utils.getRandomInt(2, 10));

console.table({
    '1. Inizio giornata lavorativa': Utils.formatTime(inizioLavoro),
    '2. Inizio pausa pranzo': Utils.formatTime(pausaPranzoStart),
    '3. Fine pausa pranzo': Utils.formatTime(pausaPranzoEnd),
    '4. Fine giornata lavorativa': Utils.formatTime(fineLavoro),
});

const isCorrectFasciaOraria = () => {
    const currentTime = Date.now();

    if (currentTime < inizioLavoro) {
        //è mattina
        return false;
    } else if (currentTime > fineLavoro) {
        //è sera
        return false
    } else if (currentTime >= pausaPranzoStart && currentTime <= pausaPranzoEnd) {
        // è pausa pranzo
        return false;
    }

    return true;
}