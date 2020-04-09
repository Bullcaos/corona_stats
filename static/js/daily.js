var chartInfected = null;
var chartDead = null;
var chartRecovered = null;
var countries = [];

function average(infected, dead, recovered) {
    let result = [];
    let sum = 0;
    for(let i = 0; i < infected.length; i++) {
        sum += infected[i];
    }
    result.push(sum / infected.length);
    sum = 0;
    for(let i = 0; i < dead.length; i++) {
        sum += dead[i];
    }
    result.push(sum / dead.length);
    for(let i = 0; i < recovered.length; i++) {
        sum += recovered[i];
    }
    result.push(sum / recovered.length);
    return result;
}

function loadData() {
    if(chartInfected == null || chartDead == null || chartRecovered == null || countries.length == 0) return;
    const selection = countries[document.getElementById('countrySelect').value];
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/history/country/day/' + selection, true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                const data = JSON.parse(ajax.responseText);
                let hours = [], confirmed = [], dead = [], recovered = [];
                for(let i = 0; i < data.length; i++) {
                    const dateData = new Date(data[i].date);
                    hours.push(dateData.getHours() + ':' + dateData.getMinutes());
                    confirmed.push(data[i].confirmed);
                    dead.push(data[i].dead);
                    recovered.push(data[i].recovered);
                }
                const averages = average(confirmed, dead, recovered);
                //TODO desviacion tipica
                //TODO minimos cuadrados
                //TODO mostrar datos
            }
            //TODO informar del error
        } //TODO informar del error
    }
}

function fillCountries() {
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/list/countries', true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                countries = JSON.parse(ajax.responseText);
                //TODO call to data loader
            } //TODO informar del error
        }//TODO informar del error
    }
    //ajax.send();
}

function init() {
    M.FormSelect.init(document.querySelectorAll('select'));
    chartInfected = new Chart(document.getElementById('chartConfirm').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Confirmados',
                data: [],
                borderColor: 'rgba(0,0,255,1)',
                backgroundColor: 'rgba(0,0,255,0.4)',
                fill: 'origin',
                lineTension: 0.4
            }]
        },
        options: {
            title: { text: 'Confirmados' }
        }
    });
    chartDead = new Chart(document.getElementById('chartDead').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Muertos',
                data: [],
                borderColor: 'rgba(255,0,0,1)',
                backgroundColor: 'rgba(255,0,0,0.4)',
                fill: 'origin',
                lineTension: 0.4
            }]
        },
        options: {
            title: { text: 'Muertos' }
        }
    });
    chartRecovered = new Chart(document.getElementById('chartRecov').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Recuperados',
                data: [],
                borderColor: 'rgba(0,255,0,1)',
                backgroundColor: 'rgba(0,255,0,0.4)',
                fill: 'origin',
                lineTension: 0.4
            }]
        },
        options: {
            title: { text: 'Recuperados' }
        }
    });
}