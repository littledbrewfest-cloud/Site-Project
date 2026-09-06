const fs = require('fs');
const path = require('path');

// We will parse the raw CSV data into a clean structured dataset
function cleanNullBytes(str) {
  return str.replace(/\0/g, '');
}

// Function to infer gaming category from keyword text
function inferCategory(kw) {
  const lower = kw.toLowerCase();
  if (lower.includes('weapon') || lower.includes('gun') || lower.includes('loadout') || lower.includes('ammo') || lower.includes('shredder') || lower.includes('craft') || lower.includes('blueprint')) {
    return 'Weapons & Loadouts';
  }
  if (lower.includes('ps5') || lower.includes('ps4') || lower.includes('xbox') || lower.includes('console') || lower.includes('switch') || lower.includes('crossplay') || lower.includes('cross play') || lower.includes('game pass') || lower.includes('gamepass') || lower.includes('pc') || lower.includes('steam deck') || lower.includes('mac') || lower.includes('linux')) {
    return 'PS5 & Console Gaming';
  }
  if (lower.includes('where to find') || lower.includes('where is') || lower.includes('how to') || lower.includes('quest') || lower.includes('speranza') || lower.includes('bunker') || lower.includes('key') || lower.includes('vault') || lower.includes('where are') || lower.includes('location')) {
    return 'Guides & Walkthroughs';
  }
  if (lower.includes('unreal engine') || lower.includes('fps') || lower.includes('lag') || lower.includes('crash') || lower.includes('specs') || lower.includes('requirements') || lower.includes('settings') || lower.includes('gb') || lower.includes('gigabytes')) {
    return 'PC Specs & Performance';
  }
  if (lower.includes('extraction') || lower.includes('solo') || lower.includes('pvp') || lower.includes('pve') || lower.includes('tarkov') || lower.includes('the finals') || lower.includes('helldivers')) {
    return 'Extraction Shooters';
  }
  return 'ARC Raiders News';
}

module.exports = { cleanNullBytes, inferCategory };
