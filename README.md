# Blog Pontevi

Este é um projeto de blog simples que foi construído usando várias tecnologias, incluindo o **Node.js** e o **MongoDB**. O objetivo deste projeto é permitir que os usuários possam criar, editar e excluir categorias e postagens em um blog, além de criar e excluir contas.

O projeto pode ser acessado através do link https://blogapp-viniciusmponte.cyclic.app/

## Screenshot

<img src="https://raw.githubusercontent.com/ViniciusMPonte/portfolio/main/images/blog-pontevi.png" style="width: 500px; height: auto;">

## Autenticação e Autorização

O blog possui um sistema de autenticação e autorização que permite que apenas usuários administradores autenticados (logados) possam criar, editar e excluir categorias e postagens. A autenticação é feita com a biblioteca `passport-local`.


## Validação de Formulários

Os formulários possuem um sistema de validação abrangente, presente tanto no back-end quanto no front-end, que apresenta mensagens de erro quando se depara com problemas como campos vazios, formatos de e-mail ou slug incorretos e duplicações de dados no banco, evitando, assim, que um usuário se cadastre com um e-mail já registrado, por exemplo.


## Segurança

Durante o processo de criação de uma conta, as senhas fornecidas pelos usuários são submetidas à biblioteca `bcryptjs`, a qual gera um hash que substitui a senha original no banco de dados, dando mais segurança e proteção às informações pessoais.


## Tecnologias

As tecnologias utilizadas neste projeto incluem:

### Front-end

- HTML
- CSS
- JavaScript
- Bootstrap

### Back-end

- Node.js
- MongoDB
- Bibliotecas utilizadas:
    - bcryptjs
    - body-parser
    - connect-flash
    - dotenv
    - express
    - express-handlebars
    - express-session
    - mongoose
    - passport
    - passport-local


## Como executar o projeto

### Pré-requisitos

Para operar adequadamente, é necessário possuir o Node.js devidamente instalado em seu computador. Quanto ao banco de dados, há duas opções disponíveis:

A primeira delas é ter a instalação do MongoDB diretamente em sua máquina. A segunda alternativa, por sua vez, é utilizar a URI de um banco de dados MongoDB online.


### Instalação

Para executar o projeto, siga as etapas abaixo:

1. Clone o repositório em sua máquina local;
2. Renomeie o arquivo `.env.example` para `.env`;
3. Abra o arquivo `.env` e adicione suas informações de configuração de banco de dados e outras informações confidenciais;

```.env

NODE_ENV=           //Digite 'production' ou 'development'
PORT=               //Se não for definido o servidor rodará na porta 8000
MONGO_URI=          //URI do banco de dados MongoDB
SESSION_SECRET=     //Crie uma chave

```


4. Abra um terminal e navegue até a pasta raiz do projeto.
5. Execute `npm install` para instalar as dependências do projeto;
6. Execute `npm start` para iniciar o servidor;
7. Abra um navegador da web e vá para `http://localhost:8000/`.

## Contato

- LinkedIn: https://www.linkedin.com/in/viniciusmponte/
- E-mail: vinicius.mponte@gmail.com
- Portfólio: https://viniciusmponte.github.io/portfolio/
