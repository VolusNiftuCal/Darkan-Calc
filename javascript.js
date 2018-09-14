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
    this.multiplier = 1;

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
                        sc.setupPlayerStats(sc.player);
                    });
                }
        }).catch(function(err){
            console.log('Failed to fetch data; Error: ' + err);
            sc.loadError(' Error: ' + err);
        });
    };
    this.loadError = function(error) {

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
    };

    this.display = function(skillId) {
        document.getElementById('calc_title').textContent = skill_names[skillId] + ' Calculator';
        console.log(skill_items[skillId]);
    }
};

var skillCalc = undefined
window.onload = function() {
    skillCalc = new SkillCalc(undefined);
    calc_loading.style.display = 'none';
    calc_skills.style.display = 'block';
}