  async function storeValue(data, key, time) {
      let transaction = await arweave.createTransaction({
        data: JSON.stringify(data)
      }, key);
      await transaction.addTag('Content-Type', 'text/plain');
      await transaction.addTag('Arweave-SMT', 'DEMO_0.0.1');
      await transaction.addTag('Unix-Time', time);
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
        alert("Done. Your value have been stored successfully! Your transaction id is: " + tx_id);
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
                  expr2: "DEMO_0.0.1"
                }
              });

              var sorted_tx = [];
              for (let i = 0; i < txids.length; i++) {
                let tx = await arweave.transactions.get(txids[i]);
                let time = Number(tx.get('tags')[2].get('value', {decode: true, string: true}));
                let data = JSON.parse(tx.get('data', {decode: true, string: true}));
                let info = {
                  unix_time: time,
                  leaf: data
                };
                sorted_tx.push(info);
              }

              sorted_tx.sort(function(a, b) {
                return a.unix_time - b.unix_time;
              });

              return sorted_tx;
          };
