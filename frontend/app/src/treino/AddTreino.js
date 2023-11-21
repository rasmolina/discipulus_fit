import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Menu from '../Navbar/Navbar';


function AddTreino() {
  const [nomeTreino, setNomeTreino] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);

  const idAtleta = localStorage.getItem('atletaId');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/exercicios')
      .then(response => {
        setExerciciosDisponiveis(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar exercícios:', error);
      });
  }, []);

  const adicionarExercicio = (exercicio) => {
    if (!exercicios.find((item) => item.id === exercicio.id)) {
      setExercicios([...exercicios, exercicio]);
    }
  };

  const removerExercicio = (exercicio) => {
    const novaLista = exercicios.filter((item) => item.id !== exercicio.id);
    setExercicios(novaLista);
  };

  const handleSalvar = () => {
    if (dataInicio > dataFim) {
      toast.warning('A data final não pode ser anterior à data de início!', { position: 'top-right', autoClose: 1000 });
      return;
    }

    if (exercicios.length === 0) {
      toast.warning('Adicione ao menos um exercício no treino!', { position: 'top-right', autoClose: 1000 });
      return;
    }


    const exerciciosParaSalvar = exercicios.map((exercicio) => {
      return {
        id: exercicio.id,
        nome: exercicio.nome,
        categoria: exercicio.categoria,
      };
    });

    const treinoData = {
      nome: nomeTreino,
      dataInicio,
      dataFim,
    };

    //Crio o treino  /*

    axios.post(`http://localhost:3001/treino/save/${idAtleta}`, treinoData)
      .then(response => {
        const lastTreinoId = response.data.lastTreinoId;

        //Adiciono os exercícios no treino criado
        exerciciosParaSalvar.forEach((exercicio) => {
          const idExercicio = exercicio.id;
          console.log(idExercicio);
          axios.post(`http://localhost:3001/treino/id/${lastTreinoId}`, { idExercicio });
        });

        toast.success('Treino salvo com sucesso!', { position: 'top-right', autoClose: 1000 });
        navigate('/treinos');
      })
      .catch(error => {
        console.error('Erro ao salvar treino:', error);
      });
  };

  const handleCancelar = () => {
    navigate('/treinos');
  }

  return (
    <>
      <Menu />
      <div className="container ">
        <div className='box'>
          <h2 className="mb-4">Monte seu treino!</h2>
          <form>
            <div className="mb-3">
              <label className="form-label">Nome do Treino:</label>
              <input autoFocus type="text" className="form-control" value={nomeTreino} onChange={(e) => setNomeTreino(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Data de Início:</label>
              <input required type="datetime-local" className="form-control" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Data de Fim:</label>
              <input required type="datetime-local" className="form-control" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Exercícios Disponíveis:</label>
              <select className="form-select" onChange={(e) => adicionarExercicio(JSON.parse(e.target.value))}>
                <option value="">Selecione um exercício</option>
                {exerciciosDisponiveis.map((exercicio) => (
                  <option key={exercicio.id} value={JSON.stringify(exercicio)}>
                    {exercicio.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className='text-center'>
            <button type="button" className="btn btn-primary" onClick={handleSalvar}>Salvar</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
            </div>
          </form>
          <div className="mt-4">
            <h5 className='h5 text-center'>~ exercícios selecionados ~</h5>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {exercicios.map((exercicio) => (
                  <tr key={exercicio.id}>
                    <td className='text-center'>{exercicio.nome}</td>
                    <td>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removerExercicio(exercicio)}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTreino;
