const express = require('express');
const app = express();
const port = 3010;

app.use(express.json());

// Simulación de base de datos en memoria
const libros = [];
const librosAutores = [];

// Obtener todos los libros
app.get('/libros', (req, res) => {
    res.json(libros);
});

// Obtener un libro por ID
app.get('/libros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const libro = libros.find(l => l.id === id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(libro);
});

// Crear un nuevo libro
app.post('/libros', (req, res) => {
    const { titulo, categoria, isbn, editorial, anio_publicacion, cantidad_disponible } = req.body;
    const newLibro = {
        id: libros.length + 1,
        titulo,
        categoria,
        isbn,
        editorial,
        anio_publicacion,
        cantidad_disponible
    };
    libros.push(newLibro);
    res.status(201).json(newLibro);
});

// Actualizar un libro por ID
app.put('/libros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = libros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ message: 'Libro no encontrado' });
    libros[index] = { ...libros[index], ...req.body };
    res.json(libros[index]);
});

// Eliminar un libro por ID
app.delete('/libros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = libros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ message: 'Libro no encontrado' });
    const deletedLibro = libros.splice(index, 1);
    res.json(deletedLibro[0]);
});

// Obtener todos los libros y autores relacionados
app.get('/libros-autores', (req, res) => {
    res.json(librosAutores);
});

// Agregar relación entre libro y autor
app.post('/libros-autores', (req, res) => {
    const newRelacion = req.body;
    librosAutores.push(newRelacion);
    res.status(201).json(newRelacion);
});

// Eliminar relación entre libro y autor
app.delete('/libros-autores', (req, res) => {
    const { id_libro, id_autor } = req.body;
    const index = librosAutores.findIndex(rel => rel.id_libro === id_libro && rel.id_autor === id_autor);
    if (index === -1) return res.status(404).json({ message: 'Relación no encontrada' });
    const deletedRelacion = librosAutores.splice(index, 1);
    res.json(deletedRelacion[0]);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
