const express = require('express');
const app = express();
const port = 3010;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

const users = [];  // Lista de usuarios

// Obtener todos los usuarios
app.get('/user', (req, res) => {
    res.json(users);
});

// Obtener un usuario por ID
app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
});

// Crear un nuevo usuario
app.post('/user', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length + 1; // Asigna un ID único
    users.push(newUser);
    res.status(201).json(newUser);
});

// Actualizar un usuario por ID
app.put('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
        users[index] = { ...users[index], ...req.body }; // Actualiza el usuario
        return res.json(users[index]);
    } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// Eliminar un usuario por ID
app.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        return res.json(deletedUser[0]);
    } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
