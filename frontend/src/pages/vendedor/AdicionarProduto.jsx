import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { obterIdVendedor } from "../../utils/authUtils";

const TAMANHOS = [
  "Único",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
];

function criarVarianteVazia() {
  return {
    size: "",
    color: "",
    stock: 1,
  };
}

function AdicionarProduto() {
  const navigate = useNavigate();
  const sellerId = obterIdVendedor();
  const fileInputRef = useRef(null);

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [usarOutraMarca, setUsarOutraMarca] = useState(false);
  const [temVariantes, setTemVariantes] = useState(false);
  const [variantes, setVariantes] = useState([
    criarVarianteVazia(),
    criarVarianteVazia(),
  ]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [imagens, setImagens] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    size: "",
    color: "",
    brand: "",
    stock: 1,
    condition: "Novo",
  });

  useEffect(() => {
    api
      .get("/categorias/listar")
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data.data)) {
          setCategorias(response.data.data);
        } else {
          setErro("Não foi possível carregar as categorias.");
        }
      })
      .catch(() => {
        setErro("Não foi possível carregar as categorias.");
      });

    api
      .get("/produtos/listar")
      .then((response) => {
        if (response.data?.success) {
          const produtos = response.data.data || [];
          const marcasExistentes = [
            ...new Set(
              produtos
                .map((produto) => (produto.brand || "").trim())
                .filter(Boolean)
            ),
          ].sort();

          setMarcas(marcasExistentes);
        }
      })
      .catch(() => {
        setMarcas([]);
      });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((formAtual) => ({
      ...formAtual,
      [name]: value,
    }));
  }

  function handleAlternarVariantes(event) {
    const ativo = event.target.checked;
    setTemVariantes(ativo);

    if (ativo) {
      const primeiraVariante = {
        size: form.size,
        color: form.color,
        stock: Number(form.stock) || 1,
      };

      setVariantes([
        primeiraVariante,
        criarVarianteVazia(),
      ]);
    }
  }

  function handleVarianteChange(index, campo, valor) {
    setVariantes((variantesAtuais) =>
      variantesAtuais.map((variante, posicao) =>
        posicao === index
          ? {
              ...variante,
              [campo]: campo === "stock" ? Number(valor) : valor,
            }
          : variante
      )
    );
  }

  function adicionarVariante() {
    setVariantes((variantesAtuais) => [
      ...variantesAtuais,
      criarVarianteVazia(),
    ]);
  }

  function removerVariante(index) {
    if (variantes.length <= 2) {
      setErro(
        "Um produto com várias opções deve ter pelo menos duas variações."
      );
      return;
    }

    setErro("");
    setVariantes((variantesAtuais) =>
      variantesAtuais.filter((_, posicao) => posicao !== index)
    );
  }

  function lerFicheiro(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Erro ao ler a imagem."));
      reader.readAsDataURL(file);
    });
  }

  async function adicionarImagens(files) {
    const ficheiros = Array.from(files || []);

    if (ficheiros.length === 0) {
      return;
    }

    if (imagens.length + ficheiros.length > 6) {
      setErro("Podes adicionar no máximo 6 imagens por produto.");
      return;
    }

    const ficheiroInvalido = ficheiros.find(
      (file) => !file.type.startsWith("image/")
    );

    if (ficheiroInvalido) {
      setErro("Seleciona apenas ficheiros de imagem.");
      return;
    }

    const ficheiroGrande = ficheiros.find(
      (file) => file.size > 3 * 1024 * 1024
    );

    if (ficheiroGrande) {
      setErro("Cada imagem pode ter no máximo 3 MB.");
      return;
    }

    try {
      const imagensLidas = await Promise.all(ficheiros.map(lerFicheiro));
      setImagens((atuais) => [...atuais, ...imagensLidas]);
      setErro("");
    } catch (error) {
      setErro(error.message);
    }
  }

  function handleFileChange(event) {
    adicionarImagens(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    adicionarImagens(event.dataTransfer.files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function removerImagem(index) {
    setImagens((atuais) => atuais.filter((_, posicao) => posicao !== index));
  }

  function definirImagemPrincipal(index) {
    setImagens((atuais) => {
      const copia = [...atuais];
      const [selecionada] = copia.splice(index, 1);
      return [selecionada, ...copia];
    });
  }

  function prepararVariantes() {
    if (!temVariantes) {
      const stock = Number(form.stock);

      if (!form.size || !form.color.trim()) {
        throw new Error("Preenche o tamanho e a cor do produto.");
      }

      if (!Number.isInteger(stock) || stock < 0) {
        throw new Error("O stock deve ser um número inteiro igual ou superior a 0.");
      }

      return [
        {
          size: form.size,
          color: form.color.trim(),
          stock,
        },
      ];
    }

    if (variantes.length < 2) {
      throw new Error(
        "Adiciona pelo menos duas opções de tamanho, cor ou stock."
      );
    }

    const variantesPreparadas = variantes.map((variante) => ({
      size: variante.size,
      color: variante.color.trim(),
      stock: Number(variante.stock),
    }));

    const temCamposVazios = variantesPreparadas.some(
      (variante) => !variante.size || !variante.color
    );

    if (temCamposVazios) {
      throw new Error("Preenche o tamanho e a cor de todas as opções.");
    }

    const temStockInvalido = variantesPreparadas.some(
      (variante) =>
        !Number.isInteger(variante.stock) || variante.stock < 0
    );

    if (temStockInvalido) {
      throw new Error(
        "O stock de cada opção deve ser um número inteiro igual ou superior a 0."
      );
    }

    const combinacoes = variantesPreparadas.map(
      (variante) =>
        `${variante.size.toLowerCase()}|${variante.color.toLowerCase()}`
    );

    if (new Set(combinacoes).size !== combinacoes.length) {
      throw new Error(
        "Não podes repetir a mesma combinação de tamanho e cor."
      );
    }

    return variantesPreparadas;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    if (!sellerId) {
      setErro("Não foi possível identificar o vendedor autenticado.");
      return;
    }

    try {
      const price = Number(form.price);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error("Indica um preço válido superior a 0.");
      }

      const variantesEnviar = prepararVariantes();
      const primeiraVariante = variantesEnviar[0];
      const stockTotal = variantesEnviar.reduce(
        (total, variante) => total + variante.stock,
        0
      );

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        categoryId: Number(form.categoryId),
        size: primeiraVariante.size,
        color: primeiraVariante.color,
        brand: form.brand.trim() || null,
        stock: stockTotal,
        condition: form.condition,
        image: imagens[0] || null,
        images: imagens,
        sellerId,
        variants: variantesEnviar,
      };

      setCarregando(true);

      const response = await api.post("/produtos/criar", payload);

      if (response.data?.success) {
        navigate("/vendedor/produtos");
      } else {
        setErro(response.data?.message || "Erro ao criar produto.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErro(error.response.data.message);
      } else if (error.message) {
        setErro(error.message);
      } else {
        setErro("Erro ao ligar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  }

  const stockTotalVariantes = variantes.reduce(
    (total, variante) => total + Math.max(0, Number(variante.stock) || 0),
    0
  );

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1>Adicionar Produto</h1>
        <p className="text-muted mb-0">
          Preenche os detalhes do produto para o publicar na plataforma.
        </p>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="card p-4">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Nome do Produto</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Ex.: T-shirt básica"
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
                min="0.01"
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

            <div className="col-md-6">
              <label className="form-label">Marca</label>
              <select
                value={usarOutraMarca ? "__other__" : form.brand}
                onChange={(event) => {
                  const valor = event.target.value;

                  if (valor === "__other__") {
                    setUsarOutraMarca(true);
                    setForm((formAtual) => ({
                      ...formAtual,
                      brand: "",
                    }));
                  } else {
                    setUsarOutraMarca(false);
                    setForm((formAtual) => ({
                      ...formAtual,
                      brand: valor,
                    }));
                  }
                }}
                className="form-select"
              >
                <option value="">Sem marca</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
                <option value="__other__">Outra...</option>
              </select>

              {usarOutraMarca && (
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="form-control mt-2"
                  placeholder="Ex.: Nike"
                />
              )}
            </div>

            <div className="col-md-6">
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
                <option value="Usado - Bom Estado">
                  Usado - Bom Estado
                </option>
              </select>
            </div>

            <div className="col-12 mt-4">
              <div className="card bg-light border-0 p-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="temVariantes"
                    checked={temVariantes}
                    onChange={handleAlternarVariantes}
                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="temVariantes"
                  >
                    Este produto tem várias opções de tamanho ou cor
                  </label>
                </div>

                <p className="text-muted small mt-2 mb-0">
                  Ativa esta opção quando o mesmo modelo estiver disponível em
                  diferentes tamanhos ou cores, com stock próprio para cada
                  combinação.
                </p>
              </div>
            </div>

            {!temVariantes ? (
              <>
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
                    {TAMANHOS.map((tamanho) => (
                      <option key={tamanho} value={tamanho}>
                        {tamanho}
                      </option>
                    ))}
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
                    placeholder="Ex.: Branco"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </>
            ) : (
              <div className="col-12">
                <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 align-items-sm-center mb-3">
                  <div>
                    <h5 className="mb-1">Opções do produto</h5>
                    <p className="text-muted small mb-0">
                      Cada combinação de tamanho e cor tem o seu próprio stock.
                    </p>
                  </div>

                  <span className="badge bg-primary align-self-start">
                    Stock total: {stockTotalVariantes}
                  </span>
                </div>

                {variantes.map((variante, index) => (
                  <div className="border rounded p-3 mb-3" key={index}>
                    <div className="row g-3 align-items-end">
                      <div className="col-md-4">
                        <label className="form-label">
                          Tamanho da opção {index + 1}
                        </label>
                        <select
                          value={variante.size}
                          onChange={(event) =>
                            handleVarianteChange(
                              index,
                              "size",
                              event.target.value
                            )
                          }
                          className="form-select"
                          required
                        >
                          <option value="">Selecionar...</option>
                          {TAMANHOS.map((tamanho) => (
                            <option key={tamanho} value={tamanho}>
                              {tamanho}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Cor</label>
                        <input
                          type="text"
                          value={variante.color}
                          onChange={(event) =>
                            handleVarianteChange(
                              index,
                              "color",
                              event.target.value
                            )
                          }
                          className="form-control"
                          placeholder="Ex.: Azul"
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Stock</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={variante.stock}
                          onChange={(event) =>
                            handleVarianteChange(
                              index,
                              "stock",
                              event.target.value
                            )
                          }
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-1 d-grid">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removerVariante(index)}
                          disabled={variantes.length <= 2}
                          title="Remover opção"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={adicionarVariante}
                >
                  + Adicionar outra opção
                </button>
              </div>
            )}

            <div className="col-12 mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0">Imagens do Produto</label>
                <span className="text-muted small">{imagens.length}/6</span>
              </div>

              <div
                className="border rounded p-4 d-flex flex-column justify-content-center align-items-center"
                style={{
                  minHeight: 150,
                  borderStyle: "dashed",
                  cursor: "pointer",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="fs-1 text-secondary">↑</div>
                <div className="text-center text-muted">
                  Arrasta várias imagens ou clica para procurar
                </div>
                <div className="text-center text-muted small">
                  Até 6 imagens, máximo 3 MB por imagem
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>

              {imagens.length > 0 && (
                <div className="row g-3 mt-1">
                  {imagens.map((imagem, index) => (
                    <div className="col-6 col-md-4 col-xl-3" key={`${imagem.slice(0, 40)}-${index}`}>
                      <div className="card h-100">
                        <img
                          src={imagem}
                          alt={`Pré-visualização ${index + 1}`}
                          className="card-img-top"
                          style={{ height: 150, objectFit: "cover" }}
                        />
                        <div className="card-body p-2">
                          {index === 0 ? (
                            <span className="badge bg-primary mb-2">Imagem principal</span>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary w-100 mb-2"
                              onClick={() => definirImagemPrincipal(index)}
                            >
                              Tornar principal
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => removerImagem(index)}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-12 mt-4">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={carregando}
                >
                  {carregando ? "A criar..." : "Guardar Produto"}
                </button>

                <button
                  className="btn btn-outline-secondary"
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
      </form>
    </div>
  );
}

export default AdicionarProduto;