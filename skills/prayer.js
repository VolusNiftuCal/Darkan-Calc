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
    ['Ourg bones', 1, 140],
    ['Frost dragon bones', 1, 180]
];

skill_items[5] = [];

for (var i = 0; i < prayer_bones.length; i++) {
    skill_items[5].push(new SkillItem(prayer_bones[i][0], prayer_bones[i][1], prayer_bones[i][2], 'Burying'));
    skill_items[5].push(new SkillItem(prayer_bones[i][0] + ' (ecto)', prayer_bones[i][1], prayer_bones[i][2] * 4, 'Ectofuntus'));
    skill_items[5].push(new SkillItem(prayer_bones[i][0] + ' (altar)', prayer_bones[i][1], prayer_bones[i][2] * 3.5, 'Altar'));
}