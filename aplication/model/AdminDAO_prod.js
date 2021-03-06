const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var ObjectID = require("mongodb").ObjectId;
var crypto = require("crypto");

function AdminDAO() {}

AdminDAO.prototype.inserirAdmin = function (usuario) {
    const url = process.env.MONGODB_URI;
    const dbName = 'galart';
    const client = new MongoClient(url, { useNewUrlParser: true });

    client.connect(function (err) {
        //assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('admins');
        
        var senha_criptografada = crypto.createHash("md5").update(usuario.senhaadmin).digest("hex");
        usuario.senhaadmin = senha_criptografada;

        collection.insertOne(usuario);

        client.close();
    });
}

AdminDAO.prototype.mostrarAdmin = function (data, res) {
    const url = process.env.MONGODB_URI;
    const dbName = 'galart';
    const client = new MongoClient(url, { useNewUrlParser: true });

    client.connect(function (err) {
        //assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('admins');

        if (data == null) {
            collection.find().toArray(function (err, result) {
                res.render("admin/listaAdmin", { data: result });
            });
        } else {
            collection.find({ _id: ObjectID(data._id) }).toArray(function (err, result) {
                res.render("admin/edicaoAdmin", { data: result });
            });
        }

        client.close();
    });
}

AdminDAO.prototype.atualizarAdmin = function (data) {
    const url = process.env.MONGODB_URI;
    const dbName = 'galart';
    const client = new MongoClient(url, { useNewUrlParser: true });

    client.connect(function (err) {
        //assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('admins');
        
        collection.updateOne(
            { _id: ObjectID(data._id) },
            {
                $set: {
                    nomeadmin: data.nomeadmin,
                    emailadmin: data.emailadmin,
                    senhaadmin: data.senhaadmin
                }
            }
        );

        client.close();
    });
}

AdminDAO.prototype.autenticar = function (user, req, res) {
    const url = process.env.MONGODB_URI;
    const dbName = 'galart';
    const client = new MongoClient(url, { useNewUrlParser: true });

    client.connect(function (err) {
        //assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('admins');
        
        var senha_criptografada = crypto.createHash("md5").update(user.senhaadmin).digest("hex");
        user.senhaadmin = senha_criptografada;

        collection.find(user).toArray(function (err, result) {
            if (result[0] == undefined) {
                res.render("admin/loginAdmin", { valid: {}, msg: "Senha e/ou login desconhecidos" });
            } else {
                if (result[0].senhaadmin === user.senhaadmin) {
                    req.session.authorized = true;

                    req.session.nomeadmin = result[0].nomeadmin;

                    res.redirect("admin/listaProdutos");
                }
            }
        });

        client.close();
    });
}

AdminDAO.prototype.excluirAdmin = function (data, res) {
    const url = process.env.MONGODB_URI;
    const dbName = 'galart';
    const client = new MongoClient(url, { useNewUrlParser: true });

    client.connect(function (err) {
        //assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('admins');
    
        collection.deleteOne({ _id: ObjectID(data._id) });

        collection.find().toArray(function (err, result) {
            res.render("admin/listaAdmin", { data: result });
        });

        client.close();
    });
}

/*AdminDAO.prototype.inserirAdmin = function (usuario) {
    this._conexao.open(function (err, mongoclient) {
        mongoclient.collection("admins", function (err, collection) {

            var senha_criptografada = crypto.createHash("md5").update(usuario.senhaadmin).digest("hex");
            usuario.senhaadmin = senha_criptografada;
            
            collection.insertOne(usuario);
        });
        mongoclient.close();
    });
}



AdminDAO.prototype.atualizarAdmin = function (data) {
    this._conexao.open(function (err, mongoclient) {
        mongoclient.collection("admins", function (err, collection) {
            collection.replaceOne(
                { _id: ObjectID(data._id) },
                {
                    nomeadmin: data.nomeadmin,
                    emailadmin: data.emailadmin,
                    senhaadmin: data.senhaadmin
                }
            );
        });
        mongoclient.close();
    });
}

AdminDAO.prototype.excluirAdmin = function (data, res) {
    this._conexao.open(function (err, mongoclient) {
        mongoclient.collection("admins", function (err, collection) {
            collection.deleteOne({ _id: ObjectID(data._id) });

            collection.find().toArray(function (err, result) {
                res.render("admin/listaAdmin", { data: result });
            });
        });
        mongoclient.close();
    });
}*/

module.exports = () => {
    return AdminDAO;
}