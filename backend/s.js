const bcrypt = require("bcrypt");

async function generate() {
    const hash = await bcrypt.hash("adminpassword", 10);
    console.log(hash);
}

generate();
