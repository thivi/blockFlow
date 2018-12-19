var Web3 = require("web3");
var web3 = new Web3("http://localhost:8545");
var Tx = require("ethereumjs-tx");

const wallet_add = "0xD9ce03f95d1165232002b2c0d3d07F10576f4Adc";
const wallet_private = new Buffer("9ab4069590211c5045bd2ee23958ca7d3807fad80e14b72b9e5e92608ad68fb0", 'hex')
const contract_add = "0xF32773B4D06c7ABa3A1d60f715863BCddFeE04E2";
const abi = [ { "constant": false, "inputs": [ { "name": "switchI", "type": "uint256" }, { "name": "dest", "type": "string" }, { "name": "next", "type": "string" }, { "name": "id", "type": "uint256" } ], "name": "updateRoute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x10601ee6" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "deletedSwitch", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x11cc5aee" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" }, { "name": "name", "type": "string" } ], "name": "updateSwitch", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x23b30383" }, { "constant": true, "inputs": [], "name": "getSwitchLength", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x43b0b7f5" }, { "constant": false, "inputs": [ { "name": "name", "type": "string" } ], "name": "addSwitch", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x565e8b68" }, { "constant": true, "inputs": [], "name": "getDeletedSwitches", "outputs": [ { "name": "", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x5b098ce4" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" }, { "name": "dest", "type": "string" }, { "name": "next", "type": "string" } ], "name": "addRoute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x68efa3c9" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getSwitch", "outputs": [ { "name": "", "type": "string", "value": "" }, { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x825f1276" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "deleteRoute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x9693c4a4" }, { "constant": true, "inputs": [], "name": "getDeletedIds", "outputs": [ { "name": "", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xafd09c5f" }, { "constant": true, "inputs": [], "name": "getLength", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xbe1c766b" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "deletedIds", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xd7f850ee" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "deleteSwitch", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xec6a3b7d" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getRoute", "outputs": [ { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "string", "value": "" }, { "name": "", "type": "string", "value": "" }, { "name": "", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xfa66358a" } ];
const contract = new web3.eth.Contract(abi, contract_add);

function sendTransaction(encoded){
    console.log(encoded);
    return new Promise((res,rej)=>{
        web3.eth.getBalance(wallet_add).then(console.log)
        web3.eth.getTransactionCount(wallet_add, (err, txCount) => {
            console.log("tx", txCount);
            if (err) {
                console.log(err);
                rej(err);
            }
            else {
                web3.eth.estimateGas({
                    to: contract_add,
                    data: encoded
                }).then((gas) => {
                    console.log(gas);
                    const rtx = {
                        nonce: web3.utils.toHex(txCount),
                        gas: web3.utils.toHex((gas*18)+21000),
                        gasPrice: web3.utils.toHex(web3.utils.toWei('40', 'gwei')),
                        data: encoded,
                        to: web3.utils.toHex(contract_add),
                        from:web3.utils.toHex(wallet_add),
                        chainId: web3.utils.toHex(33),
                        gasLimit:web3.utils.toHex(400000)
                    }
                    let tx = new Tx(rtx);
                    tx.sign(wallet_private);
                    let ser = tx.serialize();
    
                    web3.eth.sendSignedTransaction('0x' + ser.toString('hex'), (err, result) => {
                        if (err) {
                            console.error(err);
                            rej(err)
                        }
                        else {
                            console.log("Success",result);
                            res(result)
                        }
                    })
                })
    
    
            }
    
        })
    })
    
}
function addRoute(id, dest, next){
    return new Promise((res,rej)=>{
        let encoded = contract.methods.addRoute(id, dest, next).encodeABI();
        sendTransaction(encoded).then((resp)=>{
            res(resp);
        }).catch(err=>{
            rej(err);
        })
    })
  
}

function updateRoute(id, switchI, dest, next){
    return new Promise((res,rej)=>{
        let encoded = contract.methods.updateRoute(switchI, dest, next,id).encodeABI();
        sendTransaction(encoded).then((resp)=>{
            res(resp);
        }).catch(err=>{
            rej(err);
        })
    })
}

function deleteRoute(id){
    return new Promise((res,rej)=>{
        let encoded = contract.methods.deleteRoute(id).encodeABI();
        sendTransaction(encoded).then((resp)=>{
            res(resp);
        }).catch(err=>{
            rej(err);
        })
    })
}

function addSwitch(name){
    return new Promise((res,rej)=>{
        let encoded = contract.methods.addSwitch(name).encodeABI();
        sendTransaction(encoded).then((resp)=>{
            res(resp);
        }).catch(err=>{
            rej(err);
        })
    })
}

function updateSwitch(id, name){
    return new Promise((res,rej)=>{
        let encoded = contract.methods.updateSwitch(id, name).encodeABI();
        sendTransaction(encoded).then((resp)=>{
            res(resp);
        }).catch(err=>{
            rej(err);
        })
    })
}

function deleteSwitch(id){
    return new Promise((res,rej)=>{
        let encoded = contract.methods.deleteSwitch(id).encodeABI();
        sendTransaction(encoded).then((resp)=>{
            res(resp);
        }).catch(err=>{
            rej(err);
        })
    })
}

function getSwitch(id){
    return new Promise((res,rej)=>{
        contract.methods.getSwitch(id).call((err,resp)=>{
            if(err){
                rej(err);
            }
            else{
                res(resp);
            }
        })
    })
}

function getRoutesLength(){
    return new Promise((res,rej)=>{
        contract.methods.getLength().call((err,resp)=>{
            if(err){
                rej(err);
            }
            else{
                res(resp);
            }
        })
    })
}

function getDeletedRouteIds(){
    return new Promise((res,rej)=>{
        contract.methods.getDeletedIds().call((err,resp)=>{
            if(err){
                rej(err);
            }
            else{
                res(resp);
            }
        })
    })
}
function getRoute(id){
    return new Promise((resolve,reject)=>{
        contract.methods.getRoute(id).call((err, resp) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(resp);
            }
        })
    })
  
}

function getDeletedSwitches(){
    return new Promise((res, rej)=>{
        contract.methods.getDeletedSwitches().call((err,resp)=>{
            if(err){
                rej(err);
            }
            else{
                res(resp);
            }
        })
    })
}
function getSwitchLength(){
    return new Promise((res,rej)=>{
        contract.methods.getSwitchLength().call((err,resp)=>{
            if(err){
                rej(err);
            }
            else{
                res(resp);
            }
        })
    })
}



module.exports={
    getDeletedRouteIds:getDeletedRouteIds,
    getRoutesLength:getRoutesLength,
    addSwitch:addSwitch,
    deleteRoute:deleteRoute,
    deleteSwitch:deleteSwitch,
    addRoute:addRoute,
    getRoute:getRoute,
    getSwitch:getSwitch,
    updateRoute:updateRoute,
    updateSwitch:updateSwitch,
    getSwitchLength:getSwitchLength,
    getDeletedSwitches:getDeletedSwitches
}