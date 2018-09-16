/* Format the number to make it easier to read
    ex: 1000 >= 1.000
        1000000 >= 1.000.000
*/
function formatNumber(n) {
    return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}

function newElement(element, args={}) {
    var elem = document.createElement(element);
    if (args.id) { elem.id = args.id };
    if (args.className) { elem.className = args.className };
    return elem;
}

// Removes all children from node
function clearChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}


skill_names = [ 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility', 'Thieving', 'Slayer', 'Farming', 'Runecrafting', 'Hunter', 'Construction', 'Summoning', 'Dungeoneering'];

var skill_items = new Array(25);

function SkillItem(name, lvl, xp, category=undefined) {
    this.name = name;
    this.lvl = lvl;
    this.xp = xp;
    this.category = category;
};

function xpAtLevel(lvl) {
    var xp = 0;
    for (var i = 1; i < lvl; i++) {
        xp += Math.floor(i + 300 * Math.pow(2, i / 7.0));
    }
    return Math.floor(xp / 4);
};

function levelAtXP(xp) {
    var lvl = 1;

    while(xpAtLevel(lvl + 1) <= xp && lvl < 120) {
        lvl++;
    }
    return lvl;
};

function formatNumber(n) {
    return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
};

function SkillCalc(container) {
    this.skill = undefined;
    this.container = container;
    this.player = undefined;
    this.playerName = undefined;
    this.multiplier = 1;
    this.skillId = -1;
    this.category = 'All';

    this.curLvl = 1;
    this.curXp = 0;
    this.targetLvl = 2;
    this.targetXp = 83;
    this.xpDelta = this.targetXp - this.curXp;

    var sc = this;
    this.fetchPlayer = function(name) {
        console.log('Trying to fetch player data...')
        fetch('http://darkan.org:5556/api/player/' + name, { mode:'cors'})
            .then(function(response) {
                if (response.status !== 200) {
                    console.log('Failed to fetch data; Status: ' + response.status);
                    sc.loadError(' Stats: ' + response.status);
                } else {
                    response.json().then(function(data) {
                        console.log('Data successfully retrieved!');
                        sc.player = data;
                        sc.playerName = name;
                        sc.setupPlayerStats(sc.player);
                        submit_user.removeAttribute('disabled');
                        submit_user.value = 'Get Stats';
                    });
                }
        }).catch(function(err){
            console.log('Failed to fetch data; Error: ' + err);
            sc.loadError('Error: ' + err);
        });
    };
    this.loadError = function(error) {
        window.alert('Failed to load Player Data; [' + error + ']');
    };

    this.setupPlayerStats = function(player) {
        if (player.accountType === 0) {
            sc.multiplier = 25;
        } else
        if (player.accountType === 1) {
            sc.multiplier = 10;
        } else {
            sc.multiplier = 1;
        }
        sc.curLvl = player.stats.skills[sc.skillId].level;
        sc.curXp = player.stats.skills[sc.skillId].xp;
        sc.targetLvl = player.stats.skills[sc.skillId].level + 1;
        sc.targetXp = xpAtLevel(player.stats.skills[sc.skillId].level + 1);
        xp_multiplier.value = sc.multiplier;
        sc.updateData();
    };

    this.setup = function(skillId) {
        document.getElementById('calc_title').textContent = skill_names[skillId] + ' Calculator';
        document.getElementById('calc_skills').style.display = 'none';
        document.getElementById('calc').style.display = 'block';
        sc.skillId = skillId;
        sc.skill = skill_items[skillId];
        if (sc.player) {
            sc.setupPlayerStats(sc.player);
        }
        var category_title = undefined;
        var category_data = undefined;
        switch (skillId) {
            // Magic
            case 6:
                category_title = [' Spellbook', 'Spell' ];
                break;
        }
        if (category_title) {
        }
    };

    this.display = function(cont) {
    };

    this.reset = function() {
        document.getElementById('calc_title').textContent = 'Darkan Calculator';
        document.getElementById('calc').style.display = 'none';
        document.getElementById('calc_skills').style.display = 'block';
        sc.skillId = -1;
        sc.skill = undefined;
    };

    this.updateData = function() {
        if (sc.targetLvl <= sc.curLvl && sc.targetLvl != 120) {
            sc.targetLvl = sc.curLvl;
            if (sc.curLvl < 120) {
                sc.targetLvl += 1;
            }
            sc.targetXp = xpAtLevel(sc.targetLvl);
        }
        if (sc.targetXp <= sc.curXp) {
            sc.targetXp = sc.curXp + 1;
        }
        sc.xpDelta = sc.targetXp - sc.curXp;
        xp_delta.textContent = formatNumber(sc.xpDelta);
        cur_lvl.value = sc.curLvl;
        cur_xp.value = sc.curXp;
        target_lvl.value = sc.targetLvl;
        target_xp.value = sc.targetXp;
    };
};

var skillCalc = undefined;
window.onload = function() {
    skillCalc = new SkillCalc(document.getElementById('calc'));
    document.getElementById('calc_loading').style.display = 'none';
    document.getElementById('calc_skills').style.display = 'block';

    cur_lvl.onchange = function() {
        if (this.value > 120) {
            this.value = 120;
        }
        skillCalc.curLvl = parseInt(this.value);
        skillCalc.curXp = xpAtLevel(parseInt(this.value));
        skillCalc.updateData();
    };
    cur_xp.onchange = function() {
        if (this.value > 200000000) {
            this.value = 200000000;
        }
        skillCalc.curXp = parseInt(this.value);
        skillCalc.curLvl = levelAtXP(parseInt(this.value));
        skillCalc.updateData();
    };

    target_lvl.onchange = function() {
        if (this.value > 120) {
            this.value = 120;
        }
        skillCalc.targetLvl = parseInt(this.value);
        skillCalc.targetXp = xpAtLevel(parseInt(this.value));
        skillCalc.updateData();
    };
    target_xp.onchange = function() {
        if (this.value > 200000000) {
            this.value = 200000000;
        }
        skillCalc.targetXp = parseInt(this.value);
        skillCalc.targetLvl = levelAtXP(parseInt(this.value));
        skillCalc.updateData();
    };
};

function getData() {
    var name = document.getElementById('username').value.toLowerCase().replace(/ /g, '_');
    skillCalc.fetchPlayer(name);
    submit_user.setAttribute('disabled', '');
    submit_user.value = 'Loading...';
}
