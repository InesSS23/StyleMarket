import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import RotaProtegida from "./components/RotaProtegida";
import RotaPublicaOuPerfil from "./components/RotaPublicaOuPerfil";

import LayoutPrincipal from "./layouts/LayoutPrincipal";
import LayoutVendedor from "./layouts/LayoutVendedor";
import LayoutAdmin from "./layouts/LayoutAdmin";

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
import VendasVendedor from "./pages/vendedor/VendasVendedor";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import GerirUtilizadores from "./pages/admin/GerirUtilizadores";
import GerirProdutos from "./pages/admin/GerirProdutos";
import GerirCategorias from "./pages/admin/GerirCategorias";
import GerirEncomendas from "./pages/admin/GerirEncomendas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="produto/:id" element={<DetalhesProduto />} />

          <Route
            path="carrinho"
            element={
              <RotaPublicaOuPerfil perfisPermitidos={["comprador"]}>
                <Carrinho />
              </RotaPublicaOuPerfil>
            }
          />

          <Route
            path="finalizar-compra"
            element={
              <RotaProtegida perfisPermitidos={["comprador"]}>
                <FinalizarCompra />
              </RotaProtegida>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />

        <Route
          path="/vendedor"
          element={
            <RotaProtegida perfisPermitidos={["vendedor"]}>
              <LayoutVendedor />
            </RotaProtegida>
          }
        >
          <Route path="dashboard" element={<DashboardVendedor />} />
          <Route path="produtos" element={<ProdutosVendedor />} />
          <Route path="adicionar-produto" element={<AdicionarProduto />} />
          <Route path="editar-produto/:id" element={<EditarProduto />} />
          <Route path="vendas" element={<VendasVendedor />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RotaProtegida perfisPermitidos={["admin"]}>
              <LayoutAdmin />
            </RotaProtegida>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="utilizadores" element={<GerirUtilizadores />} />
          <Route path="produtos" element={<GerirProdutos />} />
          <Route path="categorias" element={<GerirCategorias />} />
          <Route path="encomendas" element={<GerirEncomendas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;