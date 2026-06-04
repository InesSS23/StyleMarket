import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

function AdicionarProduto() {
  const navigate = useNavigate();
  const sellerId = getSellerId();
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [isOtherBrand, setIsOtherBrand] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    size: "",
    color: "",
    brand: "",
    stock: 0,
    condition: "",
    image: "",
  });

  useEffect(() => {
    // Carregar categorias da API
    api
      .get("/categorias/listar")
      .then((res) => {
        let cats = null;
        if (res.data && res.data.success && res.data.data && Array.isArray(res.data.data)) {
          cats = res.data.data;
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
          cats = res.data.data;
        } else if (Array.isArray(res.data)) {
          cats = res.data;
        }
        
        if (cats && cats.length > 0) {
          setCategorias(cats);
        } else {
          console.warn("Formato de resposta de categorias não reconhecido:", res.data);
          setDefaultCategories();
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar categorias:", err);
        setDefaultCategories();
      });
    
    // Carregar marcas existentes para o dropdown
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
  }, []);

  function setDefaultCategories() {
    setCategorias([
      { id: 1, name: "T-shirts" },
      { id: 2, name: "Casacos" },
      { id: 3, name: "Calças" },
      { id: 4, name: "Vestidos" },
      { id: 5, name: "Sapatilhas" },
      { id: 6, name: "Acessórios" }
    ]);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Captura a imagem em Base64
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

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    if (!form.image) {
      setErro("Por favor, adiciona uma imagem ao produto.");
      setCarregando(false);
      return;
    }

    try {
      const dataAtual = new Date().toISOString().split("T")[0];

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        size: form.size,
        color: form.color.trim(),
        brand: form.brand.trim() || "Sem Marca",
        stock: Number(form.stock),
        condition: form.condition,
        image: form.image,
        sellerId: sellerId,
        date: dataAtual,
        variants: [
          {
            size: form.size,
            color: form.color.trim(),
            stock: Number(form.stock)
          }
        ]
      };

      const res = await api.post("/produtos/criar", payload);
      if (res.data && res.data.success) {
        navigate("/vendedor/produtos");
      } else {
        setErro(res.data?.message || "Erro ao criar produto.");
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setErro(
        error.response?.data?.message ||
          error.message ||
          "Erro ao conectar com o servidor."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold">Adicionar Produto</h1>
          <p className="text-muted">Preenche os detalhes do produto para o publicar na plataforma.</p>
        </div>
      </div>

      {erro && <div className="alert alert-danger text-center small">{erro}</div>}

      <form onSubmit={handleSubmit} className="row g-3" autoComplete="off">
        <div className="col-12">
          <div className="card p-4 shadow-sm" style={{ borderRadius: "1rem" }}>
            <div className="row g-3">
              
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary small">Nome do Produto</label>
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
                <label className="form-label fw-semibold text-secondary small">Descrição</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={4}
                  placeholder="Descreve o produto em detalhe (material, estado, uso)..."
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary small">Preço (€)</label>
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
                <label className="form-label fw-semibold text-secondary small">Categoria</label>
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

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary small">Tamanho</label>
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

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary small">Cor</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Preto"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary small">Marca</label>
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

                {isOtherBrand && (
                  <input
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                    className="form-control mt-2"
                    placeholder="Escreve a marca personalizada"
                    required
                  />
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary small">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="1"
                  min="1"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary small">Estado do Artigo</label>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecionar...</option>
                  <option value="Novo">Novo</option>
                  <option value="Usado - Como Novo">Usado - Como Novo</option>
                  <option value="Usado - Bom Estado">Usado - Bom Estado</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold text-secondary small">Imagem do Produto</label>
                <div
                  className="border rounded p-4 d-flex flex-column justify-content-center align-items-center bg-light"
                  style={{ minHeight: 220, borderStyle: "dashed", cursor: "pointer" }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? (
                    <div className="position-relative">
                      <img src={preview} alt="preview" className="img-fluid rounded" style={{ maxHeight: 180 }} />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setForm(prev => ({ ...prev, image: "" }));
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#6c757d" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8 0a5.53 5.53 0 0 0-3.594 1.3A4.002 4.002 0 0 0 4 8h1a3 3 0 1 1 6 0h1a4 4 0 0 0 .594-7.7A5.53 5.53 0 0 0 8 0z"/>
                          <path fillRule="evenodd" d="M7.5 6.5v4.793l-1.146-1.147-.708.708L8 13.207l2.354-2.353-.708-.708L8.5 11.293V6.5h-1z"/>
                        </svg>
                      </div>
                      <div className="text-center text-muted fw-medium">Arrasta a imagem ou clica para procurar</div>
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

              <div className="col-12 mt-4">
                <div className="d-flex gap-2">
                  <button className="btn btn-primary px-4" type="submit" disabled={carregando}>
                    {carregando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        A guardar...
                      </>
                    ) : "Guardar Produto"}
                  </button>
                  <button
                    className="btn btn-outline-secondary px-4"
                    type="button"
                    onClick={() => navigate("/vendedor/produtos")}
                    disabled={carregando}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdicionarProduto;