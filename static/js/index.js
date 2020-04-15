var countries = [];

function updateData() {
    countries.forEach((listItem) => {
        let country = listItem;
        let ajax = new XMLHttpRequest();
        ajax.open('GET', '/realtime/country/' + country, true);
        ajax.onreadystatechange = () => {
            if(ajax.readyState == 4 && ajax.status == 200) {
                if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                    let data = JSON.parse(ajax.responseText);
                    document.getElementById('pos' + country).innerText = data.confirmed;
                    document.getElementById('dead' + country).innerText = data.dead;
                    document.getElementById('rec' + country).innerText = data.recovered;
                } else {
                    alert('No se puede conectar con el proveedor de datos');
                    console.log('Server reponse: ' + ajax.responseText);
                }
            } else if(ajax.readyState == 4) {
                alert('No se puede conectar con el servidor');
                console.log('Server status ' + ajax.status + ': ' + ajax.statusText);
            }
        }
        ajax.send(null);
    });
}

function init() {
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/list/countries', true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            if(ajax.getResponseHeader('Content-Type').includes('application/json')) {
                countries = JSON.parse(ajax.responseText);
                updateData();
                setInterval(() => { updateData() }, 1.2E6);
            } else {
                alert('No se puede obtener el listado de paises');
                console.log('Server response: ' + ajax.responseText);
            }
        } else if(ajax.readyState == 4) {
            alert('No se puede conectar con el servidor');
            console.log('Server status ' + ajax.status + ': ' + ajax.statusText);
        }
    }
    ajax.send();
}