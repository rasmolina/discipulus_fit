import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Menu from '../Navbar/Navbar';

const Exercicio = () => {
  const [exercicios, setExercicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoExercicio, setNovoExercicio] = useState({ id: null, nome: '', categoria: '' });


  useEffect(() => {
    fetchExercicios();
  }, []);

  const fetchExercicios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/exercicios');
      setExercicios(response.data);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/exercicio/${id}`);
      setNovoExercicio({
        id: response.data[0].id,
        nome: response.data[0].nome,
        categoria: response.data[0].categoria,
      });

      setShowModal(true);
    } catch (error) {
      console.error('Erro ao obter detalhes do exercício para edição:', error);
    }


  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Tem certeza de que deseja excluir este exercício?');

    if (confirmDelete) {
      try {
        const result = await axios.delete(`http://localhost:3001/exercicio/${id}`);
        if (result.data.resultQuery !== -1) {
          toast.success('Exercício removido com sucesso!', { position: 'top-right', autoClose: 2000 });
          fetchExercicios();
        } else {
          toast.error(result.data.msg || 'Erro desconhecido', { position: 'top-right', autoClose: 2000 });
        }
      } catch (error) {
        console.error('Erro ao excluir exercício:', error);
      }
    }
  };


  const handleAdd = () => {
    setNovoExercicio({ nome: '', categoria: '' });
    novoExercicio.id = null;
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setNovoExercicio([]);
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      if (novoExercicio.id != null) {
        // Se o novoExercicio já possui um ID, é uma edição (método PUT)
        const resultEdit = await axios.put(`http://localhost:3001/exercicio/${novoExercicio.id}`, novoExercicio);
        if (resultEdit.data.resultQuery !== -1) {
          setNovoExercicio([]);
          setShowModal(false);
          toast.success('Exercício atualizado com sucesso!', { position: 'top-right', autoClose: 1000 });
          fetchExercicios();
        } else {
          toast.error(resultEdit.data.msg || 'Erro desconhecido', { position: 'top-right', autoClose: 1000 });
          fetchExercicios();
        }

      } else {
        // Se não possui um ID, é uma criação (método POST)
        const resultExe = await axios.post('http://localhost:3001/exercicio/save', novoExercicio);
        if (resultExe.data.resultQuery !== -1) {
          setShowModal(false);
          toast.success('Exercício cadastrado com sucesso!', { position: 'top-right', autoClose: 2000 });
          fetchExercicios();
        } else {
          toast.error(resultExe.data.msg || 'Erro desconhecido', { position: 'top-right', autoClose: 1000 });
          fetchExercicios();
        }

      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('Exercício já existente!', { position: 'top-right', autoClose: 1000 });
      } else {
        console.error('Erro ao salvar/atualizar exercício:', error);
      }
    }
  };

  return (
    <>
      <Menu />
      <div >
        <div className="d-flex mb-3">
          <Button variant="success" onClick={handleAdd}>
            Adicionar Novo Exercício
          </Button>
        </div>

        {exercicios.length > 0 ? (
          <div className="table-responsive">
            <Table striped bordered hover size="sm" className="text-center">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {exercicios.map((exercicio) => (
                  <tr key={exercicio.id}>
                    <td className="align-middle text-nowrap">{exercicio.nome}</td>
                    <td className="align-middle text-nowrap">{exercicio.categoria}</td>
                    <td className="align-middle">
                      <Button variant="secondary" className='btn-sm' onClick={() => handleEdit(exercicio.id)}>
                        Editar
                      </Button>{' '}
                      <Button variant="danger" className='btn-sm' onClick={() => handleDelete(exercicio.id)}>
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          console.log("nenhum exercício cadastrado!")
        )}


        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{novoExercicio.id ? 'Atualizar Exercício' : 'Adicionar Novo Exercício'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNome">
                <Form.Label>Nome do Exercício</Form.Label>
                <Form.Control
                  autoFocus
                  type="text"
                  required
                  placeholder="Digite o nome do exercício"
                  value={novoExercicio.nome}
                  onChange={(e) => setNovoExercicio({ ...novoExercicio, nome: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formCategoria">
                <Form.Label>Categoria do Exercício</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Digite a categoria do exercício"
                  value={novoExercicio.categoria}
                  onChange={(e) => setNovoExercicio({ ...novoExercicio, categoria: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Fechar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );

};

export default Exercicio;
