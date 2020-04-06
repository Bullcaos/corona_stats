var countries = [];

function updateData() {
    countries.forEach((listItem) => {
        let country = listItem;
        let ajax = new XMLHttpRequest();
        ajax.open('GET', '/realtime/country/' + country, true);
        ajax.onreadystatechange = () => {
            if(ajax.readyState == 4 && ajax.status == 200) {
                let data = JSON.parse(ajax.responseText);
                document.getElementById('pos' + country).innerText = data.confirmed;
                document.getElementById('dead' + country).innerText = data.dead;
                document.getElementById('rec' + country).innerText = data.recovered;
            }
        }
        ajax.send(null);
    });
    for(let i = 0; i < countries.length; i++) {
        
    }
}

function init() {
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/list/countries', true);
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            countries = JSON.parse(ajax.responseText);
            updateData();
            setInterval(() => { updateData() }, 1.2E6);
        }
    }
    ajax.send();
}