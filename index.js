var data;
main();
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
    document.getElementById("heartRate").innerHTML = data.heartRate;
    updateOxygenSaturationBar(data.oxygenSaturation);
    document.getElementById("speed").innerHTML = data.speed;
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