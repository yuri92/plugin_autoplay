/**
 * Le fasce orarie cambiano di pochi minuti ad ogni reload della pagina.
 * Da implementare una gestione più pulita tramite sessionStorage
 */

const currentDate = new Date();
const inizioLavoro = Utils.getDateInMillis(9, Utils.getRandomInt(2, 10))
const fineLavoro = Utils.getDateInMillis(17, Utils.getRandomInt(52, 58));

const pausaPranzoStart = Utils.getDateInMillis(12, Utils.getRandomInt(52, 58));
const pausaPranzoEnd = Utils.getDateInMillis(14, Utils.getRandomInt(2, 10));
$(document).ready(() => {

    $('body').prepend(`
        <style>
            #fasce-orarie table, #fasce-orarie th, #fasce-orarie td {
              border:1px solid black;
            }
            #fasce-orarie { 
                font-family: Arial,serif;
                border: 2px solid black;
                position: fixed;
                z-index: 999999;        
                margin: 10px; 
                right: 1em;
                top: 30%;
                background-color : lightgray;
                padding:10px; 
            }
            #fasce-orarie .fasce-orarie-close {
                text-align: end;
                cursor: pointer;
            }
        </style>
        
        <div id="fasce-orarie">
        <strong>Fasce orarie protette <span class="fasce-orarie-close">[X]</span></strong>
        
        <table>
          <tr>
              <th>Ora corrente</th>
              <td id="fasce-orarie-current-time"></td>
          </tr>
          <tr>
            <th>Timer video visti</th>
            <td>${Utils.convertSeconds(Number(localStorage.getItem("seenTimer")))}</td>
          </tr>
          <tr>
            <th>Inizio giornata</th>
            <td>${Utils.formatTime(inizioLavoro)}</td>
          </tr>
          <tr>
            <th>Inizio pausa pranzo</th>
            <td>${Utils.formatTime(pausaPranzoStart)}</td>
          </tr>
          <tr>
            <th>Fine pausa pranzo</th>
            <td>${Utils.formatTime(pausaPranzoEnd)}</td></tr>
          <tr>
            <th>Fine giornata</th>
            <td>${Utils.formatTime(fineLavoro)}</td>
          </tr>
        </table>
        </div>`)

    const currentTimeInterval = setInterval(() => {
        $('#fasce-orarie-current-time').text(Utils.formatTime(Date.now()))
    }, 500)

    $('#fasce-orarie .fasce-orarie-close').on('click', event => {
        event.preventDefault();
        $('#fasce-orarie').hide();
        clearInterval(currentTimeInterval);
    })
})

const isCorrectFasciaOraria = () => {
    const currentTime = Date.now();

    if(currentDate.getDay() === 0 || currentDate.getDay() === 6){
        // è sabato o domenica
        return false;
    } else if (currentTime < inizioLavoro) {
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