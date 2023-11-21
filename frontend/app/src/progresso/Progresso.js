import Menu from '../Navbar/Navbar'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

export default function Progresso() {
  const idAtleta = localStorage.getItem('atletaId');
  const [treinos, setTreinos] = useState([]);
  const [selectedTreino, setSelectedTreino] = useState('');
  const [exercicios, setExercicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExercicio, setSelectedExercicio] = useState(null);
  const [progressoData, setProgressoData] = useState([]);


  useEffect(() => {
    fetchTreinos();

  }, [treinos]);



  //Carrega a lista de treinos associados a um atleta logado
  const fetchTreinos = async () => {
    try {
      const result = await axios.get(`http://localhost:3001/treino/atleta/${idAtleta}`);
      setTreinos(result.data);

    } catch (error) {
      console.error('Erro ao obter treinos:', error);
    }
  };

  //Carrega a lista de exercícios associados a um treino
  const fetchExerciciosByTreino = async (idTreino) => {
    try {
      const result = await axios.get(`http://localhost:3001/exercicios/treino/${idTreino}`);
      setExercicios(result.data);
    } catch (error) {
      console.error('Erro ao obter exercícios do treino:', error);
    }
  };

  const handleTreinoChange = (event) => {
    const treinoId = event.target.value;
    setSelectedTreino(treinoId);
    fetchExerciciosByTreino(treinoId);
  };

  const handleVisualizarProgresso = async (idExercicio) => {
    try {
      const result = await axios.get(`http://localhost:3001/treino/${selectedTreino}/exercicio/${idExercicio}`);
      setProgressoData(result.data);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao obter progresso do exercício:', error);
    }
  };

  return (
    <>
      <Menu />
      <Form>
        <Form.Group controlId="selectTreino">

          <Form.Control as="select" onChange={handleTreinoChange} value={selectedTreino}>
            <option value="">Selecione um treino</option>
            {treinos.map((treino) => (
              <option key={treino.id} value={treino.id}>
                {treino.nome}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>

      <Table striped bordered hover size="sm">
        <thead>
          <tr className='text-center'>
            <th>Exercício</th>
            <th>Progresso</th>
          </tr>
        </thead>
        <tbody>
          {exercicios.map((exercicio) => (
            <tr key={exercicio.id} className='text-center'>
              <td>{exercicio.nome}</td>
              <td>
                <Button variant="primary btn-sm" onClick={() => handleVisualizarProgresso(exercicio.id_exercicio)}>
                  Visualizar meu progresso
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'blue' }}>
            {progressoData && progressoData.length > 0 ? `Progresso: ${progressoData[0].nome_exercicio}` : 'Sem dados de progresso'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {progressoData.length > 0 ? (
            <Table striped hover size="sm">
              <thead>
                <tr className='text-center'>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Série</th>
                  <th>Repetição</th>
                  <th>Carga</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {progressoData.map((progresso) => (
                  <tr key={progresso.id}>
                    <td>{format(new Date(progresso.data_execucao), 'dd/MM/yyyy')}</td>
                    <td>{progresso.hora_execucao}</td>
                    <td>{progresso.serie}</td>
                    <td>{progresso.repeticao}</td>
                    <td>{progresso.carga}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Sem registro de atividade para este exercício</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}