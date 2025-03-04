/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

const FormUser = () => {
    const [formData, setFormData] = useState({ Matricula: "", Nombre: "", Grupo: "", Promedio: "" });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    setMessage(
                      <div className="alert alert-success">
                        {data.message}
                      </div>
                    );
                    setFormData({ Matricula: "", Nombre: "", Grupo: "", Promedio: "" });
                  } else {
                    setMessage(
                      <div className="alert alert-danger">
                        {data.message}
                      </div>
                    );
                  }
              
                console.log('Respuesta del servidor:', data);

            })
            .catch(error => console.error('Error:', error));

    };

    return (
        <div className="w-100">
            <h2 className='mt-5'>Agregar Alumno</h2>
            <div className="mb-3">
                <form action=""  className='row g-3 mb-4 justify-content-center mt-5' onSubmit={handleSubmit}>
                    {message }

                    <label className="form-label">Matricula</label>
                    <input type="number" name='Matricula' className="form-control" value={formData.Matricula} onChange={handleChange} id="" required />

                    <label className="form-label">Nombre</label>
                    <input type="text" name='Nombre' className="form-control" value={formData.Nombre} onChange={handleChange} id="" required />

                    <label className="form-label">Grupo</label>
                    <input type="text" name='Grupo' className="form-control" value={formData.Grupo} onChange={handleChange} id="" required />

                    <label className="form-label">Promedio</label>
                    <input type="text" name='Promedio' className="form-control" value={formData.Promedio} onChange={handleChange} id="" required />

                    <button type='submit'>Agregar</button>
                </form>
            </div>
        </div>
    )
}

export default FormUser