CREATE TABLE atleta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    idade INT,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    imc DECIMAL(5,2) GENERATED ALWAYS AS (peso / (altura * altura)) STORED
);
CREATE TABLE treino (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    atleta_id INT,
    FOREIGN KEY (atleta_id) REFERENCES atleta(id)
);

CREATE TABLE exercicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) unique,
    categoria VARCHAR(255)
);

CREATE TABLE exercicios_treino(
    id_treino INT,
    id_exercicio INT,
    PRIMARY KEY (id_treino,id_exercicio),
    FOREIGN KEY (id_treino) REFERENCES treino (id),
    FOREIGN KEY (id_exercicio) REFERENCES exercicio (id)
);

CREATE TABLE execucao_exercicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_exercicio_treino_id_treino INT,
    id_exercicio_treino_id_exercicio INT,
    serie INT,
    repeticao INT,
    carga FLOAT,
    progresso_carga BOOLEAN,
    progresso_serie BOOLEAN,
    data_execucao DATE,
    FOREIGN KEY (id_exercicio_treino_id_treino, id_exercicio_treino_id_exercicio)
        REFERENCES exercicios_treino (id_treino, id_exercicio)
);