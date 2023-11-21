import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Login from './atleta/Login';
import HomePage from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import RegistrarAtleta from './atleta/RegistrarAtleta';
import AtualizarAtleta from './atleta/AtualizarAtleta';
import Exercicio from './exercicio/Exercicio';
import ViewTreinos from './treino/ViewTreinos';
import AddTreino from './treino/AddTreino';
import Progresso from './progresso/Progresso';
import Atividade from './atividade/Atividade';


function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/exercicios" element={<Exercicio />} />
        <Route path="/atleta/me" element={<AtualizarAtleta />} />
        <Route path="/registrar_atleta" element={<RegistrarAtleta />} />
        <Route path="/treinos" element={<ViewTreinos />} />
        <Route path="/treino/criar" element={<AddTreino />} />
        <Route path="/atividade" element={<Atividade />} />
        <Route path="/progresso" element={<Progresso />} />
        <Route index element={<Navigate to="/login" />} />
      </Routes>    
      </BrowserRouter>
      <ToastContainer />
      </>
  );
}

export default App;
