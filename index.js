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
    getLatestNetflixInformation();
    getLatestValorantInformation()
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
        fetch('./custom-hds/presence.json')
            .then(res => res.json())
            .then(data => {
                return obj(data)
            })
    })
}

async function patchContent() {
    console.log("patching content");
    document.getElementById("heartRate").innerHTML = data.health.heartRate + " BPM";
    updateOxygenSaturationBar(data.health.oxygenSaturation);
    document.getElementById("speed").innerHTML = data.health.speed + " m/s";
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

function updateAllMeters() {
    // Get all the Meters
    const meters = document.querySelectorAll('svg[data-value] .meter');

    meters.forEach((path) => {
        // Get the length of the path
        let length = path.getTotalLength();

        // console.log(length);

        // Just need to set this once manually on the .meter element and then can be commented out
        // path.style.strokeDashoffset = length;
        // path.style.strokeDasharray = length;

        // Get the value of the meter
        let value = parseInt(path.parentNode.getAttribute('data-value'));
        // Calculate the percentage of the total length
        let to = length * ((100 - value) / 100);
        // Trigger Layout in Safari hack https://jakearchibald.com/2013/animated-line-drawing-svg/
        path.getBoundingClientRect();
        // Set the Offset
        path.style.strokeDashoffset = Math.max(0, to); path.nextElementSibling.textContent = `${value}%`;
    });
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

function getLatestNetflixInformation() {
    document.getElementById("netflixShowName").innerHTML = `🎬 ${data.netflix.lastWatched.title}`;
    document.getElementById("netflixShowName").href = `https://www.netflix.com/title/${data.netflix.lastWatched.showId}`;
    document.getElementById("netflixCover").src = data.netflix.lastWatched.defaultImage;
    document.getElementById("netflixCoverLink").href = `https://www.netflix.com/title/${data.netflix.lastWatched.showId}`;
}

async function getLatestValorantInformation() {
    document.getElementById("valorant.username").innerHTML = `${data.valorant.username}`;
    var rr = (data.valorant.rr);
    console.log(rr);
    document.getElementById("valorant.progress").setAttribute("data-value", rr);
    updateAllMeters();
    document.getElementById("valorant.rank").innerHTML = `${data.valorant.rank} - ${data.valorant.rr} RR`;
    document.getElementById("valorant.rankIcon").setAttribute("xlink:href", await fetchRankIcon(data.valorant.rank));
    document.getElementById("valorant.mmrMeter").style.stroke = getColorForRank(data.valorant.rank);
}

async function fetchRankIcon(rank) {
    //Send a request to the valorant api to get all the ranks with their icons
    //then return the icon for the rank that is passed in as a parameter
    //API url to get all the ranks: https://valorant-api.com/v1/competitivetiers
    var rankList;
    return new Promise((obj) => {
        fetch('https://valorant-api.com/v1/competitivetiers')
            .then(res => res.json())
            .then(data => {
                rankList = data;
                for (var i = 0; i < rankList.data[rankList.data.length - 1].tiers.length; i++) {
                    if (rankList.data[rankList.data.length - 1].tiers[i].tierName.toLowerCase() === rank.toLowerCase()) {
                        return obj(rankList.data[rankList.data.length - 1].tiers[i].largeIcon);
                    }
                }
            })
    })
}

function getColorForRank(rank) {
    //Special case for radiant
    if (rank.toLowerCase() === "radiant") {
        return "#ECE0B5";
    }
    var rank = rank.toLowerCase().substring(0, rank.length - 2); //Gold 1 -> gold
    switch (rank) {
        case "iron":
            return "#3D3D3D";
        case "bronze":
            return "#A4845C";
        case "silver":
            return "#FEFEFE";
        case "gold":
            return "#DB8E21";
        case "platinum":
            return "#3597A7";
        case "diamond":
            return "#A770F1";
        case "ascendant":
            return "#23A361";
        case "immortal":
            return "#8A1940";
        default:
            return "#000000";
    }
}

//on scroll, call the function to change the background position
//but using $ to select the window object requires jquery that we dont have therefore we need to use vanilla js
/*
window.addEventListener('scroll', function (e) {
    // only do this if in portrait mode
    if (window.innerWidth > window.innerHeight) { //landscape
        return;
    }
    scrolledY();
});
function scrolledY() {
    var scrolledY = window.pageYOffset;
    document.body.style.backgroundPosition = '0 ' + scrolledY + 'px';
}
*/