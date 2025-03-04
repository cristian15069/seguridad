// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx';

const Search = () => {

    const [matricula, setMatricula] = useState('');
    const [jsonData, setJsonData] = useState([]);
    const [error, setError] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [storeResults, setStoreResults] = useState([]);


    useEffect(() => {
        const fetchExcelData = () => {
            fetch('http://localhost:5000/get-search', { // Asegúrate de que apunte al backend
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
                        userMap.set(entry.Matricula, entry);
                    });

                    // console.log('json', jsonData);
                    // console.log(userMap);

                    setJsonData(userMap);
                })
                // eslint-disable-next-line no-unused-vars
                .catch(error => {
                    setError('Error al cargar el archivo Excel');
                });
        };

        fetchExcelData();
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();
        const matriculaNumber = Number(matricula);

        if (isNaN(matriculaNumber)) {
            setError('Por favor ingresa una matrícula válida');
            return;
        }

        const userSearch = jsonData.get(matriculaNumber);


        if (userSearch) {

            const addJsonToArray = (userSearch) => {
                const exists = storeResults.some(item => Number(item.Matricula) === Number(userSearch.Matricula));

                console.log('exists', exists);

                if (exists) {
                    setError('La matricula ya fue buscada');
                } else {
                    setStoreResults(prevResults => [...prevResults, userSearch]);
                    setError('');
                }
            };

            setSearchResults(userSearch);
            addJsonToArray(userSearch);
        } else {
            setSearchResults(null);
            setError('No se encontro la matricula');
        }

        // console.log('storeResults', storeResults);
        // console.log('searchResults', searchResults);
        // console.log('matricula', matriculaNumber);
        // console.log('usuario encontrado', userSearch);
        // console.log('error', error);


    }

    const handleClean = (e) => {
        e.preventDefault();
        setMatricula('');
        setError('');
        setSearchResults(null);
        setStoreResults([]);
    }


    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });


    return (
        <div>
            <form className="row g-3 mb-4 justify-content-center mt-5">
                <h2>Buscar alumno por matricula</h2>
                <div className="col-auto">
                    <input type='number' placeholder='Buscador' className='form-control' value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                </div>
                <div className="col-auto">
                    <button type="submit" className="form-control" onClick={handleSearch}>Buscar</button>
                </div>
            </form>

            <div className="col-auto">
                {error && <p className="alert alert-danger">{error} </p>}
            </div>

            <div>
                <button type="submit" className='form-control' onClick={handleClean} >
                    Limpiar </button>
            </div>

            {
                searchResults ? (
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

                                {
                                    storeResults.map((searchResults, index) => (
                                        <tr key={index}>
                                            <td scope="row">{searchResults.Matricula}</td>
                                            <td scope="row">{searchResults.Nombre}</td>
                                            <td scope="row">{searchResults.Grupo}</td>
                                            <td scope="row">{searchResults.Promedio}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ) :
                    (

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

                                    {
                                        storeResults.map((searchResults, index) => (
                                            <tr key={index}>
                                                <td scope="row">{searchResults.Matricula}</td>
                                                <td scope="row">{searchResults.Nombre}</td>
                                                <td scope="row">{searchResults.Grupo}</td>
                                                <td scope="row">{searchResults.Promedio}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
            }
        </div>
    )
}

export default Search