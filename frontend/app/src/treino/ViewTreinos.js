import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ViewTreinos.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Menu from '../Navbar/Navbar';

export default function ViewTreinos() {
  const [treinos, setTreinos] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [dataDoDia, setDataDoDia] = useState('');
  const [modalSubTitle, setModalSubTitle] = useState('');
  const [labelUltimaExecucao, setLabelUltimaExecucao] = useState('');
  const [segundoModalShow, setSegundoModalShow] = useState(false);

  const agora = new Date();
  const dataExecucao = format(agora, 'yyyy-MM-dd');
  const horaExecucao = format(agora, 'HH:mm:ss');

  const [atividadeData, setAtividadeData] = useState({
    serie: 0,
    repeticao: 0,
    carga: 0,
  });

  const navigate = useNavigate();
  const idAtleta = localStorage.getItem('atletaId');

  useEffect(() => {
    fetchTreinos();
  }, [idAtleta]);

  //Carrega a lista de treinos associados a um atleta logado
  const fetchTreinos = async () => {
    const result = await axios.get(`http://localhost:3001/treino/atleta/${idAtleta}`);
    setTreinos(result.data);
  };


  //Carrega a lista de exercícios associados a um treino
  const fetchExerciciosByTreino = async (idTreino) => {
    localStorage.setItem('selectedTreino', idTreino);

    try {
      const result = await axios.get(`http://localhost:3001/exercicios/treino/${idTreino}`);
      setExercicios(result.data);
      const agora = new Date();
      const agoraFormat = format(agora, 'dd-MM-yyy HH:mm');
      setModalTitle(treinos.find((treino) => treino.id === idTreino).nome);
      setDataDoDia(agoraFormat);

      setModalShow(true);
    } catch (error) {
      console.error('Erro ao obter exercícios do treino:', error);
    }
  };


  const handleAdd = () => {
    navigate('/treino/criar');
  };

  //Apaga um treino e todos seus registros associados
  const removeTreino = async (id, nome) => {
    const confirmDelete = window.confirm(`Tem certeza de que deseja excluir o treino ${nome}? Todo o registro histórico será removido!`);

    if (confirmDelete) {
      await axios.delete(`http://localhost:3001/treino/remove/${id}`);
      toast.success('Treino removido com sucesso!', { position: 'top-right', autoClose: 1000 });
      fetchTreinos();
    }
  }

  //Registra atividade para um exercício escolhido do treino selecionado
  const handleRegistrarAtividade = async (idExercicio, nomeExercicio) => {
    const idTreino = localStorage.getItem('selectedTreino');
    localStorage.setItem('selectedExercicio', idExercicio);

    try {
      const buscaAtividade = await axios.get(`http://localhost:3001/treino/${idTreino}/exercicio/${idExercicio}/verifica_atividade/${dataExecucao}`);
      if (buscaAtividade.data.length > 0) {
        toast.error('Você já registrou atividade para este exercício na data de hoje!', { position: 'top-right', autoClose: 1000 });
      } else {
        const buscaUltimaExecucao = await axios.get(`http://localhost:3001/treino/${idTreino}/exercicio/${idExercicio}`);
        if (buscaUltimaExecucao.data.length > 0) {
          const ultimaSerie = buscaUltimaExecucao.data[0].serie;
          const ultimaRepeticao = buscaUltimaExecucao.data[0].repeticao;
          const ultimaCarga = buscaUltimaExecucao.data[0].carga;
          setLabelUltimaExecucao(`Último registro para ${nomeExercicio}: ${ultimaSerie}x${ultimaRepeticao} - ${ultimaCarga}Kg`);
          setModalSubTitle(nomeExercicio);
        } else {
          setModalSubTitle(nomeExercicio + " - primeiro registro!");
          setLabelUltimaExecucao('');
        }

        setAtividadeData({
          serie: 0,
          repeticoes: 0,
          carga: 0,
        });

        setSegundoModalShow(true);

      }

    } catch (error) {
      console.log(error);
    }


  }

  //Rgistrar uma atividade
  const handleSalvarAtividade = () => {
    const idTreino = localStorage.getItem('selectedTreino');
    const idExercicio = localStorage.getItem('selectedExercicio');
    const serie = atividadeData.serie;
    const repeticao = atividadeData.repeticao;
    const carga = atividadeData.carga;


    axios.post(`http://localhost:3001/treino/${idTreino}/exercicio/${idExercicio}`, {
      serie: serie,
      repeticao: repeticao,
      carga: carga,
      dataExecucao: dataExecucao,
      horaExecucao: horaExecucao
    })
      .then(response => {
        setSegundoModalShow(false);
        toast.success('Atividade registrada com sucesso!', { position: 'top-right', autoClose: 1000 });
      })
      .catch(error => {
        console.error('Erro ao salvar atividade:', error);
      });

  };

  return (
    <>
      <Menu />
      <div className="d-flex mb-3">
        <Button variant="success" onClick={handleAdd}>
          Adicionar Novo Treino
        </Button>
      </div>

      <div className="row">
        {treinos.map((treino) => (
          <div className="col-md-4" key={treino.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="card-title">{treino.nome}</h2>
                <p className="card-text">Início: {format(new Date(treino.data_inicio), 'dd/MM/yyyy')}</p>
                <p className="card-text">Finaliza em: {format(new Date(treino.data_fim), 'dd/MM/yyyy')}</p>
                <button
                  className="btn btn-tgl"
                  onClick={() => fetchExerciciosByTreino(treino.id)}
                >
                  +
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => removeTreino(treino.id, treino.nome)}
                >Remover</button>

              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'blue' }}>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="2" className='text-center' style={{ color: 'blue' }}>Registrar atividade em {dataDoDia}</td>
              </tr>
              {exercicios.map((exercicio) => (
                <tr key={exercicio.id}>
                  <td>{exercicio.nome}</td>
                  <td>
                    <button
                      type="button"
                      className='btn btn-success btn-sm'
                      onClick={() => handleRegistrarAtividade(exercicio.id_exercicio, exercicio.nome)}
                    >
                      Registrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </Modal.Body>
      </Modal>


      {/* Segundo Modal para Registrar Atividade */}
      <Modal show={segundoModalShow} onHide={() => setSegundoModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'blue' }}>{modalSubTitle}</Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <form>
            <p className='text-center' style={{ color: 'green' }}>{labelUltimaExecucao}</p>
            <div className="mb-3">
              <label htmlFor="serie" className="form-label">Série:</label>
              <input
                required
                type="number"
                className="form-control"
                id="serie"
                value={atividadeData.serie}
                autoFocus
                onChange={(e) => setAtividadeData({ ...atividadeData, serie: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="repeticoes" className="form-label">Repetições:</label>
              <input
                required
                type="number"
                className="form-control"
                id="repeticoes"
                value={atividadeData.repeticao}
                onChange={(e) => setAtividadeData({ ...atividadeData, repeticao: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="carga" className="form-label">Carga (Kg):</label>
              <input
                required
                type="number"
                className="form-control"
                id="carga"
                value={atividadeData.carga}
                onChange={(e) => setAtividadeData({ ...atividadeData, carga: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSegundoModalShow(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSalvarAtividade}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}