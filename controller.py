import vymgmt, sys
from web3 import Web3, HTTPProvider
import time


def getState():
  return contract.functions.getState().call()


def getDeletedIds():
  return contract.functions.getDeletedIds().call()


def getLength():
  return contract.functions.getLength().call()


def getRoutes():

  deleted = getDeletedIds()
  length = getLength()
  print(deleted , length)

  switch=contract.functions.getSwitch(switchName).call()
  print(switch)
  if(switch[1]!=0 and switch[1]!=version["ver"]):
    vyos.set("protocols static route 0.0.0.0/0 next-hop 192.168.2.2 distance 1")
    vyos.delete("protocols static route")
    version["ver"]=switch[1]
    for x in range(length):

      there = False

      for d in deleted:
        if(x == d):
          there = True
      print(there)
      if(there == False):

        route=contract.functions.getRoute(x).call()
        name=route[0]
        dest=route[1]
        nextH=route[2]
   
        print(name, dest, nextH)

        configS="protocols static route "+dest+" next-hop "+nextH+" distance 1"
        if(name==switchName):
          print("Setting")
          vyos.set(configS)

    vyos.commit()
  else:
    print("No new version available")



w3 = Web3(HTTPProvider("http://"+sys.argv[1]+":8545"))

abi="""[ { "constant": false, "inputs": [ { "name": "switchI", "type": "uint256" }, { "name": "dest", "type": "string" }, { "name": "next", "type": "string" }, { "name": "id", "type": "uint256" } ], "name": "updateRoute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x10601ee6" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "deletedSwitch", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x11cc5aee" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" }, { "name": "name", "type": "string" } ], "name": "updateSwitch", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x23b30383" }, { "constant": true, "inputs": [], "name": "getSwitchLength", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x43b0b7f5" }, { "constant": false, "inputs": [ { "name": "name", "type": "string" } ], "name": "addSwitch", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x565e8b68" }, { "constant": true, "inputs": [], "name": "getDeletedSwitches", "outputs": [ { "name": "", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x5b098ce4" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" }, { "name": "dest", "type": "string" }, { "name": "next", "type": "string" } ], "name": "addRoute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x68efa3c9" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getSwitch", "outputs": [ { "name": "", "type": "string", "value": "" }, { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x825f1276" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "deleteRoute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x9693c4a4" }, { "constant": true, "inputs": [], "name": "getDeletedIds", "outputs": [ { "name": "", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xafd09c5f" }, { "constant": true, "inputs": [], "name": "getLength", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xbe1c766b" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "deletedIds", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xd7f850ee" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "deleteSwitch", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xec6a3b7d" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getRoute", "outputs": [ { "name": "", "type": "uint256", "value": "0" }, { "name": "", "type": "string", "value": "" }, { "name": "", "type": "string", "value": "" }, { "name": "", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xfa66358a" } ]"""
contract_address="0xF32773B4D06c7ABa3A1d60f715863BCddFeE04E2"
wallet_address="0xD9ce03f95d1165232002b2c0d3d07F10576f4Adc"
wallet_private_key="9ab4069590211c5045bd2ee23958ca7d3807fad80e14b72b9e5e92608ad68fb0"


w3.eth.enable_unaudited_features()

contract = w3.eth.contract(address=contract_address, abi=abi)

switchName =int(sys.argv[2])
version={"ver":1}
vyos=vymgmt.Router(sys.argv[3], 'vyos',password='vyos',port=22)
vyos.login()
vyos.configure()

while(True):
  getRoutes()
  time.sleep(10)


vyos.exit()
vyos.logout()
