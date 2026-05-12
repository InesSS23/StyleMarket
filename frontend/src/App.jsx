import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/*
  Nesta fase inicial, vamos criar páginas simples.
  Depois vamos substituir cada página pelo design completo.
*/

function Home() {
  return (
    <div className="container py-5">
      <h1>StyleMarket</h1>
      <p>Plataforma de venda de roupas online.</p>
    </div>
  );
}

function Catalog() {
  return (
    <div className="container py-5">
      <h1>Catálogo</h1>
      <p>Lista de roupas disponíveis.</p>
    </div>
  );
}

function Login() {
  return (
    <div className="container py-5">
      <h1>Login</h1>
      <p>Entrada única para comprador, vendedor e administrador.</p>
    </div>
  );
}

function Register() {
  return (
    <div className="container py-5">
      <h1>Registo</h1>
      <p>Registo para comprador ou vendedor.</p>
    </div>
  );
}

function SellerDashboard() {
  return (
    <div className="container py-5">
      <h1>Dashboard do Vendedor</h1>
      <p>Área para gerir produtos e vendas.</p>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="container py-5">
      <h1>Dashboard do Administrador</h1>
      <p>Área para gerir utilizadores, produtos, categorias e encomendas.</p>
    </div>
  );
}

/*
  O App define as rotas principais da aplicação.
  Nesta primeira fase, só queremos confirmar que a navegação funciona.
*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Register />} />
        <Route path="/vendedor/dashboard" element={<SellerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;