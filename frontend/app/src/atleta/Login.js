import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Style.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  //Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', formData);
      if (response.data.userId && response.data.userId !== -1) {
        toast.success('Login efetuado com sucesso!', { position: 'top-right', autoClose: 1000 });
        navigate('/home');
        localStorage.setItem('atletaId', response.data.userId);
        const id = localStorage.getItem('atletaId');
        console.log("Id do login: "+id);
      } else {
        toast.error(response.data.msg || 'Erro desconhecido', { position: 'top-right', autoClose: 1000 });
        navigate('/login');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor!' + error, { position: 'top-right', autoClose: 1000 });
    }

  };

  //Criar conta
  const handleCreateAccount = () => {
    navigate('/registrar_atleta');
  };



  return (

    <div className="container">
      <div className="box text-center">
        <img
          src={process.env.PUBLIC_URL + '/logo.webp'}
          alt="Imagem do cabeçalho"
          className="login-icon"
        />
        <h2>Discipulus Fit</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input autoFocus required type="text" placeholder="Digite seu email" name="email" value={formData.email}
                  onChange={handleChange} />
          </div>
          <div className="input-container">
            <input required type="password" placeholder="Digite sua senha" name="senha"value={formData.senha}
                  onChange={handleChange} />
          </div>
          <button className="login-button" type="submit">Entrar</button>
          <div className="divider">
            <span className="divider-text">ou</span>
          </div>
          <button className="create-account-button" onClick={handleCreateAccount}>Criar conta</button>
        </form>
      </div>
    </div>

  );
}

export default Login;
