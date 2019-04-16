module.exports.index = (app, req, res) => {
    if (req.session.authorized !== true) {
        res.render("componentes/error");
        return;
    }

    var itens = [];
    if (req.session.item !== null) {
        itens = req.session.item;
    }

    res.render("cliente/carrinho", { itens: itens });
}

module.exports.addCarrinho = (app, req, res) => {
    if (req.session.authorized !== true) {
        res.render("componentes/error");
        return;
    }

    var formData = req.body;
    var user = req.session.nome;

    var conexao = app.dbConfig.database;
    var ProdutoDAO = new app.aplication.model.ProdutoDAO(conexao);

    ProdutoDAO.addProdutoCarrinho(formData, req, res, user);
}

module.exports.pagamentoBoleto = (app, req, res) => {
    if (req.session.authorized !== true) {
        res.render("componentes/error");
        return;
    }

    var formData = req.body;
    var pagSeguro = app.pagSeguroConfig.pagSeguro;
    
    pagSeguro.setSender({
        name: req.session.nomecompleto,
        email: req.session.email,
        cpf_cnpj: req.session.cpf,
        area_code: req.session.ddd,
        phone: req.session.telefone,
        //birth_date: String //formato dd/mm/yyyy
    });

    pagSeguro.setShipping({
        street: formData.endereco,
        number: formData.numeroendereco,
        district: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        postal_code: formData.cpf,
        same_for_billing: true
    });

    var itens = {
        item1: {
            nome: formData.item1nome,
            preco: formData.item1preco
        },
        item2: {
            nome: formData.item2nome,
            preco: formData.item2preco
        }
    }

    // colocar em loop
    pagSeguro.addItem({
        qtde: 1,
        value: parseFloat(itens.item1.preco),
        description: itens.item1.nome
    });
    pagSeguro.addItem({
        qtde: 1,
        value: parseFloat(itens.item2.preco),
        description: itens.item2.nome
    });

    pagSeguro.sessionId(function (err, session_id) {
        console.log(session_id);
    });

    pagSeguro.sendTransaction({
        method: "boleto", //'boleto' ou 'creditCard'
        value: formData.total,
        installments: 1, //opcional, padrão 1
        //hash: String //senderHash gerado pela biblioteca do PagSeguro
    }, function (err, data) {
        console.log(data);
    });

    res.render("cliente/compraFinalizada");

    //var conexao = app.dbConfig.database;
    //var ProdutoDAO = new app.aplication.model.ProdutoDAO(conexao);

}