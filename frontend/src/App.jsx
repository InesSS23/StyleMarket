import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/comprador/Home";
import Catalogo from "./pages/comprador/Catalogo";
import DetalhesProduto from "./pages/comprador/DetalhesProduto";
import Carrinho from "./pages/comprador/Carrinho";
import FinalizarCompra from "./pages/comprador/FinalizarCompra";

import Login from "./pages/Login";
import Registo from "./pages/Registo";

import DashboardVendedor from "./pages/vendedor/DashboardVendedor";
import ProdutosVendedor from "./pages/vendedor/ProdutosVendedor";
import AdicionarProduto from "./pages/vendedor/AdicionarProduto";
import EditarProduto from "./pages/vendedor/EditarProduto";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import GerirUtilizadores from "./pages/admin/GerirUtilizadores";
import GerirProdutos from "./pages/admin/GerirProdutos";
import GerirCategorias from "./pages/admin/GerirCategorias";
import GerirEncomendas from "./pages/admin/GerirEncomendas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/finalizar-compra" element={<FinalizarCompra />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />

        <Route path="/vendedor/dashboard" element={<DashboardVendedor />} />
        <Route path="/vendedor/produtos" element={<ProdutosVendedor />} />
        <Route path="/vendedor/adicionar-produto" element={<AdicionarProduto />} />
        <Route path="/vendedor/editar-produto/:id" element={<EditarProduto />} />

        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/utilizadores" element={<GerirUtilizadores />} />
        <Route path="/admin/produtos" element={<GerirProdutos />} />
        <Route path="/admin/categorias" element={<GerirCategorias />} />
        <Route path="/admin/encomendas" element={<GerirEncomendas />} />
      </Routes>
    </Router>
  );
}

export default App;