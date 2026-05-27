import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

function EditarProduto() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    size: "",
    color: "",
    brand: "",
    stock: "",
    condition: "Novo",
    image: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [isOtherBrand, setIsOtherBrand] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const sellerId = getSellerId();

  useEffect(() => {
    api
      .get("/categorias/listar")
      .then((response) => {
        if (response.data.success) {
          setCategorias(response.data.data);
        }
      })
      .catch(() => {
        setErro("Não foi possível carregar as categorias.");
      });

    // fetch product data
    api
      .get(`/produtos/obter/${id}`)
      .then((response) => {
        if (response.data.success) {
          const produto = response.data.data;
          setForm({
            name: produto.name || "",
            description: produto.description || "",
            price: produto.price || "",
            categoryId: produto.categoryId || "",
            size: produto.size || "",
            color: produto.color || "",
            brand: produto.brand || "",
            stock: produto.stock || "",
            condition: produto.condition || "Novo",
            image: produto.image || "",
          });
          setPreview(produto.image || null);
        } else {
          setErro("Produto não encontrado.");
        }
      })
      .catch(() => {
        setErro("Erro ao carregar o produto.");
      });

    // fetch produtos to derive brands
    api
      .get("/produtos/listar")
      .then((res) => {
        if (res.data && res.data.success) {
          const produtos = res.data.data || [];
          const uniq = Array.from(new Set(produtos.map((p) => (p.brand || "").trim()).filter(Boolean)));
          const sorted = uniq.sort();
          setMarcas(sorted);
          if (form.brand && !sorted.includes(form.brand)) setIsOtherBrand(true);
        }
      })
      .catch(() => {});
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(f);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    api
      .put(`/produtos/atualizar/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        sellerId,
      })
      .then((response) => {
        if (response.data.success) {
          navigate("/vendedor/produtos");
        } else {
          setErro(response.data.message || "Erro ao atualizar o produto.");
        }
      })
      .catch(() => {
        setErro("Erro ao ligar ao servidor.");
      })
      .finally(() => setCarregando(false));
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1>Editar Produto</h1>
          <p className="text-muted">Atualiza os dados do produto selecionado.</p>
        </div>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-lg-8">
          <div className="card p-4 mb-3">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Nome do Produto</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: T-shirt Básica Branca"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Descrição</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={4}
                  placeholder="Descreve o produto em detalhe..."
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Preço (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="19.99"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoria</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecionar...</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Tamanho</label>
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecionar...</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Cor</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Branco"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Marca</label>
                <select
                  name="brandSelect"
                  value={marcas.includes(form.brand) ? form.brand : isOtherBrand ? "__other__" : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__other__") {
                      setIsOtherBrand(true);
                      setForm((prev) => ({ ...prev, brand: "" }));
                    } else {
                      setIsOtherBrand(false);
                      setForm((prev) => ({ ...prev, brand: val }));
                    }
                  }}
                  className="form-select"
                >
                  <option value="">Selecionar...</option>
                  {marcas.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="__other__">Outra...</option>
                </select>

                {isOtherBrand ? (
                  <input
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                    className="form-control mt-2"
                    placeholder="Ex: Nike"
                    required
                  />
                ) : null}
              </div>

              <div className="col-md-4">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="10"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Estado</label>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Novo">Novo</option>
                  <option value="Usado - Como Novo">Usado - Como Novo</option>
                  <option value="Usado - Bom Estado">Usado - Bom Estado</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <div className="col-lg-4">
          <div className="card p-4 h-100">
            <label className="form-label">Imagem do Produto</label>
            <div
              className="border rounded p-4 d-flex flex-column justify-content-center align-items-center"
              style={{ minHeight: 220, borderStyle: "dashed" }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: 180 }} />
              ) : (
                <>
                  <div className="mb-2 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#6c757d" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 0a5.53 5.53 0 0 0-3.594 1.3A4.002 4.002 0 0 0 4 8h1a3 3 0 1 1 6 0h1a4 4 0 0 0 .594-7.7A5.53 5.53 0 0 0 8 0z"/>
                      <path fillRule="evenodd" d="M7.5 6.5v4.793l-1.146-1.147-.708.708L8 13.207l2.354-2.353-.708-.708L8.5 11.293V6.5h-1z"/>
                    </svg>
                  </div>
                  <div className="text-center text-muted">Arrasta a imagem ou clica para procurar</div>
                  <div className="text-center text-muted small">PNG, JPG até 5MB</div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={carregando}>
              {carregando ? "A atualizar..." : "Atualizar Produto"}
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => navigate("/vendedor/produtos")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditarProduto;