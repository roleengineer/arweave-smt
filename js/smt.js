const SmtLib = require("./SmtLib.js");
const JSBI = require('jsbi');


var leaves = {};
var tree = new SmtLib(160, leaves);

async function update_tree() {
  var tx_array = await tx_list();
  let temp_leaves = {};
  let temp_tree = new SmtLib(160, temp_leaves);
  let curr_add, curr_val;
  for (let i = 0; i < tx_array.length; i++) {
    for (key in tx_array[i].leaf) {
      curr_add = key;
    }

    curr_val = tx_array[i].leaf[curr_add];

    changeLeaves(curr_add, curr_val);
    temp_leaves[curr_add] = curr_val;
  }

  newTree(leaves);

  temp_tree = new SmtLib(160, temp_leaves);
  let num = 0;
  for (key in temp_leaves) {
    num++;
  }
  //Show actual values to user
  document.getElementById('tree_root').innerHTML = temp_tree.root;
  document.getElementById('num_users').innerHTML = num;

}
update_tree();


var curr_address, curr_value;


var check_value = function() {
  var max = JSBI.BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
  var val = $("#user_value").val();
  val = JSBI.BigInt(val);
  var hex = '0x' + val.toString(16);
  if (hex.length < 66) {
    var difference = 66 - hex.length;
    hex = '0x' + '0'.repeat(difference) + val.toString(16);
  }
  if (JSBI.lessThanOrEqual(val, max)) {
    curr_value = hex;
    return true;

  } else {
    alert("You entered number greater than 32bytes, please enter valid number. The max number is 115792089237316195423570985008687907853269984665640564039457584007913129639935");
    return false;
  }
};




$(document).ready(function() {
  //Event for submiting value to store by user
  $("#val_form").submit(function() {
    curr_address = window.address;
    if (check_value()) {
      var data = {};
      data[curr_address] = curr_value;
      var time = Date.now();
      time = time.toString();
      storeValue(data, wallet, time);
      update_tree();
    }
  });
  //Event for getting proof
  $("#get_proof").click(function() {
    var proof = tree.createMerkleProof(window.address);
    window.document.getElementById('proof_text').innerHTML = "Your proof is: ";
    window.document.getElementById('proof').innerHTML = proof;
  });
  //Event for reading value
  $("#read_form").submit(function() {
    var input_address = $("#input_address").val().toLowerCase();
    if (input_address in leaves) {
      var value = leaves[input_address];
      window.document.getElementById('read_text').innerHTML = "The value for " + input_address + " is: ";
      window.document.getElementById('read_value').innerHTML = value;
    } else {
      value = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563';
      window.document.getElementById('read_text').innerHTML = "There is no " + input_address + " in SMT, so the default value to use in contract is: ";
      window.document.getElementById('read_value').innerHTML = value;
    }
  });
});





global.cv = function() {
  console.log(curr_value);
  console.log(curr_address);
  console.log(leaves);
  console.log(tree.root);
  console.log(tree);
};


function changeLeaves(event_key, event_value) {
    leaves[event_key] = event_value;
}


function newTree(leaves) {
  tree = new SmtLib(160, leaves);
}
