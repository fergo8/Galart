module.exports = (app)=>{

    app.get("/admin/cadastroProduto", (req, res)=>{
        app.aplication.controller.admin.cadastroProduto.index(app, req, res);
    });

    app.post("/admin/cadastroProduto", (req, res)=>{
        app.aplication.controller.admin.cadastroProduto.inserindoProduto(app, req, res);
    });

}