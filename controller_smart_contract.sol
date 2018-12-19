pragma solidity ^0.4.0;

contract Controller{
    
    struct Route{
        uint256 switchId;
        string destination;
        string nextHop;

    }
    struct Switch{
        string name;
        uint256 version;
    }
    mapping (uint256=>Route) routes;
    mapping (uint256=>Switch) switches;
    uint256 routeIds=0;
    uint256 routeLength=0;

    uint256 switchId=0;

    uint256[]  public deletedIds;
    uint256[] public deletedSwitch;
    function addRoute(uint256 id, string dest, string next) public{
        
        Route storage newRoute = routes[routeIds];
        newRoute.switchId = id;
        newRoute.destination = dest;
        newRoute.nextHop = next;
        switches[id].version++;
        
        routeIds++;
        routeLength++;
    }
    function updateRoute(uint256 switchI, string dest, string next, uint256 id) public{
        Route storage route = routes[id];
        if(route.switchId!=switchI) {
        
            switches[route.switchId].version++;
        }
        switches[switchI].version++;
        route.switchId = switchI;
        route.destination = dest;
        route.nextHop = next;
        
    }
    function deleteRoute(uint256 id) public{
        delete routes[id];
        switches[routes[id].switchId].version++;
        deletedIds.push(id);

    }
    function addSwitch(string name) public{
        switches[switchId].name = name;
        switches[switchId].version = 1;
        switchId++;

    }
    function updateSwitch(uint256 id, string name) public {
        switches[id].name = name;
    }
    function deleteSwitch(uint256 id) public{
        for(uint256 i = 0 ; i < routeLength; i++){
            if(routes[i].switchId==id){
                delete routes[i];
                deletedIds.push(i);
            }
        }
        delete switches[id];
        deletedSwitch.push(id);
    }
    function getSwitch(uint256 id) public view returns(string, uint256 ){
        return (switches[id].name, switches[id].version);
    }
    function getLength() public view  returns(uint256){
        return routeLength;
    }
    function getSwitchLength() public view returns(uint256){
        return switchId;
    }
    function getDeletedSwitches() public view returns(uint256[]){
        return deletedSwitch;
    }
    function getDeletedIds() public view  returns(uint256[]){
        return deletedIds;
    }
    function getRoute(uint256 id) public view  returns(uint256,string,string, string){
        return (routes[id].switchId,routes[id].destination,routes[id].nextHop,switches[routes[id].switchId].name);
    }
}
