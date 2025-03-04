// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Administrador');
  const [jsonData, setJsonData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchExcelData = () => {
      fetch('http://localhost:5000/get-excel', { // Asegúrate de que apunte al backend
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
        .then(response => {
          const contentType = response.headers.get('Content-Type');
          console.log('Tipo de contenido recibido:', contentType); 

          if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            return response.arrayBuffer(); 
          } else {
            throw new Error('El archivo no es un archivo Excel válido');
          }
        })
        .then(arrayBuffer => {
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const userMap = new Map();
          jsonData.forEach(entry => {
            userMap.set(entry.username, entry);
          });


          setJsonData(userMap);
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          setError('Error al cargar el archivo Excel');
        });
    };

    fetchExcelData();
  }, []);


  const handleLogin = (e) => {

    e.preventDefault();
    const user = jsonData.get(username);

    if (!user) {
      setError('Usuario ,contraseña o rol son incorrectos');
      navigate('/');
      return;
    }

    if (user && String(user?.password).trim() === String(password).trim() && user.role === role) {
      setError('');
      navigate('/home', { state: { user } });
      console.log('success' , user);
    } else {
      navigate('/');
      setError('Usuario ,contraseña o rol son incorrectos');
      console.log('Usuario ,contraseña o rol son incorrectos');
    }



  }

  return (
    <>
      <div className="w-70">
        <h2>Inicia Sesion</h2>
        <div className="mb-3">
          <form >
            {error && <p className="alert alert-danger"> {error}</p>}
            <label className="form-label">Username</label>
            <input type="text" className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="form-label w-50">Password</label>
            <input type="password" className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select name="role" className="form-select mt-4 mb-4" onChange={(e) => setRole(e.target.value)}>
              <option value="Administrador">Administrador</option>
              <option value="Trabajador">Trabajador</option>
            </select>

            <button onClick={handleLogin}>Iniciar Sesion</button>
          </form>
        </div>

      </div >

    </>
  );
};

export default Login;