import React from 'react'
import Menu from '../Navbar/Navbar'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useState } from 'react';
import axios from 'axios';


const Atividade = (props) => {
    const exercicios = (props.location.state && props.location.state.exercicios) || [];

    const [lastPerformances,setLastPerformances] = useState([]);

    const handleRegistrarAtividade = async (idTreino) => {
        const selectedTreino = localStorage.getItem('selectedTreino');
        //Resgatar a última execução do exercício
        const performances = [];
        
        exercicios.forEach(async (exercicio) => {
          try {
            const resultadoAtividade = await axios.get(`http://localhost:3001/treino/${idTreino}/exercicio/${exercicio.id_exercicio}`);
            performances.push(resultadoAtividade.data);
    
          } catch (error) {
            console.error(`Erro ao obter último desempenho do exercício ${exercicio.id}:`, error);
          }
        });
    
        setLastPerformances(performances);
        lastPerformances.forEach((item) =>{
          console.log(item.nome_exercicio);
    
        });
        //------------------------------------------------   
    
    
      }


      return (
        <div>
          <h2>Componente Atividade</h2>
          <ul>
            {exercicios.map((exercicio) => (
              <li key={exercicio.id}>
                <p>{exercicio.nome}</p>
              </li>
            ))}
          </ul>
        </div>
      );

};

export default Atividade;

