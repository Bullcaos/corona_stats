var chart = null;
var countries = [];

function filterData(jsonReponse) {
    let values = [];
    for(let i = 0; i < jsonReponse.length; i++) {
        if(i > 0) {
            const date = new Date(jsonReponse[i].date);
            const prevDate = new Date(values[values.length-1].date);
            if(date.getUTCDate() == prevDate.getUTCDate()) continue;
        }
        values.push(jsonReponse[i]);
    }
    return values;
}

function updateNumbers(infected, dead, recovered) {
    const pos = infected.length-1;
    document.getElementById('totalConfirmed').innerText = infected[pos];
    document.getElementById('totalDead').innerText = dead[pos];
    document.getElementById('totalRecovered').innerText = recovered[pos];
    if(pos > 0) {
        document.getElementById('partialConfirmed').innerText = '+' + (infected[pos] - infected[pos-1]);
        document.getElementById('partialDead').innerText = '+' + (dead[pos] - dead[pos-1]);
        document.getElementById('partialRecovered').innerText = '+' + (recovered[pos] - recovered[pos-1]);
    }
}

function loadChartData() {
    if(chart == null || countries.length == 0) return false;
    const selection = document.getElementById('selectCountry').value;
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/history/country/week/' + countries[selection], true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            console.log();
            if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                const filtResp = filterData(JSON.parse(ajax.responseText));
                let chartLabels = [];
                let infected = [];
                let dead = [];
                let recovered = [];
                for(let i = filtResp.length-1; i >= 0; i--) {
                    const date = new Date(filtResp[i].date);
                    const formatDate = date.getUTCDate() + '/' + (date.getUTCMonth()+1);
                    chartLabels.push(formatDate);
                    infected.push(filtResp[i].confirmed);
                    dead.push(filtResp[i].dead);
                    recovered.push(filtResp[i].recovered);
                }
                chart.data.labels = chartLabels;
                chart.data.datasets[0].data = infected;
                chart.data.datasets[1].data = dead;
                chart.data.datasets[2].data = recovered;
                chart.update();
                updateNumbers(infected, dead, recovered);
            } else {
                alert('El servidor no puede acceder a los datos en estos momentos');
                console.log('Server returned ' + ajax.responseText);
            }
        } else if(ajax.readyState == 4) {
            alert('No se puede acceder al servidor');
            console.log('Server returned ' + ajax.status + ': ' + ajax.statusText);
        }
    }
    ajax.send();
    console.log('sent');
}

function retrieveCountries() {
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/list/countries', true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                countries = JSON.parse(ajax.responseText);
                loadChartData();
                setInterval(() => { loadChartData() }, 1.2E6);
            } else {
                alert('No se puede acceder a la lista de países monitorizados');
                location.reload();
            }
        } else if(ajax.readyState == 4) {
            alert('No se puede acceder al servidor');
            console.log('Server returned ' + ajax.status + ': ' + ajax.statusText);
        }
    }
    ajax.send();
}

function init(){
    M.FormSelect.init(document.querySelectorAll('select'));
    chart = new Chart(document.getElementById('covidStatsChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Positivos',
                data: [],
                borderColor: 'rgba(0,0,255,1)',
                fill: false,
                lineTension: 0.4
            }, {
                label: 'Muertos',
                data: [],
                borderColor: 'rgba(255,0,0,1)',
                fill: false,
                lineTension: 0.4
            }, {
                label: 'Recuperados',
                data: [],
                borderColor: 'rgba(0,255,0,1)',
                fill: false,
                lineTension: 0.4
            }]
        }
    });
    retrieveCountries();
}