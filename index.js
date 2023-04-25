var data;
var localData = {
    "district": "Charlottenburg-Wilmersdorf",
    "city": "Berlin",
    "latitude": 52.5167,
    "longitude": 13.3833,
}
initialize();
async function initialize() {
    selectRandomMemoji();
    data = await fetchData();
    await patchContent();
    getLatestPositionSnapshot();
    main();
}
setInterval(function () { main() }, 5000);


async function main() {
    data = await fetchData();
    await patchContent();
}

async function fetchData() {
    console.log("getting data");
    return new Promise((obj) => {
        fetch('./custom-hds/healthData.json')
            .then(res => res.json())
            .then(data => {
                return obj(data)
            })
    })
}

async function patchContent() {
    console.log("patching content");
    document.getElementById("heartRate").innerHTML = data.heartRate + " BPM";
    updateOxygenSaturationBar(data.oxygenSaturation);
    document.getElementById("speed").innerHTML = data.speed + " m/s";
}

function updateOxygenSaturationBar(value) {

    value = value * 100;
    value = Math.round(value);
    //animate the transition to the new value
    var elem = document.getElementById("oxygenSaturation-bar");
    var width = document.getElementById("oxygenSaturation-bar").style.width;
    var width = width.substring(0, width.length - 1);
    var id = setInterval(frame, 10);
    function frame() {
        if (width > value) {
            width--;
            elem.style.width = (width) + '%';
            document.getElementById("oxygenSaturation-bar").innerHTML = elem.style.width;
        }
        else if (width < value) {
            width++;
            elem.style.width = (width) + '%';
            document.getElementById("oxygenSaturation-bar").innerHTML = elem.style.width;
        }
        else {
            clearInterval(id);
        }

    }
}

function getLatestPositionSnapshot() {
    //set src of mapbox id to mapbox api server location using the longitude and latitude in the localData object
    document.getElementById("mapbox").src = `https://api.mapbox.com/styles/v1/alexinabox/clgw8e3rx003j01qth2z003ms/draft/static/${data.location.longitude},${data.location.latitude},11.3,0,35/500x500?access_token=pk.eyJ1IjoiYWxleGluYWJveCIsImEiOiJjbGd3ODh2YmswOTd1M2hwZ2RyY3E1Nnh6In0.YT0f1GOC9fGnLpS67CAOIw`;
    document.getElementById("locationText").innerHTML = `📍 ${data.location.district}, ${data.location.country}`;
}

function selectRandomMemoji() {
    var randomMemoji = Math.floor(Math.random() * 3) + 1; //random number between 1 and 3
    document.getElementById("memoji").src = `./assets/memoji_${randomMemoji}.png`;
}