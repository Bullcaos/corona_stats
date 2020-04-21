var chartInfected = null;
var chartDead = null;
var chartRecovered = null;
var countries = [];

function difference(values) {
    if(values.length < 2) return [0];
    let diff = [];
    for(let i = 1; i < values.length; i++) diff.push(values[i] - values[i-1]);
    return diff;
}

function average(infected, dead, recovered) {
    let result = [];
    let sum = 0;
    const diffInfected = difference(infected);
    const diffDead = difference(dead);
    const diffRecovered = difference(recovered);
    for(let i = 0; i < diffInfected.length; i++) sum += diffInfected[i];
    result.push(sum/diffInfected.length);
    sum = 0;
    for(let i = 0; i < diffDead.length; i++) sum += diffDead[i];
    result.push(sum/diffDead.length);
    sum = 0;
    for(let i = 0; i < diffRecovered.length; i++) sum += diffRecovered[i];
    result.push(sum/diffRecovered.length);
    return result;
}

function deviation(infected, dead, recovered, averages) {
    let result = [];
    let sum = 0;
    const diffInfected = difference(infected);
    const diffDead = difference(dead);
    const diffRecovered = difference(recovered);
    for(let i = 0; i < diffInfected.length; i++) {
        const diffSum = diffInfected[i] - averages[0];
        sum += Math.pow(diffSum, 2);
    }
    result.push(Math.sqrt(sum/diffInfected.length));
    sum = 0;
    for(let i = 0; i < diffDead.length; i++) {
        const diffSum = diffDead[i] - averages[1];
        sum += Math.pow(diffSum, 2);
    }
    result.push(Math.sqrt(sum/diffDead.length));
    sum = 0;
    for(let i = 0; i < diffRecovered.length; i++) {
        const diffSum = diffRecovered[i] - averages[2];
        sum += Math.pow(diffSum, 2);
    }
    result.push(Math.sqrt(sum/diffRecovered.length));
    return result;
}

function leastSquares(values) {
    let pend = 0, base = 0, pend_up = 0, pend_down = 0;
    let sumx = 0, sumy = 0, sumxy = 0, sumx2 = 0;
    for(let i = 0; i < values.length; i++) {
        if(i == values.length-1) {
            const date = new Date();
            const factor = date.getUTCHours() / 24;
            sumx += (i * factor);
            sumx2 += Math.pow((i * factor), 2);
            sumxy += values[i] * (i * factor);
        } else {
            sumx += i;
            sumx2 += Math.pow(i, 2);
            sumxy += values[i] * i;
        }
        sumy += values[i];
    }
    pend_up = (values.length * sumxy) - (sumx * sumy);
    pend_down = (values.length * sumx2) - Math.pow(sumx, 2);
    pend = pend_up / pend_down;
    base = sumy - (pend * sumx);
    base = base / values.length;
    const residual = values[values.length-2] - ((pend * (values.length-2)) + base);
    return ((pend * (values.length-1)) + base) + residual;
}

function prediction (infected, dead, recovered) {
    if(infected.length < 2 || dead.length < 2 || recovered.length < 2) return [0,0,0];
    let result = [];
    const diffInfected = difference(infected);
    const diffDead = difference(dead);
    const diffRecovered = difference(recovered);
    result.push(leastSquares(diffInfected));
    result.push(leastSquares(diffDead));
    result.push(leastSquares(diffRecovered));
    return result;
}

function printHistory(history, hours) {
    let table = document.getElementById('historyTable');
    table.innerText = '';
    for(let i = 0; i < history.length; i++) {
        let row = '<tr>';
        row += '<td>' + hours[history.length - (i+1)] + '</td>';
        row += '<td>' + history[i].confirmed + '</td>';
        row += '<td>' + history[i].dead + '</td>';
        row += '<td>' + history[i].recovered + '</td>';
        row += '</tr>';
        table.innerHTML += row;
    }
}

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

function loadData() {
    if(chartInfected == null || chartDead == null || chartRecovered == null || countries.length == 0) return;
    const selection = countries[document.getElementById('countrySelect').value];
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/history/country/week/' + selection, true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                const data = filterData(JSON.parse(ajax.responseText));
                let hours = [], confirmed = [], dead = [], recovered = [];
                for(let i = data.length-1; i >= 0; i--) {
                    const dateData = new Date(data[i].date);
                    hours.push(dateData.getUTCDate().toString().padStart(2, '0') + '/' + (dateData.getUTCMonth()+1).toString().padStart(2, '0'));
                    confirmed.push(data[i].confirmed);
                    dead.push(data[i].dead);
                    recovered.push(data[i].recovered);
                }
                const averages = average(confirmed, dead, recovered);
                const deviations = deviation(confirmed, dead, recovered, averages);
                const predictions = prediction(confirmed, dead, recovered);
                chartInfected.data.labels = hours;
                chartInfected.data.datasets[0].data = confirmed;
                chartInfected.update();
                chartDead.data.labels = hours;
                chartDead.data.datasets[0].data = dead;
                chartDead.update();
                chartRecovered.data.labels = hours;
                chartRecovered.data.datasets[0].data = recovered;
                chartRecovered.update();
                document.getElementById('avePos').innerText = parseInt(averages[0]);
                document.getElementById('aveDead').innerText = parseInt(averages[1]);
                document.getElementById('aveRec').innerText = parseInt(averages[2]);
                document.getElementById('desPos').innerText = parseInt(deviations[0]);
                document.getElementById('desDead').innerText = parseInt(deviations[1]);
                document.getElementById('desRec').innerText = parseInt(deviations[2]);
                document.getElementById('lsqPos').innerText = parseInt(Math.max(predictions[0], 0) + confirmed[confirmed.length-1]);
                document.getElementById('lsqDead').innerText = parseInt(Math.max(predictions[1], 0) + dead[dead.length-1]);
                document.getElementById('lsqRec').innerText = parseInt(Math.max(predictions[2], 0) + recovered[recovered.length-1]);
                printHistory(data, hours);
            } else {
                alert('No se puede acceder a la información del servidor');
                console.log('Server returned ' + ajax.responseText);
            }
        } else if(ajax.readyState == 4) {
            alert('No se puede acceder al servidor');
            console.log('Server status ' + ajax.status + ': ' + ajax.statusText);
        }
    }
    ajax.send();
}

function fillCountries() {
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/list/countries', true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                countries = JSON.parse(ajax.responseText);
                loadData();
            } else {
                alert('No se puede acceder a la información del servidor');
                console.log('Server returned ' + ajax.responseText);
            }
        } else if(ajax.readyState == 4) {
            alert('No se puede acceder al servidor');
            console.log('Server status ' + ajax.status + ': ' + ajax.statusText);
        }
    }
    ajax.send();
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
    fillCountries();
}