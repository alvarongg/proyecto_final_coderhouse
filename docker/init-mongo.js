db.createUser(
    {
        user: "adminEC",
        pwd: "adminEC",
        roles: [
            {
                role: "readWrite",
                db: "ecommerce"
            }
        ]
    }
);
db.createCollection("mensajes");
db.createCollection("productos"); 