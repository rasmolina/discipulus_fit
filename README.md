# DiscipulusFit

## _Projeto avaliativo final para a disciplina de Projetos de Sistemas - IFSP/2023_
### Prof. Rodrigo Bianchi
#

## Propósito e utilização do sistema
O propópsito do DiscipulusFit é facilitar a vida do atleta permitindo um melhor gerenciamento pessoal dos seus treinos, em especial para os que trabalham na modalidade Progressive Overloading. Para utilizar o sistema, deve-se primeiro criar uma conta, o login (email) deve ser único para cada usuário. Após autenticação, o atleta pode cadastrar novos exercícios, ou utilizar os exercícios previamente cadastrados para montar seus treinos. Uma vez montados os treinos, o atleta poderá fazer o registro e acompanhamento de suas atividades.

## Desenvolvimento

## API Backend
A API do backend foi construída utilizando Node Express com auxílio das bibliotecas nodemon, cors e mysql para criação e manipulação do banco de dados. Em razão das circunstâncias de mudança de tecnologia para construção do backend, não houve tempo hábil para implementação de funcionalidades mais avanaçadas como autenticação via JWT, criptografia de senhas e rotas de acesso privado.

## Frontend
O frontend foi desenvolvido em React.js utilizando as bibliotecas axios para comunicação com API, react-bootstrap para estilização das folhas de estilo, toast para notificações mais elegantes e react-router-dom para manipulação das rotas.

### Instruções de execução (via terminal)
Backend na pasta server:
```sh
npm run server
```
Frontend na pasta frontend/app
```sh
npm start
```

## Desenvolvedor
Roberto Augusto Silva Molina