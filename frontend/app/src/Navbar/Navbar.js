import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Menu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast.success('Logoff efetuado com sucesso!', { position: 'top-right', autoClose: 1000 });

  }

  return (

    <Navbar bg="primary" data-bs-theme="dark">
        <Navbar.Brand href="/home">
        <img
          src={process.env.PUBLIC_URL + '/logo.webp'}
          alt="Imagem do cabeçalho"
          className="login-icon"
          style={{ width: '30px', height: '30px', marginLeft: '10px'}}
        /> DiscipulusFit
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/atleta/me">Minha Conta</Nav.Link>
          <Nav.Link href="/treinos">Treinos</Nav.Link>
          <Nav.Link href="/exercicios">Exercícios</Nav.Link>
          <Nav.Link href="/progresso">Progresso</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="btn btn-sm justify-content-end" variant="success">
          <Nav.Link href="#" className="ml-10" onClick={handleLogout}>Logout</Nav.Link>
        </Navbar.Collapse>
      
    </Navbar>

  );
}