const bodyParser = require('body-parser');
const express = require('express');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c52a1085bcf947b6809b4e291eca5691"));
// const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c52a1085bcf947b6809b4e291eca5691"));
// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, ()=>console.log('Express is running on port 3000'));

app.get('/api/wallet/hlb/create', (req, res)=>{
    created = new Date();
    console.log("HLB GET new Address");
    let hasil = {};
    ethData = web3.eth.accounts.create();
    hasil.address = ethData.address;
    hasil.privateKey = ethData.privateKey.replace(/^0x+/i, '');
    console.log("wallet : " + hasil.address);
    console.log("privateKey : " + hasil.privateKey);
    return res.send(hasil);
});

app.get('/api/wallet/hlb/getblockcount', (req, res)=>{
    web3.eth.getBlockNumber().then(block=>{
        return res.status(200).send((block).toString());
    });
});

app.get('/api/wallet/hlb/getblock/:hash', (req, res)=>{
    const hash = req.params.hash;
    const hasil = {};
    web3.eth.getBlock(hash).then(block => {
        return res.status(200).send(block);
    });
});

app.get('/api/wallet/hlb/getblockhash/:count', (req, res)=>{
    const number = req.params.count;
    web3.eth.getBlock(number).then(block => {
        return res.status(200).send(block['hash']);
    });
});


app.get('/api/wallet/hlb/balance/:address',(req, res)=>{
    const Address = req.params.address;
    let hasil = {};
    let minABI = [
        {"constant":false,"inputs":[],"name":"freezeTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unfreezeTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"createTokens","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_refund","type":"address"},{"name":"_value","type":"uint256"}],"name":"refundTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[],"name":"Unfreeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_token","type":"address"},{"indexed":false,"name":"_refund","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"RefundTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}
    ];
    let MyContract = new web3.eth.Contract(minABI, '0x2a4246c318b5ecdc3ead2d61ea0839bf88f7727b', {
        from: Address, // default from address
        gasPrice: '11000000000' // default gas price in wei, 20 gwei in this case
    });

    MyContract.methods.balanceOf(Address).call().then(function(result){
            //the result holds your Token Balance that you can assign to a var
        hasil.balance = result/100000000;
        console.log('Balance token : '+hasil.balance);
        res.send(hasil);
    });

});

app.get('/api/wallet/hlb/tx/:hash',(req, res)=>{
    const txHash = req.params.hash;
    let hasil = {};
    web3.eth.getTransactionReceipt(txHash, (error, result)=>{
        res.send(result);
    });
});

app.post('/api/wallet/hlb/send',(req, res)=>{

        const myAddress = req.body.from;
        const destAddress = req.body.to;
        const transferAmount = req.body.value * 100000000;

        const privKey = Buffer.from(req.body.privateKey, 'hex');

        let hasil = {};

        console.log(`web3 version: ${web3.version}`);
        // Determine the nonce
        web3.eth.getTransactionCount(myAddress).then(nonce => {
            // This file is just JSON stolen from the contract page on etherscan.io under "Contract ABI"
            let abiArray = [
                {"constant":false,"inputs":[],"name":"freezeTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unfreezeTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"createTokens","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_refund","type":"address"},{"name":"_value","type":"uint256"}],"name":"refundTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[],"name":"Unfreeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_token","type":"address"},{"indexed":false,"name":"_refund","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"RefundTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}
            ];

            // This is the address of the contract which created the ERC20 token
            let contractAddress = '0x2a4246c318b5ecdc3ead2d61ea0839bf88f7727b';
            let contract = new web3.eth.Contract(abiArray, contractAddress, {from: myAddress});

            let gasPriceGwei = 10;
            let gasLimit = 52535;
            // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
            let rawTransaction = {
                "from": myAddress,
                "nonce": nonce,
                "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
                "gasLimit": web3.utils.toHex(gasLimit),
                "to": contractAddress,
                "value": "0x0",
                "data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
                "chainId": 0x01
            };

            let tx = new Tx(rawTransaction);
            tx.sign(privKey);

            let serializedTx = tx.serialize();
            let raw = '0x'+serializedTx.toString('hex');

            // Comment out these three lines if you don't really want to send the TX right now
            web3.eth.sendSignedTransaction(raw, (err, txHash)=>{
                hasil.txHash = txHash;
                console.log(txHash);
                res.send(hasil);
            });
        });

});