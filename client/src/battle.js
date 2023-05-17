var Moves; // moves json fetched on setup

$(function () {
    // $('#battle-UI').show();
    $("#overlay").hide();
    $("#overlay-fight").hide();
    $("#overlay-message").show();
    // $('#battle-UI').hide();
    // $('#battle-UI').show(() => {
    //     $('#battle-UI').hide();
    // });
});

function showFightButtons() {
    $("#overlay-fight").show();
    $('#overlay').hide();
}

function useMove(num) {
    socket.emit("moveInput", num);
    $("#overlay-fight").hide();
    $("#overlay-message").show();
}

function switchTo(slot) {
    socket.emit("switchInput", slot);
}

function runFromBattle() {
    socket.emit("endBattle");
    $("#overlay").hide();
    $("#overlay-fight").hide();
}

var battleOptions;
var battleOver = false;
var battleData = [];
var textSpeed = 60; // 60
var textInterval;
var dialoguePlaying = false;
function nextAction() {
    if (!dialoguePlaying) {
        $("#overlay").hide();
        $("#overlay-fight").hide();
        $("#overlay-message").show();
        dialoguePlaying = true;
    }
    clearInterval(textInterval);
    var nextData = battleData.shift();
    var letters = processFormatting(nextData.message, nextData.message.split(""));
    if ("damageHPTo" in nextData) {
        $("#hp-" + nextData.side).width(nextData.damageHPTo / 100 * 96);
        setTimeout(() => {
            textInterval = createTextInterval(nextData, letters)
        }, 666);
    }
    else textInterval = createTextInterval(nextData, letters);
}
function createTextInterval(nextData, letters) {
    $('#dialogue').html("");
    var index = 0;
    return setInterval(function () {
        $('#dialogue').html($('#dialogue').html() + letters[index++]);
        if (index >= letters.length) {
            clearInterval(textInterval);
            setTimeout(() => {
                if (battleData.length > 0) {
                    nextAction();
                } else {
                    if (nextData.battleOver) {
                        $('#battle-UI').hide();
                        players[username].busy = false;
                        battleOver = false;
                        app.view.style.filter = "none";
                    } else {
                        $("#overlay").show();
                        // $("#overlay-fight").show();
                    }
                    $('#dialogue').html("");
                    dialoguePlaying = false;
                }
            }, 800);
        }
    }, 1000 / textSpeed);
}

function processFormatting(message, letters) {
    if (message.includes("**")) {
        let b1 = message.indexOf("**");
        message = message.replace("**", "BB");
        let b2 = message.indexOf("**");
        message = message.replace("**", "BB");
        letters[b1] = "<b>";
        letters[b2] = "</b>";
        letters.splice(b2 + 1, 1);
        letters.splice(b1 + 1, 1);
    }
    console.log(letters);
    return letters;
}

function showPokemonYou(species) {
    species = species.toLowerCase();

    let name = species[0].toUpperCase() + species.slice(1);
    // TEMP: change to nickname of pokemon when possible
    $('#pokemon-name-you').text(name);
    $("#hp-you").width(96);
    $('#command-message').html("What will<br>" + name + " do?");

    var imageUrl = `https://play.pokemonshowdown.com/sprites/gen5ani-back/${species}.gif`;

    // Set the image source URL
    $("#pokemon-you").attr("src", imageUrl);
}

function showPokemonFoe(species) {
    species = species.toLowerCase();

    // TEMP: change to nickname of pokemon when possible
    $('#pokemon-name-foe').text(species[0].toUpperCase() + species.slice(1));
    $("#hp-foe").width(96);

    var imageUrl = `https://play.pokemonshowdown.com/sprites/gen5ani/${species}.gif`;
    $("#pokemon-foe").attr("src", imageUrl);
}

function cancelFight() {
    $("#overlay-fight").hide();
    $('#overlay').show();
}

function updateMoveChoices() {
    for (let moveNum = 1; moveNum <= 4; moveNum++) {
        if (battleOptions.active[0].moves.length >= moveNum) {
            let moveData = battleOptions.active[0].moves[moveNum - 1];
            let moveType = Moves[moveData.id.toUpperCase()].type.toLowerCase();
            $("#move" + moveNum).show();
            $("#move" + moveNum).removeClass();
            $("#move" + moveNum).addClass(moveType);
            $("#move" + moveNum).html(`<span class="movename">${moveData.move}</span><span class="movetype type ${moveType}"></span><span class="movepp">PP ${moveData.pp}/${moveData.maxpp}</span>`);
            // console.log($(".move1").addClass("water"));
        } else {
            $("#move" + moveNum).hide();
        }
    }
}