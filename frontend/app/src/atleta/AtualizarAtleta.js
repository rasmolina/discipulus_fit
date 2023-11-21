import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../Navbar/Navbar';


function AtualizarAtleta() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');


  const id = localStorage.getItem('atletaId');
  const navigate = useNavigate();

  useEffect(() => {

    axios.get(`http://localhost:3001/atleta/${id}`)
      .then((response) => {
        setNome(response.data[0].nome);
        setEmail(response.data[0].email);
        setSenha(response.data[0].senha);
        setIdade(response.data[0].idade);
        setPeso(response.data[0].peso);
        setAltura(response.data[0].altura);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados do atleta:', error);
      });
  }, [id]);

  const handleCancel = () => {
    navigate('/home');
  };

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

      const response = await axios.put(`http://localhost:3001/atleta/${id}`, dadosAtleta);

      if (response.data.resultQuery !== -1) {
        toast.success('Dados atualizados com sucesso!', { position: 'top-right', autoClose: 2000 });
        navigate('/home');
      } else {
        toast.error(response.data.msg || 'Erro desconhecido', { position: 'top-right', autoClose: 1000 });
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor!', error);
      toast.error('Erro ao conectar com o servidor!', { position: 'top-right', autoClose: 1000 });
    }
  };


  return (
    <>
      <Menu />
      <div className="container">
        <div className="row">
          <div className="box" >
            <h2>Atualize seus dados!</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="text-start">Nome</label>
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
                  type="text"
                  className="form-control"
                  placeholder="Digite um email válido"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  required
                />
              </div>


              <div className="mb-3">
                <label>Confirme sua senha ou escolha outra</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirme sua senha ou escolha uma nova"
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
                <button className="btn btn-primary align-items-center" type="submit">
                  Atualizar dados
                </button>
                <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                  Atualizar depois
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AtualizarAtleta;
