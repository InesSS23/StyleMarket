
Loja	           Email	                      Palavra-passe
Urban Thread	   marta.oliveira@example.com	  1234
Aurora Boutique	   beatriz.martins@example.com	  1234
North Denim	       tiago.ferreira@example.com	  1234
Minimal Studio	   sofia.almeida@example.com	  1234
Loop Accessories   ricardo.costa@example.com	  1234

contas modelo:  backend/src/config/dadosIniciais
vendedor@s.com    1234
comprador@s.com   1234
admin@s.com       1234

# StyleMarket

A StyleMarket é uma plataforma web académica para compra e venda de roupa.
A aplicação possui três perfis: comprador, vendedor e administrador.

## Funcionalidades principais

### Visitante
- Consultar a página inicial, o catálogo e os detalhes dos produtos.
- Adicionar produtos a um carrinho temporário.
- Criar uma conta ou iniciar sessão.

### Comprador
- Consultar produtos, variantes e várias imagens.
- Utilizar um carrinho associado à conta.
- Finalizar encomendas.
- Consultar os dados do perfil e terminar sessão.

### Vendedor
- Consultar o dashboard da loja.
- Criar e gerir os próprios produtos.
- Definir tamanhos, cores, stock e várias imagens.
- Consultar vendas e dados da loja.

### Administrador
- Consultar estatísticas gerais.
- Consultar, desativar e apagar utilizadores.
- Consultar e apagar produtos.
- Criar e apagar categorias.
- Consultar encomendas e avançar o respetivo estado.

## Tecnologias

### Frontend
- React
- React Router
- Bootstrap
- Axios
- Vite

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL


## Configuração da base de dados
1. Criar uma base PostgreSQL chamada `stylemarket`.
2. Copiar `backend/.env.example` para `backend/.env`.
3. Preencher os dados locais do PostgreSQL.


## Endereço do backend no frontend
Para desenvolvimento local, o frontend usa:
http://localhost:3000


## Verificações antes da entrega

No frontend:
```bash
npm run lint
npm run build
```

Também devem ser testados:
- registo e login dos diferentes perfis;
- carrinho e finalização de encomendas;
- criação e edição de produtos pelo vendedor;
- atualização de stock;
- gestão administrativa;
- apresentação em computador, tablet e telemóvel.