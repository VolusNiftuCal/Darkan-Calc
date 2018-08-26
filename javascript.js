skill_names = [ 'Attack', 'Defence', 'Strength', 'Hitpoints', 'Ranged', 'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility', 'Thieving', 'Slayer', 'Farming', 'Runecrafting', 'Hunter', 'Construction', 'Summoning', 'Dungeoneering'];

var skill_items = new Array(25);


// Prayer
prayer_bones = [
    ['Impious ashes', 1, 4],
    ['Wolf/Burnt/Regular bones', 1, 4.5],
    ['Accursed ashes', 1, 12.5],
    ['Big/Curved/Jogre/Long bones', 1, 15],
    ['Babydragon bones', 1, 30],
    ['Wyvern bones', 1, 50],
    ['Infernal ashes', 1, 62.5],
    ['Dragon bones', 1, 72],
    ['Dagannoth bones', 1, 125],
    ['Frost dragon bones', 1, 180]
];

skill_items[5] = [];

for (var i = 0; i < prayer_bones.length; i++) {
    skill_items[5].push(new SkillItem(prayer_bones[i][0], prayer_bones[i][1], prayer_bones[i][2], 'Burying'));
    skill_items[5].push(new SkillItem(prayer_bones[i][0] + ' (ecto)', prayer_bones[i][1], prayer_bones[i][2] * 4, 'Ectofuntus'));
    skill_items[5].push(new SkillItem(prayer_bones[i][0] + ' (altar)', prayer_bones[i][1], prayer_bones[i][2] * 3.5, 'Altar'));
}

// Magic
skill_items[6] = [
];

// Cooking
skill_items[7] = [
];

// Woodcutting
skill_items[8] = [
];

// Fletching
skill_items[9] = [
];

// Fishing
skill_items[10] = [
];

// Firemaking
skill_items[11] = [
];

// Crafting
skill_items[12] = [
];

// Smithing
skill_items[13] = [
];

// Mining
skill_items[14] = [
    new SkillItem('Rune Essence', 1, 5),
    new SkillItem('Clay', 1, 5),
    new SkillItem('Copper', 1, 17.5),
    new SkillItem('Tin', 1, 17.5),
    new SkillItem('Limestone', 10, 26.5),
    new SkillItem('Iron', 15, 35),
    new SkillItem('Silver', 20, 40),
    new SkillItem('Coal', 30, 50),
    new SkillItem('Pure Essence', 30, 5),
    new SkillItem('Sandstone (1kg)', 35, 30),
    new SkillItem('Sandstone (2kg)', 35, 40),
    new SkillItem('Sandstone (5kg)', 35, 50),
    new SkillItem('Sandstone (10kg)', 35, 60),
    new SkillItem('Gem Rock', 40, 65),
    new SkillItem('Gold', 40, 65),
    new SkillItem('Granite (500g)', 45, 50),
    new SkillItem('Granite (2kg)', 45, 60),
    new SkillItem('Granite (5kg)', 45, 75),
    new SkillItem('Mithril', 55, 80),
    new SkillItem('Lava Flow Crust', 68, 100),
    new SkillItem('Adamantite', 70, 95),
    new SkillItem('Living Rock Remains', 73, 25),
    new SkillItem('Bane', 77, 90),
    new SkillItem('Concentrated Coal Deposit', 77, 50),
    new SkillItem('Concentrated Gold Deposit', 80, 65),
    new SkillItem('Runite', 85, 125),
];

// Herbore
skill_items[15] = [
];

// Agility
skill_items[16] = [
];

// Thieving
skill_items[17] = [
];

// Farming
skill_items[19] = [
];

// Runecrafting
skill_items[20] = [
];

// Hunter
skill_items[21] = [
];

// Construction
skill_items[22] = [
];

// Summoning
skill_items[23] = [
];

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