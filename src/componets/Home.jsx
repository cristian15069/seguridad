/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

const Home = () => {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
    user()
  }

  const handleRedirect = () => {
    navigate('/action ');
  }


  return (
    <>
      <div className='d-flex flex-column '>
        {
          user ? (
            <div className="justify-content-center" >
              <h2>Bienvenido </h2> {user.role === 'Administrador' ? <p>tu rol es {user.role}</p> : <p> no eres administrador tu rol es {user.role}</p>}

              <div>
                <button onClick={handleRedirect}>Siguiente</button>
              </div>
              <div>
                <button onClick={handleLogout}>Log out</button>
              </div>
            </div>
          ) : (
            <div className="alert alert-primary" >
              {user.matricula}
            </div>)
        }




        {/* <div className='justify-content-center'>
          <figure className="figure w-25 p-4 ">
            <img src="/src/assets/img/logo_utn.jpg" className="figure-img img-fluid rounded" alt="..." />
          </figure>
        </div> */}



      </div>
    </>

  )
}

export default Home