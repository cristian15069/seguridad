/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const DeleteUser = () => {
  const [Matricula, setMatricula] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Función para buscar usuario
  const handleSearch = async () => {
    setError("");
    setSuccess("");

    if (!Matricula.trim()) {
      setError("Ingrese una matrícula válida.");
      setUserData(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/search-user/${Matricula}`);
      const result = await response.json();

      if (response.ok) {
        setUserData(result.user); // Asegurar que accedemos al objeto user dentro del response
        setError("");
        setIsConfirming(false);
      } else {
        setError(result.error || "No se encontró la matrícula.");
        setUserData(null);
      }
    } catch (error) {
      setError("Error de conexión con el servidor.");
      setUserData(null);
    }
  };

  // Función para eliminar usuario
  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:5000/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Matricula }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || "Usuario eliminado con éxito.");
        setError("");
        setUserData(null);
        setIsConfirming(false);
      } else {
        setError(result.error || "No se pudo eliminar el usuario.");
      }
    } catch (error) {
      setError("Error de conexión con el servidor.");
    }
  };

  // Función para cancelar la eliminación
  const handleCancel = () => {
    setIsConfirming(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="row g-3 mb-4 justify-content-center mt-5">
      <h2 className="mb-3 mt-5">Buscar y Eliminar usuario por matrícula</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <input
        type="text"
        placeholder="Ingrese matrícula"
        value={Matricula}
        className="form-control mb-3"
        onChange={(e) => setMatricula(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>

      {userData && (
        <div>
          <h3>Datos del usuario encontrado:</h3>
          <p><strong>Matrícula:</strong> {userData.Matricula}</p>
          <p><strong>Nombre:</strong> {userData.Nombre}</p>
          <p><strong>Grupo:</strong> {userData.Grupo}</p>
          <p><strong>Promedio:</strong> {userData.Promedio}</p>

          {!isConfirming ? (
            <button onClick={() => setIsConfirming(true)}>Eliminar</button>
          ) : (
            <div>
              <p>¿Está seguro de eliminar este usuario?</p>
              <button onClick={handleDelete}>Confirmar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
