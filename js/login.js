function login (files) {
    $(".file-input").hide();
    $(".login-loading-indicator").show();

    var fr = new FileReader()
    fr.onload = function (ev) {
        try {

            wallet = JSON.parse(ev.target.result)

            var public_address;
            arweave.wallets.jwkToAddress(wallet).then((address) => {

					      public_address = address;
					      update_login_state(true, public_address);

                $('#loginModal').modal('hide');


            });
        } catch (err) {
            alert('Error logging in: ' + err)
        } finally {
        }
    }
    fr.readAsText(files[0])

}



function update_login_state(is_logged_in, address) {
	if (is_logged_in) {
		$("#public-address").html(address);
    $(".before_login").hide();
    $("#contract_data").show();
		check_metamask();
	} else {
		$("#public-address").html();
    $(".before_login").show();
    $("#contract_data").show();
	}
}


var address;
let provider;

function check_metamask() {
   if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
      console.log('MetaMask is installed')
      //change state to Please login MetaMask and accept connect request
      $("#wait_mm").hide();
      $("#lock_mm").show();
      $('#down_mm').hide();
      ethereum.autoRefreshOnNetworkChange = false;
      provider = window['ethereum'];
      if (ethereum.networkVersion === '3') {
        provider = window['ethereum'];
        new_smt();
      } else {
        $("#net_mm").show();
      }
      ethereum.enable()
        .then(function (accounts) {
          console.log('MetaMask is unlocked');
          $("#lock_mm").hide();
          $("#cancel_mm").hide();
          var add = accounts[0];
          address = window.ethereum.selectedAddress;
          document.getElementById("eth_address").innerHTML += add;
          if (ethereum.networkVersion === '3') {
            $("#interact_db").show();
            provider = window['ethereum'];
            new_smt();
          } else {
            $("#net_mm").show();
          }
        })
        .catch(() => {
          console.log('MetaMask is locked, canseled by user');
          $("#lock_mm").hide();
          $("#cancel_mm").show();
          //"You canceled connection request. You wouldn't be able to continue your interaction with application. If you want to continue please press button and accept your connection.
        })
      ethereum.on('accountsChanged', function (accounts) {
        var add = accounts[0];
        document.getElementById("eth_address").innerHTML = "Your Ethereum Address: " + add;
        address = window.ethereum.selectedAddress;
      })
      ethereum.on('networkChanged', function(net) {
        if (net === '3') {
          $("#net_mm").hide();
          $("#interact_db").show();
          provider = window['ethereum'];
          new_smt();
        } else {
          $("#net_mm").show();
          $("#interact_db").hide();
        }
      })

      address = window.ethereum.selectedAddress; //next add check if undefined
      console.log(address);

   } else {
      $("#wait_mm").hide();
      $(".down_mm").show();
      console.log('MetaMask is not installed')
   }

}
