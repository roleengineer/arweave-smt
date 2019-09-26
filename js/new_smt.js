const SmtLib = require('./SmtLib.js');
const Web3 = require('web3');
const bigInt = require('big-integer');
const JSBI = require('jsbi');

let web3 = null;
let contractASET;
let contractSend100ASET;

let leaves = {};
let tree;
let blockNumber;
//The data that is pushing to Arweave net in tx data[0] always blockNumber, next element/s is/are dictionary/ies with key - address (path to value in SMT) and value (bytes32 value of token amount)
let data = [];

global.new_smt = function() {
  web3 = new Web3(provider);

  let contract_abi =[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"},{"name":"balance","type":"uint256"},{"name":"proof","type":"bytes"}],"name":"balanceOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender_balance","type":"uint256"},{"name":"sender_proof","type":"bytes"},{"name":"recipient","type":"address"},{"name":"recipient_balance","type":"uint256"},{"name":"recipient_proof","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"root","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"sender_balance","type":"uint256"},{"name":"sender_proof","type":"bytes"},{"name":"recipient","type":"address"},{"name":"recipient_balance","type":"uint256"},{"name":"recipient_proof","type":"bytes"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":true,"name":"_value","type":"bytes32"}],"name":"Write","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

  let contract_address = '0xA92331818497318196384E802Ca59681A7Db898e';

  contractASET = new web3.eth.Contract(contract_abi, contract_address);

  contract_abi = [{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"sender_balance","type":"uint256"},{"internalType":"bytes","name":"sender_proof","type":"bytes"},{"internalType":"uint256","name":"recipient_balance","type":"uint256"},{"internalType":"bytes","name":"recipient_proof","type":"bytes"}],"name":"send","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_reciever","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Sent","type":"event"},{"inputs":[{"internalType":"contract ASET","name":"_tokenContract","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"tokenContract","outputs":[{"internalType":"contract ASET","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];

  contract_address = '0x41f5662FD260F40d6F9E8264deF0E308711f0e3c';

  contractSend100ASET = new web3.eth.Contract(contract_abi, contract_address);

  //DB

  async function update_tree() {
    let syncBlock;
    //Fetch data from Arweave DB
    let tx_array = await tx_list();

    //Form leaves state accordingly current state of Arweave DB
    for (let i = 0; i < tx_array.length; i++) {
      let keys = Object.keys(tx_array[i].leaf);
      for (let j = 0; j < keys.length; j++) {
        changeLeaves(keys[j], tx_array[i].leaf[keys[j]]);
      }
    }
    //Take the last block that stores in Arweave DB + checks if the DB is not empty
    if (tx_array.length != 0) {
      blockNumber = tx_array[tx_array.length - 1].block_number;
    } else {
      blockNumber = 6326559; //one block before ASET contract was deployed
    }


    //Fetch data from Ethereum events since the last block that stores in Arweave DB
    let events = await contractASET.getPastEvents('Write', {fromBlock: blockNumber + 1});

    //Check if there is no new data another than stores in Arweave DB

    if (events[0] !== undefined) {
      //donate
      $("#donate").show();
      document.getElementById('press_donate').innerHTML = 'By pressing "Donate" button you will be prompt to donate the specific amount and you will be able confirm or reject the donation.';

      //Form the data for Arweave DB  data = [blockNumber, temp_leaves, count_keys]
      blockNumber = events[0].blockNumber;
      data.push(blockNumber);
      let temp_leaves = {};
      let count = 0;
      for (let i = 0; i < events.length; i++) { //can optimize
        if (events[i].blockNumber === blockNumber) {
          count++;
          temp_leaves[events[i].returnValues[0]] = events[i].returnValues[1];
          //update leaves with new data from Ethereum blockchain
          changeLeaves(events[i].returnValues[0], events[i].returnValues[1]);
        } else {
          changeLeaves(events[i].returnValues[0], events[i].returnValues[1]);
        }
      }
      data.push(temp_leaves);
      data.push(count);
      //sync
      syncBlock = events[events.length - 1].blockNumber;
    } else {
      //hide donate
      document.getElementById('press_donate').innerHTML = 'Arweave database currently is up-to-date. You will be able to donate when new transactions that changes the state appear.';
      $("#donate").hide();

      //sync
      syncBlock = blockNumber;
    }

    newTree(leaves);

    //Check synchronizing root at contract and root at app
    let root = await contractASET.methods.root().call();
    checkRoot(root);

    //Contract event listener
    let subscription = await contractASET.events.Write({fromBlock: syncBlock + 1}).on('data', (event) => {
      leaves[event.returnValues[0]] = event.returnValues[1];
      newTree(leaves);
    })

  }

  update_tree();
  //Synchronize
  function checkRoot(root) {
    if (root === tree.root) {
      document.getElementById('sync').innerHTML = 'This message shows that service works correct.';
    } else {
      document.getElementById('sync').innerHTML = 'Something went wrong. Service out of synchronizing. Please open issue on github.';
    }
  };

  function changeLeaves(event_key, event_value) {
      leaves[event_key] = event_value;
  }


  function newTree(leaves) {
    tree = new SmtLib(160, leaves);
  }


};

async function get100ET() {
  let balance = leaves['0x24DEe00fEC9917c80a332703e8D745E9E699938c'];
  let sender_balance = bigInt(balance.substring(2), 16).toString();
  let sender_proof = tree.createMerkleProof('0x24DEe00fEC9917c80a332703e8D745E9E699938c');
  let recipient_balance;
  let recipient_address = web3.utils.toChecksumAddress(address);
  if (recipient_address in leaves) {
      recipient_balance = leaves[recipient_address];
      recipient_balance = bigInt(recipient_balance.substring(2), 16).toString();
  } else {
      recipient_balance = '0';
  }
  let recipient_proof;
  let zx = '0x';
  let tr_bal = (bigInt(sender_balance).minus(bigInt(100))).toString(16);
  if (tr_bal.length < 64) {
    tr_bal = zx + '0'.repeat(64 - tr_bal.length) + tr_bal;
  } else if (tr_bal.length == 64) {
    tr_bal = zx + tr_bal;
  } else {
    throw "Unexpected error";
  }
  leaves['0x24DEe00fEC9917c80a332703e8D745E9E699938c'] = tr_bal;
  let tr_tree = new SmtLib(160, leaves);
  recipient_proof = tr_tree.createMerkleProof(recipient_address);
  leaves['0x24DEe00fEC9917c80a332703e8D745E9E699938c'] = balance;
  let tx = await contractSend100ASET.methods.send('0x24DEe00fEC9917c80a332703e8D745E9E699938c', sender_balance, sender_proof, recipient_balance, recipient_proof).send({from: address});
}

let balanceOf = (_address) => {
    //Users input
    let address = _address;
    address = web3.utils.toChecksumAddress(address);
    //balanceof

    let balance;
    if (address in leaves) {
        balance = leaves[address];
        balance = bigInt(balance.substring(2), 16).toString();
    } else {
        balance = '0';
    }
    let proof = tree.createMerkleProof(address);

    let output = {
        'address' : address,
        'balance' : balance,
        'proof' : proof
    };
    console.log(JSON.stringify(output));

    window.document.getElementById('balanceOf_text').innerHTML = '';
    window.document.getElementById('balanceOf_output').innerHTML = JSON.stringify(output, null, 4);

};

let transfer = (_sender, _recipient, _amount) => {

    //Users input
    let sender = _sender;
    sender = web3.utils.toChecksumAddress(sender);
    let recipient = _recipient;
    recipient = web3.utils.toChecksumAddress(recipient);
    let amount = _amount;

    //transfer
    let zx = '0x';
    let sender_balance;
    let tr_bal;
    let output;
    if (sender in leaves) {
        let balance = leaves[sender];
        sender_balance = leaves[sender];
        sender_balance = bigInt(sender_balance.substring(2), 16).toString();
        tr_bal = (bigInt(leaves[sender].substring(2), 16).minus(bigInt(amount))).toString(16);
        if (tr_bal.length < 64) {
          tr_bal = zx + '0'.repeat(64 - tr_bal.length) + tr_bal;
        } else if (tr_bal.length == 64) {
          tr_bal = zx + tr_bal;
        } else {
          throw "Unexpected error";
        }

        let sender_proof = tree.createMerkleProof(sender);
        let recipient_balance;
        if (recipient in leaves) {
          recipient_balance = leaves[recipient];
          recipient_balance = bigInt(recipient_balance.substring(2), 16).toString();
        } else {
          recipient_balance = '0';
        }

        leaves[sender] = tr_bal; //This absolutely must not be added to db
        let tr_tree = new SmtLib(160, leaves);
        leaves[sender] = balance;
        let recipient_proof = tr_tree.createMerkleProof(recipient);
        amount = bigInt(amount).toString();

        output = {
          'sender' : sender,
          'sender_balance' : sender_balance,
          'sender_proof' : sender_proof,
          'recipient' : recipient,
          'recipient_balance' : recipient_balance,
          'recipient_proof' : recipient_proof,
          'amount' : amount
        };

    } else {

        let balance = '0';

        let proof = tree.createMerkleProof(sender);
        output = {
            message: 'Senders balance equals to 0, so the transfer is impossible.',
            'address' : sender,
            'balance' : balance,
            'proof' : proof
        };
    }

    console.log(JSON.stringify(output));



    window.document.getElementById('transfer_text').innerHTML = '';
    window.document.getElementById('transfer_output').innerHTML = JSON.stringify(output, null, 4);

};

var check_amount = function(_amount) {
  var max = JSBI.BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
  var val = _amount;
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
  //Event get 100 ASET
  $('#get_100_et').click(function() {
    get100ET();
  });
  //Event balanceOf for entered address
  $("#balanceOf").submit(function() {
    var input_address = $("#input_bal_address").val().toLowerCase();
    balanceOf(input_address);
  });
  //Event balanceOf for MetaMask address
  $("#mm_balance").click(function() {
    var input_address = address.toLowerCase();
    balanceOf(input_address);
  });

  //Event transfer for entered parameters
  $("#transfer_data").submit(function() {
    var input_amount = $("#input_amount").val().toLowerCase();
    if (check_amount(input_amount)) {
      var input_sender = $("#input_sender").val().toLowerCase();
      var input_recipient = $("#input_recipient").val().toLowerCase();
      transfer(input_sender, input_recipient, input_amount);
    }
  });

  //Event donate
  $("#donate").click(function() {
    var confirmed = confirm('Do you really want to donate? It will cost you ' + (0.000008807065 + data[2] * 0.000000312585) + 'AR.');
    if (confirmed) {
      //donation
      updateArweaveDB(data, wallet);
      //waiting for tx confirmation on Arweave
      setTimeout(new_smt, 180000);
    } else {
      alert("It's ok. Someone else will do it.")
    }
  });

});
