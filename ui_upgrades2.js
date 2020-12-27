/*
Ethereal Farm
Copyright (C) 2020  Lode Vandevenne

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


//upgradeDiv.style.overflow = 'scroll';



// make a button for planting a crop with picture, price and info. w should be larger than h for good effect.
function renderUpgrade2Chip(u, x, y, w, flex, completed) {
  var div = flex.div;
  div.style.border = '1px solid yellow';
  div.style.backgroundColor = '#9df';

  var cost = u.getCost(completed ? -1 : 0);
  var titleFlex = new Flex(flex, [0, 0.8], 0.05, 1, 0.3, 1);
  var name = completed ? u.getName() : u.getNextName();
  titleFlex.div.innerHTML = name;
  titleFlex.div.style.whiteSpace = 'nowrap';

  var canvasFlex = new Flex(flex, 0.01, [0.5, -0.35], [0, 0.7], [0.5, 0.35]);
  if(u.bgcolor) {
    canvasFlex.div.style.backgroundColor = u.bgcolor;
  }
  if(u.bordercolor) {
    canvasFlex.div.style.border = '1px solid ' + u.bordercolor;
  }
  if(u.image0) {
    var canvas = createCanvas('0%', '0%', '100%', '100%', canvasFlex.div);
    renderImage(u.image0, canvas);
  }
  if(u.image1) {
    var canvas = createCanvas('0%', '0%', '100%', '100%', canvasFlex.div);
    renderImage(u.image1, canvas);
  }

  var buyFlex = new Flex(flex, [0, 0.8], 0.4, 0.9, [0.5, 0.35], 0.8);

  var infoText = util.upperCaseFirstWord(name);
  infoText += '<br><br>Cost: ' + cost.toString();
  if(u.description) {
    infoText += '<br><br>' + u.description;
  }
  infoText += '<br><br>' + 'Non-refundable and permanent. Lasts through transcensions.';

  if(!completed) {
    var buyText = 'Cost: ' + cost.toString();

    buyFlex.div.innerText = buyText;
    buyFlex.setCentered();

    buyFlex.div.style.border = '1px solid black';
    buyFlex.div.style.backgroundColor = '#ccc';
    styleButton0(buyFlex.div);

    buyFlex.div.onclick = bind(function(i, e) {
      actions.push({type:ACTION_UPGRADE2, u:u.index});
      update();
    }, i);
  } else {
    buyFlex.div.innerText = 'Cost: ' + cost.toString();
    //buyFlex.setCentered();
  }


  registerTooltip(flex.div, infoText);

  styleButton0(canvasFlex.div);

  canvasFlex.div.onclick = function() {
    var dialog = createDialog(DIALOG_SMALL);
    var flex = new Flex(dialog, [0, 0.01], [0, 0.01], 0.99, 0.9, 0.3);
    flex.div.innerHTML = infoText;
  };


  return flex;
}

function updateUpgrade2UI() {
  upgrade2Flex.clear();

  var scrollFlex = new Flex(upgrade2Flex, 0, 0.01, 1, 1);

  var titleFlex = new Flex(scrollFlex, 0.01, 0, 0.99, 0.2, 0.25);


  var unlocked = [];
  for(var i = 0; i < registered_upgrades2.length; i++) {
    var j = registered_upgrades2[i];
    if(upgrades2[j].canUpgrade()) unlocked.push(j);
  }

  var text = '';
  text += 'Ethereal upgrades are permanent and the resin is not refundable. You can also spend resin on plants in the ethereal field instead.';
  text += '<br><br>'
  if(unlocked.length == 0) {
    text += '<i>No further ethereal upgrades are available for now.</i>';
  } else {
    text += 'Click the icon of an upgrade or see its tooltip for a more detailed description.';
  }

  titleFlex.div.innerHTML = text;

  scrollFlex.div.style.overflowY = 'scroll';
  scrollFlex.div.style.border = '5px solid #ccc';
  var pos = [0, 0];

  for(var i = 0; i < unlocked.length; i++) {
    var u = upgrades2[unlocked[i]];

    var x = (i & 1);
    var y = (i >> 1);
    var w = 0.45;
    var chip = new Flex(scrollFlex, x * w + 0.01, [0.25, y * w + 0.01, 0.25], [(x + 1) * w - 0.01], [0.25, (y + 1) * w - 0.01, 0.25], 0.75);
    renderUpgrade2Chip(u, i & 1, i >> 1, 0.45, chip, false);
  }

  var researched = [];
  for(var i = 0; i < registered_upgrades2.length; i++) {
    var j = registered_upgrades2[i];
    //if(upgrades2[j].isExhausted()) researched.push(j);
    if(state.upgrades2[j].count) researched.push(j);
  }

  if(researched.length > 0) {
    var x = 0;
    var y = ((unlocked.length + 1) >> 1) + 0.33;
    var w = 0.45;

    var flex = new Flex(scrollFlex, 0 * w + 0.01, [0.25, y * w + 0.01, 0.27], [(0 + 1) * w - 0.01], [0.25, (y + 1) * w - 0.01, 0.27], 0.6);
    styleButton(flex.div);
    flex.div.innerText = 'See Completed Upgrades';
    flex.setCentered();

    flex.div.onclick = function() {
      var dialog = createDialog();
      var flex = new Flex(dialog, [0, 0.01], [0, 0.01], 0.99, 0.9, 0.3);

      var scrollFlex = new Flex(dialog, 0, 0.1, 1, 0.85);

      scrollFlex.div.innerText = '';
      scrollFlex.div.style.overflowY = 'scroll';

      for(var i = 0; i < researched.length; i++) {
        var u = upgrades2[researched[i]];
        var div = makeDiv(pos[0], pos[1], 200, 20, scrollFlex.div);

        var x = (i & 1);
        var y = i >> 1;
        var w = 0.45;
        var chip = new Flex(scrollFlex, x * w + 0.01, [0, y * w + 0.01, 0.27], [(x + 1) * w - 0.01], [0, (y + 1) * w - 0.01, 0.27], 0.75);
        renderUpgrade2Chip(u, i & 1, i >> 1, 0.45, chip, true);
        chip.div.style.color = '#2a2';
        chip.div.style.borderColor = '#2a2';
      }

    };
  }
}

var upgrade2_ui_cache = [];

function updateUpgrade2UIIfNeeded() {
  var unlocked = [];
  for(var i = 0; i < registered_upgrades2.length; i++) {
    var j = registered_upgrades2[i];
    if(upgrades2[j].canUpgrade()) unlocked.push(j);
  }

  var cache = [];
  for(var i = 0; i < unlocked.length; i++) {
    var u = upgrades2[unlocked[i]];
    var cost = u.getCost(0);
    if(state.res.lt(cost)) cache[i] = true;
    else cache[i] = false;
  }

  var eq = false;
  if(upgrade2_ui_cache.length == cache.length) {
    eq = true;
    for(var i = 0; i < cache.length; i++) {
      if(cache[i] != upgrade2_ui_cache[i]) {
        eq = false;
        break;
      }
    }
  }

  if(!eq) {
    updateUpgrade2UI();
    upgrade2_ui_cache = cache;
  }
}
