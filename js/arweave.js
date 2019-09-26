  async function updateArweaveDB(data, key) {
      let transaction = await arweave.createTransaction({
        data: JSON.stringify(data[1])
      }, key);
      await transaction.addTag('Content-Type', 'text/plain');
      await transaction.addTag('Arweave-SMT', 'DEMO_0.1.1');
      await transaction.addTag('ETH-block', data[0]);
      await arweave.transactions.sign(transaction, key);

      tx_id = transaction.id;
      console.log(transaction.id);
      // console.log(transaction.get('data', {decode: true, string: true}));
      // transaction.get('tags').forEach(tag => {
      //   let key = tag.get('name', {decode: true, string: true});
      //   let value = tag.get('value', {decode: true, string: true});
      //   console.log(`${key} : ${value}`);
      // })


      const response = await arweave.transactions.post(transaction);
      if (response.status === 400 || response.status === 500) {
        alert("You haven't enough balance.")
      } else {
        alert("Done. Thank you for donation. DB updated successfully! Your transaction id is: " + tx_id);
        //hide button
        document.getElementById('press_donate').innerHTML = 'Thanks for a donation! You are awesome.';
        $("#donate").hide();
      }

    }



    async function tx_list() {
              const txids = await arweave.arql({
                op: "and",
                expr1: {
                  op: "equals",
                  expr1: "Content-Type",
                  expr2: "text/plain"
                },
                expr2: {
                  op: "equals",
                  expr1: "Arweave-SMT",
                  expr2: "DEMO_0.1.1"
                }
              });

              var sorted_tx = [];
              for (let i = 0; i < txids.length; i++) {
                let tx = await arweave.transactions.get(txids[i]);
                let blockNumber = Number(tx.get('tags')[2].get('value', {decode: true, string: true}));
                let data = JSON.parse(tx.get('data', {decode: true, string: true}));
                let info = {
                  block_number: blockNumber,
                  leaf: data 
                };
                sorted_tx.push(info);
              }

              sorted_tx.sort(function(a, b) {
                return a.block_number - b.block_number;
              });

              return sorted_tx;
          };
