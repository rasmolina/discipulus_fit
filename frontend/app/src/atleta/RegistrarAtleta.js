import React, { useState } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';



function RegistrarAtleta() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const dadosAtleta = {
      nome,
      email,
      senha,
      idade,
      peso,
      altura
    };

    try {
      const response = await axios.post('http://localhost:3001/registrar_atleta', dadosAtleta);
      if (response.data.resultQuery !== -1) {
        toast.success('Atleta cadastrado com sucesso, faça login para continuar!', { position: 'top-right', autoClose: 2000 });
        navigate('/login');

      } else {
        toast.error(response.data.msg || 'Erro desconhecido', { position: 'top-right', autoClose: 1000 });

      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor!' + error, { position: 'top-right', autoClose: 1000 });
    }
  };

  const handleCancel = async (e) => {
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="row">
        <div className="box">
          <h2>Crie sua conta!</h2>
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Nome</label>
              <input
                autoFocus
                type="text"
                className="form-control"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                name="nome"
                required
              />
            </div>


            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
              />
            </div>
            <div className="mb-3">
              <label>Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="Escolha uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                name="senha"
                required
              />
            </div>

            <div className="mb-3">
              <label>Idade</label>
              <input
                type="number"
                className="form-control"
                placeholder="Idade"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                name="idade"
                required
              />
            </div>
            <div className="mb-3">
              <label>Peso</label>
              <input
                type="number"
                className="form-control"
                placeholder="Peso (kg)"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                name="peso"
                required
              />
            </div>
            <div className="mb-3">
              <label>Altura</label>
              <input
                type="number"
                className="form-control"
                placeholder="Altura (cm)"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                name="altura"
                required
              />
            </div>
            <div className='text-center'>
              <button className="btn btn-primary" type="submit">
                Criar Conta
              </button>
              <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrarAtleta;
