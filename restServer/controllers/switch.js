const contract=require("../readContract");




async function getASwitch(id){
    if(typeof id!=="number"){
        throw TypeError("ID should be a number");
    }
    else{
        let obj={};
        await contract.getSwitch(id).then(resp=>{
            
            obj={
                name:resp[0],
                version:resp[1]
            }
        });
        if(obj.name=="" && obj.version==0){
            throw Error("The switch doesn't exist or has been deleted");
        }
        return obj;
    }
}
async function getSwitches(){
    let switches=[];
    try{
        let deleted= await contract.getDeletedSwitches();
        let switchLength=await contract.getSwitchLength();

        for(let i=0;i<switchLength;i++){
            let deletedB=false;
            for(let d=0;d<deleted.length;d++){
                if(deleted[d]==i){
                    deletedB=true;
                    break;
                }
            }
            if(!deletedB){
                let nameS= await contract.getSwitch(i);
                switches.push({name:nameS[0],version:nameS[1],id:i})
            }
        }
        return switches;
  
    }
    catch(err){
        throw Error(err);
    }
}


async function addSwitch(name){
    if(typeof name!=="string"){
        throw TypeError("Name should be a string");
    }
    else{
       
        try{
            let deleted= await contract.getDeletedSwitches();
            let switchLength=await contract.getSwitchLength();
            let switchExist=false;

            for(let i=0;i<switchLength;i++){
                let deletedB=false;
                for(let d=0;d<deleted.length;d++){
                    if(deleted[d]==i){
                        deletedB=true;
                        break;
                    }
                }
                if(!deletedB){
                    let nameS= await contract.getSwitch(i);
                    if(nameS[0]==name){
                        switchExist=true;
                        break;
                    }
                }
            }
            if(!switchExist){
                let r;
                await contract.addSwitch(name).then((resp)=>{
                    r= resp;
                });
                return r;
            }
            else{
                throw Error("A switch with the given name already exists!");
            }
        }
        catch(err){
            throw Error(err);
        }



     
    }
}
async function updateSwitch(id, name){
    if(typeof id!=="number"){
        throw TypeError("ID should be a number");
    }
    else if(typeof name!=="string"){
        throw TypeError("Name should be a string");
    }
    else{
        try{
            let deleted= await contract.getDeletedSwitches();
            let switchLength=await contract.getSwitchLength();
            let switchExist=false;
            let s=await getASwitch(id);
            for(let i=0;i<switchLength;i++){
                let deletedB=false;
                for(let d=0;d<deleted.length;d++){
                    if(deleted[d]==i){
                        deletedB=true;
                        break;
                    }
                }
                if(!deletedB){
                    let nameS= await contract.getSwitch(i);
                    if(nameS[0]==name && id!=i){
                        switchExist=true;
                        break;
                    }
                }
            }
            if(!switchExist){
                let r;
                await contract.updateSwitch(id, name).then(resp=>{
                    r= resp;
                }).catch(err=>{
                    throw Error(err);
                });
                return r;
            }
            else{
                throw Error("A switch with the given name already exists!");
            }
        }
        catch(err){
            throw Error(err);
        }
      
    }
}
async function deleteSwitch(id, routeModules){
    if(typeof id!=="number"){
        throw TypeError("ID should be a number")
    }
    else{
        try{
            let deleted=await contract.getDeletedSwitches();
      
            let switchThere=false;
            let deletedB=false;

            for(let i=0;i<deleted.length;i++){
                if(deleted[i]==id){
                    deletedB=true;
                    throw Error("The switch has already been deleted");
                }
             
            }

            let nameS= await contract.getSwitch(id);
            if(nameS[0]=="" && nameS[1]==0){
                
                switchThere=false;
                throw Error("The switch doesn't exist");
            }
            else{
                switchThere=true;
            }
            if(!deletedB && switchThere){
            
                let r;
                await contract.deleteSwitch(id).then((resp)=>{
                    r= resp;
                }).catch(err=>{
                    throw Error(err);
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
    updateSwitch:updateSwitch,
    addSwitch:addSwitch,
    getASwitch:getASwitch,
    getSwitches:getSwitches,
    deleteSwitch:deleteSwitch

}