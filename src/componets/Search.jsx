/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const Search = () => {
    const [matricula, setMatricula] = useState('');
    const [jsonData, setJsonData] = useState(new Map());
    const [error, setError] = useState('');
    const [storeResults, setStoreResults] = useState([]);

    // 🔄 Cargar datos desde localStorage al montar el componente
    useEffect(() => {
        const storedData = localStorage.getItem('storeResults');
        if (storedData) {
            try {
                setStoreResults(JSON.parse(storedData) || []);
            } catch (error) {
                console.error("Error al leer localStorage:", error);
                setStoreResults([]); // Evita que se rompa si hay datos corruptos
            }
        }
    }, []);
    

    useEffect(() => {
        const fetchExcelData = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-search');
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const userMap = new Map();
                jsonData.forEach(entry => {
                    userMap.set(entry.Matricula, entry);
                });

                setJsonData(userMap);
            } catch (error) {
                setError('Error al cargar el archivo Excel');
            }
        };

        fetchExcelData();
    }, []);

    // 🔄 Guardar datos en localStorage cuando storeResults cambie
    useEffect(() => {
        localStorage.setItem('storeResults', JSON.stringify(storeResults));
    }, [storeResults]);

    const handleSearch = (e) => {
        e.preventDefault();
        const matriculaNumber = Number(matricula);

        if (isNaN(matriculaNumber)) {
            setError('Por favor ingresa una matrícula válida');
            return;
        }

        const userSearch = jsonData.get(matriculaNumber);

        if (userSearch) {
            const exists = storeResults.some(item => Number(item.Matricula) === Number(userSearch.Matricula));

            if (!exists) {
                const updatedResults = [...storeResults, userSearch];
                setStoreResults(updatedResults);
                localStorage.setItem('storeResults', JSON.stringify(updatedResults)); // Guardar inmediatamente
            } else {
                setError('La matrícula ya fue buscada');
            }
        } else {
            setError('No se encontró la matrícula');
        }
    };

    const handleClean = () => {
        setMatricula('');
        setError('');
        setStoreResults([]);
        localStorage.removeItem('storeResults'); // 🧹 Limpiar también en localStorage
    };

    return (
        <div>
            <form className="row g-3 mb-4 justify-content-center mt-5">
                <h2>Buscar alumno por matrícula</h2>
                <div className="col-auto">
                    <input type="number" placeholder="Buscador" className="form-control" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                </div>
                <div className="col-auto">
                    <button type="submit" className="form-control" onClick={handleSearch}>Buscar</button>
                </div>
            </form>

            <div className="col-auto">
                {error && <p className="alert alert-danger">{error}</p>}
            </div>

            <div>
                <button type="submit" className="form-control" onClick={handleClean}>Limpiar</button>
            </div>

            <div className="table-responsive">
                <table className="table table-primary">
                    <thead>
                        <tr>
                            <th scope="col">Matrícula</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Grupo</th>
                            <th scope="col">Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {storeResults.map((result, index) => (
                            <tr key={index}>
                                <td>{result.Matricula}</td>
                                <td>{result.Nombre}</td>
                                <td>{result.Grupo}</td>
                                <td>{result.Promedio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Search;
