const express = require('express');
const cors = require('cors')
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'discipulusdb',
    port: 3306,
    socketPath: '/tmp/mysql.sock',
    insecureAuth: true,
});

app.use(express.json());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Welcome to DiscipulusFit!');
});

//Teste da conexão
db.getConnection((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados MySQL!');
});

//Rota para login
app.post("/login", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    db.query("SELECT * from atleta WHERE email = ? and senha = ?",
        [email, senha], (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result.length > 0) {
                const userId = result[0].id;
                console.log(userId);
                res.send({ msg: "Usuario logado com sucesso!", userId: userId });

            }
            else {
                const userId = -1;
                res.send({ msg: "Usuario e/ou senha inválidos" });
                console.log(userId);
            }
        }
    );
});

//#############################
//##### ATLETA
//#############################

//Rota para registrar um atleta
app.post("/registrar_atleta", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const idade = req.body.idade;
    const peso = req.body.peso;
    const altura = req.body.altura;

    db.query("SELECT * from atleta WHERE email = ?", [email],
        (err, resultado) => {
            if (err) {
                resultado.send(err);
            }
            if (resultado.length == 0) {
                db.query("INSERT INTO atleta (nome, email, senha, idade, peso, altura) VALUES (?,?,?,?,?,?)", [nome, email, senha, idade, peso, altura], (err, resultado) => {
                    if (err) {
                        res.send(err);
                    }
                    const resultQuery = 0;
                    res.send({ msg: "Atleta cadastrado com sucesso!", resultQuery: resultQuery });
                }
                );
            } else {
                const resultQuery = -1;
                res.send({ msg: "Email já cadastrado!", resultQuery: resultQuery });
            }
        });
});

app.listen(3001, () => {
    console.log("servidor executando na porta 3001");
});

//Rota para buscar um atleta pelo id
app.get("/atleta/:atletaId", (req, res) => {
    const atleta_id = req.params.atletaId;

    db.query('SELECT * FROM atleta WHERE id = ?',
        [atleta_id],
        (err, result) => {
            if (err) {
                console.log('Erro ao buscar alteta' + err);
                res.status(500).send('Erro ao buscar atleta');
                return;
            }

            res.json(result);
        }
    );
});

// Rota para editar a conta de um atleta
app.put("/atleta/:atletaId", async (req, res) => {
    const atleta_id = req.params.atletaId;
    const atleta_nome = req.body.nome;
    const atleta_email = req.body.email;
    const atleta_senha = req.body.senha;
    const atleta_idade = req.body.idade;
    const atleta_peso = req.body.peso;
    const atleta_altura = req.body.altura;

    db.query('SELECT * FROM atleta WHERE email = ? AND id != ?', [atleta_email, atleta_id], (err, result) => {
        if (err) {
            console.error("Erro ao localizar atleta!" + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            if (result.length > 0) {
                const resultQuery = -1;
                res.send({ msg: "Email já cadastrado!", resultQuery: resultQuery });
            } else {
                const resultQuery = 0;
                db.query('UPDATE atleta SET nome=?, email=?, senha=?, idade=?, peso=?, altura=? WHERE id = ?',
                    [atleta_nome, atleta_email, atleta_senha, atleta_idade, atleta_peso, atleta_altura, atleta_id]);

                res.send({ msg: "Atleta atualizado com sucesso!", resultQuery: resultQuery });
            }
        }
    });
});

//#############################
//##### EXERCÍCIOS
//#############################


//Rota para carregar os exercícios
app.get("/exercicios", (req, res) => {
    db.query("SELECT * from exercicio order by nome", (err, result) => {
        if (err) {
            console.error('Erro ao buscar exercícios:', err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            res.status(200).json(result);
        }
    });
});

//Rota para cadastrar exercício
app.post("/exercicio/save", async (req, res) => {
    const nome_exercicio = req.body.nome;
    const categoria_exercicio = req.body.categoria;

    db.query('SELECT * FROM exercicio WHERE nome = ?', [nome_exercicio], (err, result) => {
        if (err) {
            console.error("Erro ao localizar exercício!" + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            if (result.length > 0) {
                const resultQuery = -1;
                res.send({ msg: "Nome de exercício já cadastrado!", resultQuery: resultQuery });
            } else {
                const resultQuery = 0;
                db.query('INSERT INTO exercicio (nome, categoria) values (?,?)',
                    [nome_exercicio, categoria_exercicio]);

                res.send({ msg: "Exercício cadastrado com sucesso!", resultQuery: resultQuery });
            }
        }
    });

});

//Rota para editar exercício
app.put("/exercicio/:exercicioId", async (req, res) => {
    const exercicio_id = req.params.exercicioId;
    const exercicio_nome = req.body.nome;
    const exercicio_categoria = req.body.categoria;

    //Verifico se nome é exclusivo
    db.query('SELECT * FROM exercicio WHERE nome = ? AND id != ?', [exercicio_nome, exercicio_id], (err, result) => {
        if (err) {
            console.error("Erro ao localizar exercício!" + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            if (result.length > 0) {
                const resultQuery = -1;
                res.send({ msg: "Nome de exercício já cadastrado!", resultQuery: resultQuery });
            } else {
                //Verifico se o exercício está associado a algum treino
                db.query('SELECT * FROM exercicios_treino WHERE id_exercicio = ?', [exercicio_id], (err, result) => {
                    if (err) {
                        console.error("Erro ao localizar exercício!" + err);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                    } else {
                        if (result.length > 0) {
                            const resultQuery = -1;
                            res.send({ msg: "Exercício já associado a um treino, alteração não permitida!", resultQuery: resultQuery });
                        } else {
                            const resultQuery = 0;
                            db.query('UPDATE exercicio SET nome=?, categoria=? WHERE id = ?',
                                [exercicio_nome, exercicio_categoria, exercicio_id]);

                            res.send({ msg: "Exercício atualizado com sucesso!", resultQuery: resultQuery });
                        }
                    }
                })
            }
        }
    });
});

//Rota para buscar exercício por id
app.get("/exercicio/:exercicioId", (req, res) => {
    const exercicio_id = req.params.exercicioId;

    db.query('SELECT * FROM exercicio WHERE id = ?',
        [exercicio_id],
        (err, result) => {
            if (err) {
                console.log('Erro ao buscar exercício' + err);
                res.status(500).send('Erro ao buscar exercício');
                return;
            }
            res.json(result);
        }
    );
});

//Rota para remover exercício
app.delete("/exercicio/:exercicioId", async (req, res) => {
    const exercicio_id = req.params.exercicioId;

    //Verifico se o exercício está associado com algum treino
    db.query('SELECT * FROM exercicios_treino WHERE id_exercicio = ?', [exercicio_id], (err, result) => {
        if (err) {
            console.error("Erro ao localizar exercício!" + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            if (result.length > 0) {
                const resultQuery = -1;
                res.send({ msg: "Exercício já associado a um treino, remoção não permitida!", resultQuery: resultQuery });
            } else {
                db.query('DELETE FROM exercicio WHERE id = ?', [exercicio_id], (err, result) => {
                    if (err) {
                        console.error("Erro ao localizar exercício!" + err);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                    } else {
                        const resultQuery = 0;
                        res.send({ msg: "Exercício removido com sucesso!", resultQuery: resultQuery });
                    }
                })
            }
        }
    });
});

//#############################
//##### TREINOS
//#############################
//Rota para carregar os treinos de um atleta
app.get("/treino/atleta/:idAtleta", (req, res) => {
    const atleta_id = req.params.idAtleta;
    db.query("SELECT * from treino where atleta_id = ?", [atleta_id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar treino:', err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            res.status(200).json(result);
        }
    });
});

//Rota para cadastrar um treino para um atleta
app.post("/treino/save/:idAtleta", async (req, res) => {
    const nome_treino = req.body.nome;
    const data_inicio = req.body.dataInicio;
    const data_fim = req.body.dataFim;
    const atleta_id = req.params.idAtleta;

    db.query('INSERT INTO treino (nome, data_inicio, data_fim, atleta_id) values (?,?,?,?)', [nome_treino, data_inicio, data_fim, atleta_id], (err, result) => {
        if (err) {
            const resultQuery = -1;
            console.error("Erro ao cadastrar treino!" + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
            res.send({ msg: "Erro ao cadastrar treino!", resultQuery: resultQuery });
        } else {
            const lastTreinoId = result.insertId;
            const resultQuery = 0;
            res.send({ msg: "Treino cadastrado com sucesso!", resultQuery: resultQuery, lastTreinoId: lastTreinoId });
        }
    });
});

//Rota para inserir exercicios em um treino
app.post("/treino/id/:idTreino", async (req, res) => {
    const id_treino = req.params.idTreino;
    const id_exercicio = req.body.idExercicio;
    db.query('INSERT INTO exercicios_treino (id_treino, id_exercicio) values (?,?)', [id_treino, id_exercicio], (err, result) => {
        if (err) {
            console.error("Erro ao incluir exercicio no treino!" + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            res.send({ msg: "Exercício incluído com sucesso no treino!" });
        }
    });
});

//Rota para listar os exercícios de determinado treino
app.get('/exercicios/treino/:idTreino', (req, res) => {
    const id_treino = req.params.idTreino;
    db.query('SELECT exercicios_treino.id_treino, exercicios_treino.id_exercicio, exercicio.nome FROM exercicios_treino JOIN exercicio ON exercicios_treino.id_exercicio = exercicio.id WHERE exercicios_treino.id_treino = ?', [id_treino], (err, result) => {
        if (err) {
            console.error("Erro ao buscar exercícios do treino " + id_treino + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            res.status(200).json(result);
        }
    });
});

//Rota para remover um treino
app.delete('/treino/remove/:idTreino', async (req, res) => {
    const id_treino = req.params.idTreino;
    try {
        // Primeiro remove da tabela execucao_exercicio
        await db.query('DELETE FROM execucao_exercicio WHERE id_exercicio_treino_id_treino = ?', [id_treino]);

        // Segundo remove da tabela exercicios_treino
        await db.query('DELETE FROM exercicios_treino WHERE id_treino = ?', [id_treino]);

        // Por fim, remove o treino da tabela treino
        await db.query('DELETE FROM treino WHERE id = ?', [id_treino]);

        console.log("Treino removido com sucesso!");
        res.status(200).json({ msg: 'Remoção bem-sucedida!' });
    } catch (err) {
        console.error("Erro ao remover treino: " + id_treino + err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

//#############################
//##### ATIVIDADE
//#############################

//Rota para resgatar o histórico de atividades de um exercício de um treino (progresso do exercício)
app.get('/treino/:idTreino/exercicio/:idExercicio', async (req, res) => {
    const id_treino = req.params.idTreino;
    const id_exercicio = req.params.idExercicio;
    db.query('SELECT execucao_exercicio.*, exercicio.nome as nome_exercicio from execucao_exercicio join exercicio on execucao_exercicio.id_exercicio_treino_id_exercicio = exercicio.id where execucao_exercicio.id_exercicio_treino_id_treino = ? and execucao_exercicio.id_exercicio_treino_id_exercicio=? ORDER BY execucao_exercicio.data_execucao DESC', [id_treino, id_exercicio], (err, result) => {
        if (err) {
            console.error("Erro ao buscar atividades!" + err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            res.status(200).json(result);
        }
    });
});

//Rota para verificar se já existe atividade para o exercíio no dia
app.get('/treino/:idTreino/exercicio/:idExercicio/verifica_atividade/:dataExecucao', async (req, res) => {
    const id_treino = req.params.idTreino;
    const id_exercicio = req.params.idExercicio;
    const data_execucao = req.params.dataExecucao;
    db.query('SELECT * FROM execucao_exercicio WHERE id_exercicio_treino_id_treino = ? AND id_exercicio_treino_id_exercicio = ? AND data_execucao = ? ',
        [id_treino, id_exercicio, data_execucao], (err, result) => {
            if (err) {
                console.error("Erro ao buscar atividades!" + err);
                res.status(500).json({ error: 'Erro interno do servidor' });
            } else {
                res.status(200).json(result);
            }
            if (result.length > 0) {
                console.log('data encontrada para atividade!');
            }else{
                console.log('nenhuma atividade encontrada para a data informada!');
            }
        });
});

//Rota para registrar uma atividade
app.post('/treino/:idTreino/exercicio/:idExercicio', async (req, res) => {
    const id_treino = req.params.idTreino;
    const id_exercicio = req.params.idExercicio;
    const serie = req.body.serie;
    const repeticao = req.body.repeticao;
    const carga = req.body.carga;
    const data_execucao = req.body.dataExecucao;
    const hora_execucao = req.body.horaExecucao;
    db.query('INSERT INTO execucao_exercicio (id_exercicio_treino_id_treino, id_exercicio_treino_id_exercicio,serie,repeticao,carga,progresso_carga,progresso_serie,data_execucao,hora_execucao) values (?,?,?,?,?,?,?,?,?)',
        [id_treino, id_exercicio, serie, repeticao, carga, 1, 1, data_execucao, hora_execucao], (err, result) => {
            if (err) {
                console.error("Erro ao cadastrar atividade!" + err);
                res.status(500).json({ error: 'Erro interno do servidor' });
            } else {
                res.status(200).json(result);
            }
        });
});

