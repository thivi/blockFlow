var express = require("express");
var app = express();

var routes=require("./controllers/routes.js");
var switches=require("./controllers/switch.js");

const port = 5000;

let cross=(req,res,next)=>{
    res.set({"Access-Control-Expose-Headers":"error","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"PATCH, POST, DELETE, GET"});
    
    next();
}
app.use(express.json());
app.use(cross);
app.listen(port,()=>{
    console.log("Listening at "+port);
})

app.get("/route/:id", (req, res) => {

    routes.getARoute(parseInt(req.params.id)).then(resp=>{
        res.send(resp)
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    });

});
app.get("/routes", (req, res) => {
    routes.getRoutes().then(resp=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    });
});
app.post("/route", (req, res) => {
    console.log(req.body);
    routes.addRoute(parseInt(req.body.id), req.body.destination,req.body.nextHop, switches).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    })
});
app.patch("/route",(req,res)=>{
    routes.updateRoute(parseInt(req.body.switchId),req.body.destination,req.body.nextHop,parseInt(req.body.id), switches).then(resp=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    });
});
app.delete("/route/:id",(req,res)=>{
    routes.deleteRoute(parseInt(req.params.id)).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    })
})



app.get("/switch/:id", (req, res) => {

    switches.getASwitch(parseInt(req.params.id)).then(resp=>{
        res.send(resp)
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    });

});
app.get("/switches", (req, res) => {
    switches.getSwitches().then(resp=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    });
});
app.post("/switch", (req, res) => {
    switches.addSwitch(req.body.name).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    })
});
app.patch("/switch",(req,res)=>{
    switches.updateSwitch(parseInt(req.body.switchId),req.body.name).then(resp=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    });
});
app.delete("/switch/:id",(req,res)=>{
    switches.deleteSwitch(parseInt(req.params.id),routes).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.set({error:err});
        res.status(500);
        res.end();
    })
})
