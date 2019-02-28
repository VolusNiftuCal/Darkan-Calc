/* Format the number to make it easier to read
    ex: 1000 >= 1.000
        1000000 >= 1.000.000
function formatNumber(n) {
    return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}*/

function formatNumber(n) {
    return parseFloat(n.toFixed(1)).toString().replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
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

var skill_info = new Array(25);

function SkillItem(name, lvl=1, xp=1, category=[]) {
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

function SkillCalc(container) {
    this.skill = undefined;
    this.container = container;
    this.player = undefined;
    this.playerName = undefined;
    this.multiplier = 1;
    this.modifier = 1;
    this.skillId = -1;

    this.curLvl = 1;
    this.curXp = 0;
    this.targetLvl = 2;
    this.targetXp = 83;
    this.xpDelta = this.targetXp - this.curXp;
    this.category = 'All';
    this.subcategory = 'All';

    var sc = this;
    this.fetchPlayer = function(name) {
        console.log('Trying to fetch player data...')
        fetch('https://darkan.org/api/player/' + name, { mode:'cors'})
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
            submit_user.removeAttribute('disabled');
            submit_user.value = 'Get Stats';
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
        sc.xpDelta = sc.targetXp - sc.curXp;
        xp_delta.textContent = formatNumber(sc.xpDelta);
        xp_multiplier.value = sc.multiplier;
        sc.updateData();
    };

    this.setup = function(skillId) {
        document.getElementById('calc_title').textContent = skill_names[skillId] + ' Calculator';
        document.getElementById('calc_skills').style.display = 'none';
        document.getElementById('calc').style.display = 'block';
        sc.skillId = skillId;
        sc.skill = skill_info[skillId];
        if (sc.player) {
            sc.setupPlayerStats(sc.player);
        }
        clearChildren(calc_category);
        calc_category.style.display = 'none';
        if (sc.skill.categories) {
            calc_category.style.display = 'Block';
            newCategory(sc.skill.categories, sc.updateCategory);
        }
        if (sc.skill.subcategories) {
            newCategory(sc.skill.subcategories, sc.updateSubcategory);
        }
        if (sc.skill.name) {
            skill_icon.style.backgroundImage = 'url("./assets/stats/' +sc.skill.name+ '-icon.png")';
        }
        sc.updateSkillInfo();
    };

    this.display = function(cont) {
    };

    this.reset = function() {
        document.getElementById('calc_title').textContent = 'Darkan Calculator';
        document.getElementById('calc').style.display = 'none';
        document.getElementById('calc_skills').style.display = 'block';
        sc.skillId = -1;
        sc.skill = undefined;
        sc.category = 'All';
        sc.subcategory = 'All';
        sc.modifier = 1;
        xp_modifier.value = 0;
        skill_icon.style.backgroundImage = 'url("./assets/stats/Overall-icon.png")';
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
        sc.updateSkillInfo();
    };
    this.updateCategory = function(value) {
        sc.category = value;
    };
    this.updateSubcategory = function(value) {
        sc.subcategory = value;
    };
    this.updateSkillInfo = function() {
        clearChildren(calc_info);
        newSkillData(['Number', 'Name', 'LVL', 'XP']);
        if (!sc.skill.items) {
            newSkillData(['Nothing Found']);
        }
        var list = [];
        if (sc.skill.items) {
            list = sc.skill.items;
            if (sc.category !== 'All' || sc.subcategory !== 'All') {
                list = [];
                for (var i = 0; i < sc.skill.items.length; i++) {
                    if (sc.skill.items[i].category.indexOf(sc.category) > -1 || sc.category === 'All') {
                        if (sc.subcategory === 'All' || sc.skill.items[i].category.indexOf(sc.subcategory) > -1) {
                            list.push(sc.skill.items[i])
                        }
                    }
                }
            }
            function skillDataComparator(a, b) {
                if (a.lvl < b.lvl) return -1;
                if (a.lvl > b.lvl) return 1;
                if (a.xp < b.xp) return -1;
                if (a.xp > b.xp) return 1;
                return 0;
            }
            if (list.length === 0) {
                newSkillData(['Nothing Found']);
            }
            list = list.sort(skillDataComparator);
            for (var i = 0; i < list.length; i++) {
                var experience = (list[i].xp * sc.multiplier) * sc.modifier;
                var number = formatNumber(Math.ceil(sc.xpDelta / experience));
                //var experience = formatNumber(list[i].xp * sc.multiplier);
                newSkillData([number, list[i].name, list[i].lvl, formatNumber(experience)]);
            }
        }
    }
    function newCategory(category, updateFunction) {
        var skill_category = newElement('tr', {className: 'calc_cat'});
        var skill_category_title = newElement('td', {className: 'table_darkcell'});

        skill_category_title.textContent = category.title;
        skill_category.appendChild(skill_category_title);

        var skill_category_select_cell = newElement('td');
        skill_category.appendChild(skill_category_select_cell);

        var skill_category_select = newElement('select');
        skill_category_select_cell.appendChild(skill_category_select);

        for (var i = -1; i < category.values.length; i++) {
            var cat_value = (i === -1 ? 'All' : category.values[i]);
            var skill_category_value = newElement('option');
            skill_category_value.value = cat_value;
            skill_category_value.textContent = cat_value;
            skill_category_select.appendChild(skill_category_value);
        }
        skill_category_select.onchange = function() {
            updateFunction(this.value);
            sc.updateSkillInfo();
        };
        calc_category.appendChild(skill_category);
    }
    function newSkillData(data) {
        var data_row = newElement('tr');
        for (var i = 0; i < data.length; i++) {
            var data_cell = newElement('td');
            data_cell.innerHTML = data[i];
            data_row.appendChild(data_cell);
        }
        if (data[0] === 'Nothing Found') {
            data_cell.colSpan = '4';
        }
        if (data[0] !== 'Nothing Found' || data[2] !== 'LVL') {
            if (data[2] <= sc.curLvl) {
                data_row.className = 'calc_data_available';
            } else {
                data_row.className = 'calc_data_unavailable';
            }
        }
        calc_info.appendChild(data_row);
    }
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
    xp_multiplier.onchange = function() {
        skillCalc.multiplier = parseInt(this.value);
        skillCalc.updateSkillInfo();
    };
    xp_modifier.onchange = function() {
        if (parseInt(this.value) > 999) {
            this.value = 999;
        }
        skillCalc.modifier = 1 + (parseInt(this.value) / 100);
        skillCalc.updateSkillInfo();
    };
};

function getData() {
    var name = document.getElementById('username').value.toLowerCase().replace(/ /g, '_');
    skillCalc.fetchPlayer(name);
    submit_user.setAttribute('disabled', '');
    submit_user.value = 'Loading...';
}
