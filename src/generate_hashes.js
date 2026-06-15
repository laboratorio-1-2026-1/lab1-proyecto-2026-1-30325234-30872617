const bcrypt = require('bcryptjs');

(async () => {
  const users = [
    { email: 'admin@gimnasio.com', role: 1, pwd: 'AdminPass123!' },
    { email: 'carlos.ruiz@gimnasio.com', role: 2, pwd: 'Entrenador1!' },
    { email: 'laura.vega@gimnasio.com', role: 2, pwd: 'Entrenador2!' },
    { email: 'juan.perez@gmail.com', role: 3, pwd: 'Cliente1!' },
    { email: 'maria.lopez@gmail.com', role: 3, pwd: 'Cliente2!' },
    { email: 'pedro.gomez@gmail.com', role: 3, pwd: 'Cliente3!' },
    { email: 'ana.torres@gmail.com', role: 3, pwd: 'Cliente4!' },
    { email: 'fernando@gmail.com', role: 3, pwd: '19052003' }
  ];

  console.log('INSERT INTO Usuario (password_hash, email, id_rol, activo) VALUES');
  for (let i = 0; i < users.length; i++) {
    const h = await bcrypt.hash(users[i].pwd, 10);
    const comma = (i === users.length - 1) ? ';' : ',';
    console.log(`('${h.replace(/'/g, "''")}', '${users[i].email}', ${users[i].role}, TRUE)${comma}`);
  }
})();

//ESTE ARCHIVO SOLO AYUDA A GENERAR LAS CONTRAASENAS A LOS USUARIOS DE PRUEBACLS
