import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from '../Navbar/Navbar';

function HomePage() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState('');

  const id = localStorage.getItem('atletaId');

  useEffect(() => {
    fetchAtletaPorId();
  },);

  const fetchAtletaPorId = () => {
    axios.get(`http://localhost:3001/atleta/${id}`)
      .then((response) => {
        setNome(response.data[0].nome);
        setIdade(response.data[0].idade);
        setPeso(response.data[0].peso);
        setAltura(response.data[0].altura);
        const imcCalculado = (peso / (altura * altura)* 10000).toFixed(1);
        setImc(imcCalculado);
      })

      .catch((error) => {
        console.error('Erro ao buscar os dados do atleta:', error);
      });
  };


  return (
    <>
      <Menu />
      {nome !== null && (
        <div className='container text-center'>
          <div className='box'>
            <h4 style={{ color: 'blue' }}>Seja bem vindo <br></br>{nome}!</h4>
            <p>Idade atual: {idade} anos</p>
            <p>Peso atual: {peso} Kg</p>
            <p>Altura atual: {altura} cm</p>
            <p>Imc atual: {imc}</p>
          </div>
        </div>
      )}
    </>
  )

}

export default HomePage;