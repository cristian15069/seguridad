/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import cors from 'cors';
import XLSX from 'xlsx';
import bodyParser from 'body-parser';

const app = express();
const __dirname = path.resolve(); 
app.use(bodyParser.json());


app.use(cors({
  origin: 'http://localhost:5173' // o la URL de tu frontend
}));


app.get('/get-excel', (req, res) => {
  const filePath = path.join(__dirname, '/src/db/db_login.xlsx');
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      return res.status(500).send('Error al obtener el archivo Excel');
    }
  });
});

app.get('/get-search', (req, res) => {
  const filePath = path.join(__dirname, '/src/db/db_search.xlsx');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      return res.status(500).send('Error al obtener el archivo Excel');
    }
  });
});

app.get('/search-user/:Matricula', (req, res) => {
  const { Matricula } = req.params;  

  try {
      const filePath = path.join(__dirname, "/src/db/db_search.xlsx");

      // Leer el archivo Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convertir la hoja en JSON (formato de filas)
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Buscar usuario (asegurar comparación correcta)
      const user = data.find(row => String(row[0]).trim() === String(Matricula).trim());

      if (!user) {
          return res.status(404).json({ error: "Matrícula no encontrada" });
      }

      // ✅ Devolver usuario en un objeto `user`
      res.json({
          user: {
              Matricula: user[0],
              Nombre: user[1],  // ❗ Corrección: `Nombre` en mayúscula para coincidir con el frontend
              Grupo: user[2],
              Promedio: user[3]
          }
      });

  } catch (error) {
      res.status(500).json({ error: "Error al leer el archivo" });
  }
});



app.post("/agregar", (req, res) => {

  let { Matricula, Nombre, Grupo, Promedio } = req.body;

  try {
    const filePath = path.join(__dirname, "/src/db/db_search.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let data = XLSX.utils.sheet_to_json(worksheet);

    if (!Matricula || isNaN(Matricula)) {
      return res.status(400).json({
        success: false,
        message: "La matrícula es inválida o está vacía.",
      });
    }

    const matriculaNormalizada = Number(String(Matricula).trim());

    const existe = data.some((registro) => {
      return Number(String(registro.Matricula).trim()) === matriculaNormalizada;
    });

    if (existe) {
      return res.status(400).json({
        success: false,
        message: "La matrícula ya existe en el archivo Excel y no se insertará nuevamente.",
      });
    } else {
      data.push({ Matricula: matriculaNormalizada, Nombre, Grupo, Promedio });

      const newWorksheet = XLSX.utils.json_to_sheet(data);
      workbook.Sheets[sheetName] = newWorksheet;

      XLSX.writeFile(workbook, filePath);

      res.json({ success: true, message: "Registro agregado con éxito al Excel" });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: "Error al agregar datos al archivo Excel" });
  }
});

app.post('/delete-user', (req, res) => {
  const { Matricula } = req.body;

  if (!Matricula) {
      return res.status(400).json({ error: "La matrícula es requerida" });
  }

  try {
      const filePath = path.join(__dirname, "/src/db/db_search.xlsx");

      // Leer el archivo Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convertir la hoja en JSON (con encabezado incluido)
      let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length === 0) {
          return res.status(404).json({ error: "No hay datos en el archivo" });
      }

      // Separar encabezado (si hay)
      const header = data[0];  // Primera fila
      const rows = data.slice(1);  // Datos sin encabezado

      // Buscar el índice del usuario a eliminar
      const indexToDelete = rows.findIndex(row => String(row[0]).trim() === String(Matricula).trim());

      if (indexToDelete === -1) {
          return res.status(404).json({ error: "Matrícula no encontrada" });
      }

      // Eliminar el usuario sin tocar el encabezado
      rows.splice(indexToDelete, 1);

      // Reconstruir los datos con el encabezado
      const updatedData = [header, ...rows];

      // Escribir de nuevo en la hoja de Excel
      const updatedWorksheet = XLSX.utils.aoa_to_sheet(updatedData);
      workbook.Sheets[sheetName] = updatedWorksheet;
      XLSX.writeFile(workbook, filePath);

      res.json({ success: true, message: "Usuario eliminado correctamente" });

  } catch (error) {
      console.error("⚠️ Error al procesar el archivo:", error);
      res.status(500).json({ error: "Error al procesar el archivo" });
  }
});


app.listen(5000, () => {
  console.log('Servidor en http://localhost:5000');
});
