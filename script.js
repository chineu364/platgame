var player = {
    money: 0,
    time: 0,
    unittime: "0 second",
    realtime: 0,
    unitrealtime: "0 second",
    timeacc: 1,
    a: 0,
    b: 0,
    acost: 0,
    bcost: 8000,
    moneycolor: "black",
    menu: "main",
    backgroundcolor: "white",
    textcolor: "black",
    aabr: "off",
    babr: "off"
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function changeSee(coll, see) {
    for (var i = 0, len = coll.length; i < len; i++) {
        coll[parseInt(i, 10)].style["display"] = see;
    }
}

function changeColor() {
    if (player.moneycolor === "black") {
        player.moneycolor = "blue";
    } else if (player.moneycolor === "blue") {
        player.moneycolor = "#abcdef";
    } else if (player.moneycolor === "#abcdef") {
        player.moneycolor = "green";
    } else if (player.moneycolor === "green") {
        player.moneycolor = "#123456";
    } else if (player.moneycolor === "#123456") {
        player.moneycolor = "red";
    } else if (player.moneycolor === "red") {
        player.moneycolor = "white";
    } else if (player.moneycolor === "white") {
        player.moneycolor = "black";
    }
}

function backgroundchangeColor() {
    if (player.backgroundcolor === "white") {
        player.backgroundcolor = "black";
        player.textcolor = "white";
    } else if (player.backgroundcolor === "black") {
        player.backgroundcolor = "white";
        player.textcolor = "black";
    }
}

function changeMenu() {
    if (player.menu === "main") {
        changeSee(document.getElementsByClassName("main"), "block");
        changeSee(document.getElementsByClassName("option"), "none");
        changeSee(document.getElementsByClassName("autobuyer"), "none");
    } else if (player.menu === "option") {
        changeSee(document.getElementsByClassName("main"), "none");
        changeSee(document.getElementsByClassName("option"), "block");
        changeSee(document.getElementsByClassName("autobuyer"), "none");
    } else if (player.menu === "autobuyer") {
        changeSee(document.getElementsByClassName("main"), "none");
        changeSee(document.getElementsByClassName("option"), "none");
        changeSee(document.getElementsByClassName("autobuyer"), "block");
    }
}

function timeunit(time) {
    let seconds = 1;
    let minutes = 60 * seconds;
    let hours = 60 * minutes;
    let days = 24 * hours;
    let years = 365 * days;
    if (time >= years) {
        return Math.floor(time / years) + " years, " + Math.floor((time % years) / days) + " days, " + Math.floor((time % days) / hours) + " hours, " + Math.floor((time % hours) / minutes) + " minutes, and " + Math.floor(time % minutes) + " seconds";
    } else if (time >= days) {
        return Math.floor(time / days) + " days, " + Math.floor((time % days) / hours) + " hours, " + Math.floor((time % hours) / minutes) + " minutes, and " + Math.floor(time % minutes) + " seconds";
    } else if (time >= hours) {
        return Math.floor(time / hours) + " hours, " + Math.floor((time % hours) / minutes) + " minutes, and " + Math.floor(time % minutes) + " seconds";
    } else if (time >= minutes) {
        return Math.floor(time / minutes) + " minutes, and " + Math.floor(time % minutes) + " seconds";
    } else { return Math.floor(time % minutes) + " seconds"; }
}

function buya() {
    if (player.acost <= player.money) {
        player.time = 0;
        player.money -= player.acost;
        player.a += 1;
        switch (player.acost) {
            case 0:
                player.acost = 25;
                break;
            default:
                player.acost *= 1.25 * (player.a / 10 + 1);
                player.acost = Math.floor(player.acost);
        }
    }
}

function buyb() {
    if (player.bcost <= player.money) {
        player.time = 0;
        player.money -= player.bcost;
        player.b += 1;
        player.bcost *= 1.5001 * (player.b / 10 + 1);
        player.bcost = Math.floor(player.bcost);
    }
}

function abr(abrname) {
    if (player[String(abrname)] === "off") {
        player[String(abrname)] = "on";
    } else if (player[String(abrname)] === "on") {
        player[String(abrname)] = "off";
    }
}

function save() {
    localStorage.setItem("gamesave", JSON.stringify(player));
}

function load() {
    if (typeof localStorage.getItem("gamesave") === "undefined") return;
    player = JSON.parse(localStorage.getItem("gamesave"));
}

function reset() {
    if (window.confirm("Do you really want to erase all your progress?")) {
        player = {
            money: 0,
            time: 0,
            unittime: "0 second",
            realtime: 0,
            unitrealtime: "0 second",
            timeacc: 1,
            a: 0,
            b: 0,
            acost: 0,
            bcost: 8000,
            moneycolor: "black",
            menu: "option",
            backgroundcolor: "white",
            textcolor: "black",
            aabr: "off",
            babr: "off"
        }
        save();
    }
}

// option
setInterval(function() {
    $("#money")
        .html(numberWithCommas(player.money))
        .css("color", player.moneycolor);
    $("#aadd")
        .html("add a <br> cost:" + numberWithCommas(player.acost) + "<br> count:" + numberWithCommas(player.a));
    $("#badd")
        .html("add b <br> cost:" + numberWithCommas(player.bcost) + "<br> count:" + numberWithCommas(player.b));
    $("#pasttime")
        .html("you spend " + timeunit(player.time) + " in this reset");
    $("#playtime")
        .html("you have played for " + timeunit(player.realtime));
    $(".optiontext")
        .css("color", player.textcolor);
    $("#aabr")
        .html("a autobuyer: " + player.aabr);
    $("#babr")
        .html("b autobuyer: " + player.babr);
    document.bgColor = player.backgroundcolor;
    changeMenu();
}, 30);

// main
setInterval(function() {
    player.money += player.a * 0.03 * player.timeacc;
    player.a += player.b * 1.25;
    player.time += 0.03 * player.timeacc;
    player.realtime += 0.03 * player.timeacc;
    if (player.acost <= player.money && player.aabr === "on") {
        buya();
    } else if (player.bcost <= player.money && player.babr === "on") {
        buyb();
    }
}, 30);

//autosave
setInterval(function() {
    save();
}, 30000);

document.getElementById("money").style.fontSize = "40px";
load();