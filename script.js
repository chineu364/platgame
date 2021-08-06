function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function changeSee(coll, see) {
    for (var i = 0, len = coll.length; i < len; i++) {
        coll[i].style["display"] = see;
    }
}

function changeColor() {
    if (player.moneycolor == 'black') {
        player.moneycolor = 'blue';
    } else if (player.moneycolor == 'blue') {
        player.moneycolor = '#abcdef';
    } else if (player.moneycolor == '#abcdef') {
        player.moneycolor = 'green'
    } else if (player.moneycolor == 'green') {
        player.moneycolor = '#123456';
    } else if (player.moneycolor == '#123456') {
        player.moneycolor = 'red';
    } else if (player.moneycolor == 'red') {
        player.moneycolor = 'white'
    } else if (player.moneycolor == 'white') {
        player.moneycolor = 'black'
    } else {
        console.log("error: color " + player.moneycolor + " is not defined")
    }
}

function backgroundchangeColor() {
    if (player.backgroundcolor == 'white') {
        player.backgroundcolor = 'black';
        player.textcolor = 'white';
    } else if (player.backgroundcolor == 'black') {
        player.backgroundcolor = 'white';
        player.textcolor = 'black';
    } else {
        console.log("error: color " + player.backgroundcolor + " is not defined")
    }
}

function changeMenu() {
    if (player.menu == 'main') {
        changeSee(document.getElementsByClassName('main'), 'block');
        changeSee(document.getElementsByClassName('option'), 'none');
        changeSee(document.getElementsByClassName('autobuyer'), 'none');
    } else if (player.menu == 'option') {
        changeSee(document.getElementsByClassName('main'), 'none');
        changeSee(document.getElementsByClassName('option'), 'block');
        changeSee(document.getElementsByClassName('autobuyer'), 'none');
    } else if (player.menu == 'autobuyer') {
        changeSee(document.getElementsByClassName('main'), 'none');
        changeSee(document.getElementsByClassName('option'), 'none');
        changeSee(document.getElementsByClassName('autobuyer'), 'block');
    } else {
        console.log("error: menu " + player.menu + " is not defined.")
    }
}

function timeunit(time) { //google
    if (time >= 31536000) {
        return Math.floor(time / 31536000) + " years, " + Math.floor((time % 31536000) / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
    } else if (time >= 86400) {
        return Math.floor(time / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
    } else if (time >= 3600) {
        return Math.floor(time / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
    } else if (time >= 60) {
        return Math.floor(time / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
    } else return Math.floor(time % 60) + " seconds"
}

function buy1() {
    if (player.acost <= player.money) {
        player.time = 0;
        player.money -= player.acost;
        player.a += 1;
        switch (player.acost) {
            case 0:
                player.acost = 10
                    //no break ;)
            default:
                player.acost *= 1.25 * (parseInt(player.a / 10) + 1);
                player.acost = Math.floor(player.acost);
        }
    }
}

function abr(abrname) {
    if (player[abrname] == "off") {
        player[abrname] = "on"
    } else if (player[abrname] == "on") {
        player[abrname] = "off"
    }
}

function reset() {
    player = {
        money: 0,
        time: 0,
        unittime: "0 second",
        realtime: 0,
        unitrealtime: "0 second",
        timeacc: 1,
        a: 0,
        acost: 0,
        moneycolor: 'black',
        backgroundcolor: 'white',
        textcolor: 'black',
        aabr: "off"
    }
}

function save() {
    localStorage.setItem(gamesave, JSON.stringify(player));
}

function load() {
    if (typeof localStorage.getItem(gamesave) === "undefined") return;
    player = JSON.parse(localStorage.getItem(gamesave));
}

// option
setInterval(function() {
    $('#money')
        .html(numberWithCommas(player.money))
        .css('color', player.moneycolor)
    $('#aadd')
        .html('add a <br> cost:' + numberWithCommas(player.acost) + '<br> count:' + player.a)
    $('#pasttime')
        .html('you spend ' + timeunit(player.time) + ' in this reset')
    $('#playtime')
        .html('you have played for ' + timeunit(player.realtime))
    $('.optiontext')
        .css('color', player.textcolor)
    $('#aabr')
        .html('a autobuyer: ' + player.aabr)
    document.bgColor = player.backgroundcolor;
    changeMenu()
}, 30);

// main
setInterval(function() {
    player.money += player.a * 0.03 * player.timeacc;
    player.time += 0.03 * player.timeacc;
    player.realtime += 0.03 * player.timeacc;
    if (player.acost <= player.money && player.aabr == "on") {
        buy1();
    }
}, 30);

document.getElementById('money').style.fontSize = '40px';
load();

var player = {
    money: 0,
    time: 0,
    unittime: "0 second",
    realtime: 0,
    unitrealtime: "0 second",
    timeacc: 1,
    a: 0,
    acost: 0,
    moneycolor: 'black',
    menu: 'main',
    backgroundcolor: 'white',
    textcolor: 'black',
    aabr: "off"
}