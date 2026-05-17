const fs = require("fs").promises;
const bcrypt = require("bcrypt");

async function cargarConstraseña() {
  try {
    const contraseña = await fs.readFile(
      "./contraseña-text-plano.txt",
      "utf-8",
    );
    console.log("constraseña cargada correctamente");
    return contraseña.trim();
  } catch (error) {
    console.error("la contraseña no se ha podido cargar");
  }
}

async function encryptContraseña(contraseña) {
  try {
    const contraseñaCifrada = await bcrypt.hash(contraseña, 10);
    console.log(contraseñaCifrada);
    return contraseñaCifrada;
  } catch (error) {
    console.error("no se ha podido cifrar la contraseña");
  }
}

async function compararContraseñas(contraseña, contraseñaCifrada) {
  const comparar = await bcrypt.compare(contraseña, contraseñaCifrada);
  if (comparar == true) {
    console.log("la contraseña se ha comparado y esta bien cifrada");
  } else {
    console.log("la contraseña no se habia cifrado correctamente");
  }
}

async function main() {
  const contraseña = await cargarConstraseña();
  const contraseñaEncrypt = await encryptContraseña(contraseña);
  compararContraseñas(contraseña, contraseñaEncrypt);
}

main();
