var contract=require("../readContract");


async function getRoutes(){
    let routes=[];
    try{
        let deleted= await contract.getDeletedRouteIds();
        let switchLength=await contract.getRoutesLength();

        for(let i=0;i<switchLength;i++){
            let deletedB=false;
            for(let d=0;d<deleted.length;d++){
                if(deleted[d]==i){
                    deletedB=true;
                    break;
                }
            }
            if(!deletedB){
                let nameS= await contract.getRoute(i);
                routes.push({switchId:nameS[0],destination:nameS[1],nextHop:nameS[2], switchName:nameS[3], routeId:i})
            }
        }
        return routes;
  
    }
    catch(err){
        throw Error(err);
    }
}
async function getARoute(id){
    if(typeof id!=="number"){
        throw TypeError("ID should be a number");
    }
    else{
        let obj={};
        await contract.getRoute(id).then(resp=>{
            obj={
                switchId:resp[0],
                destination:resp[1],
                nextHop:resp[2], 
                switchName:resp[3]
            }
        });
        if(obj.destination=="" && obj.nextHop=="" && obj.switchId==0 && obj.switchName==""){
            throw Error("The route doesn't exist or has been deleted");
        }
        return obj;
    }
}

async function addRoute(id, dest, next, switchesF){
    if(typeof id !=="number"){
        throw TypeError("ID should be a number");
    }
    else if(typeof dest !=="string"){
        throw TypeError("Destination address should be a string");
    }
    else if(typeof next !=="string"){
        throw TypeError("The next-hop address should be a string");
    }
    else{
        try{
            
            let deletedSwitch=await contract.getDeletedSwitches();
            let deletedB=false;
            for(let i=0;i<deletedSwitch.length;i++){
                if(deletedSwitch[i]==id){
                    deletedB=true;
                    break;
                }
            }
            if(deletedB){
                throw Error("The switch specified has been deleted");
            }
    
            let switches=await switchesF.getSwitches();
            let switchB=false;
            for(let i=0;i<switches.length;i++){
                if(switches[i].id==id){
                    switchB=true;
                }
            }
            if(!switchB){
                throw Error("The switch specified does not exist");
            }

            let routes=await getRoutes();
            let routeB=false;

            for(let i=0;i<routes.length;i++){
                console.log(routes[i].destination)
                if(routes[i].destination==dest && routes[i].switchId==id){
                    routeB=true;
                    break;
                }
            }
            if(routeB){
                throw Error("A routing entry for the destination adddress provided for the given switch already exists")
            }
            let r;
            await contract.addRoute(id, dest,next).then(resp=>{
                r=resp;
            });
            return r;

        }
        catch(err){
            throw Error(err);
        }
    }
}
async function updateRoute(switchId, dest, next, id, switchesF){
    if(typeof id !=="number"){
        throw TypeError("Route ID should be a number");
    }
    else if(typeof switchId !=="number"){
        throw TypeError("Switch ID should be a number")
    }
    else if(typeof dest !=="string"){
        throw TypeError("Destination address should be a string");
    }
    else if(typeof next !=="string"){
        throw TypeError("The next-hop address should be a string");
    }
    else{
        try{
            
            let deletedSwitch=await contract.getDeletedSwitches();
            let deletedB=false;
            let ro=await getARoute(id);
            for(let i=0;i<deletedSwitch.length;i++){
                if(deletedSwitch[i]==switchId){
                    deletedB=true;
                    break;
                }
            }
            if(deletedB){
                throw Error("The switch specified has been deleted");
            }
    
            let switches=await switchesF.getSwitches();
            let switchB=false;
            for(let i=0;i<switches.length;i++){
                if(switches[i].id==switchId){
                    switchB=true;
                }
            }
            if(!switchB){
                throw Error("The switch specified does not exist");
            }

            let routes=await getRoutes();
            let routeB=false;

            for(let i=0;i<routes.length;i++){
                if(routes[i].destination==dest && routes[i].switchId==switchId && routes[i].routeId!=id){
                    routeB=true;
                }
            }
            if(routeB){
                throw Error("A routing entry for the destination adddress provided for the given switch already exists")
            }
            let r;
            await contract.updateRoute(id,switchId, dest,next).then(resp=>{
                r=resp;
            })
            return r;

        }
        catch(err){
            throw Error(err);
        }
    }
}

async function deleteRoute(id){
    if(typeof id!=="number"){
        throw TypeError("ID should be a number")
    }
    else{
        try{
            let deleted=await contract.getDeletedRouteIds();
            let deletedB=false;
            for(let i=0;i<deleted.length;i++){
                if(deleted[i]==id){
                    deletedB=true;
                    throw Error("The routing entry has already been deleted");
                }
               
            }
            let delR=await getARoute(id);
            if(!deletedB){
                let r;
                await contract.deleteRoute(id).then((resp)=>{
                    r= resp;
                });
                return r;
            }

        }
        catch(err){
            throw Error(err);
        }
    }
}

module.exports={
    getRoutes:getRoutes,
    getARoute:getARoute,
    addRoute:addRoute,
    deleteRoute:deleteRoute,
    updateRoute:updateRoute
}