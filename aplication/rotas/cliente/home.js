module.exports=(app)=>{

    app.get('/',(req,res)=>{
        app.aplication.controller.cliente.home.index(app,req,res);
    })
    
    app.get('/carrinho',(req,res)=>{
        app.aplication.controller.cliente.home.index(app,req,res);
    })
}