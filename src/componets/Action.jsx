// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { useNavigate , useLocation} from 'react-router-dom';
import Search from './Search'
import FormUser from './FormUser'
import DeleteUser from './DeleteUser'

export const Action = () => {
  const [action, setAction] = useState('');
    const location = useLocation();
    const user = location.state?.user;
  const navigate = useNavigate();

  const handleAction = (action) => {
    setAction(action);
  }

  const handleLogout = () => {
    localStorage.removeItem('storeResults'); 
    navigate('/login');
    user()
  }

  return (
    <div>
      <div className="mb-5">
        <button onClick={handleLogout}>Log out</button>
      </div>

      <nav className="">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" onClick={() => handleAction('Buscar')}>Buscar</a>
          </li>
          <li className="nav-item ">
            <a className="nav-link active" aria-current="page" onClick={() => handleAction('Agregar')}>Agregar</a>
          </li>
          <li className="nav-item ">
            <a className="nav-link active" aria-current="page" onClick={() => handleAction('Eliminar')}>Eliminar</a>
          </li>
        </ul>

      </nav >

      <div>
        {action === 'Buscar' && <Search />}
        {action === 'Agregar' && <FormUser />}
        {action === 'Eliminar' && <DeleteUser />}
      </div>


    </div >
  )
}


export default Action