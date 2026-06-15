import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { getSellerId } from "../../services/seller";

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
    id: null,
    size: "",
    color: "",
    stock: 1,
  };
}

function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sellerId = getSellerId();
  const fileInputRef = useRef(null);

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [usarOutraMarca, setUsarOutraMarca] = useState(false);
  const [temVariantes, setTemVariantes] = useState(false);
  const [variantes, setVariantes] = useState([]);
  const [preview, setPreview] = useState(null);
  const [erro, setErro] = useState("");
  const [carregandoPagina, setCarregandoPagina] = useState(true);
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    brand: "",
    condition: "Novo",
    image: "",
  });

  useEffect(() => {
    let componenteAtivo = true;

    Promise.all([
      api.get("/categorias/listar"),
      api.get(`/produtos/obter/${id}`),
      api.get("/produtos/listar"),
    ])
      .then(([respostaCategorias, respostaProduto, respostaProdutos]) => {
        if (!componenteAtivo) {
          return;
        }

        if (
          respostaCategorias.data?.success &&
          Array.isArray(respostaCategorias.data.data)
        ) {
          setCategorias(respostaCategorias.data.data);
        }

        const produto = respostaProduto.data?.data;

        if (!respostaProduto.data?.success || !produto) {
          setErro("Produto não encontrado.");
          return;
        }

        if (
          produto.sellerId &&
          sellerId &&
          Number(produto.sellerId) !== Number(sellerId)
        ) {
          setErro("Não tens autorização para editar este produto.");
          return;
        }

        const variantesProduto =
          Array.isArray(produto.productVariants) &&
          produto.productVariants.length > 0
            ? produto.productVariants.map((variante) => ({
                id: variante.id,
                size: variante.size || "",
                color: variante.color || "",
                stock: Number(variante.stock || 0),
              }))
            : [
                {
                  id: null,
                  size: produto.size || "Único",
                  color: produto.color || "Única",
                  stock: Number(produto.stock || 0),
                },
              ];

        setForm({
          name: produto.name || "",
          description: produto.description || "",
          price: produto.price ?? "",
          categoryId: produto.categoryId || "",
          brand: produto.brand || "",
          condition: produto.condition || "Novo",
          image: produto.image || "",
        });

        setPreview(produto.image || null);
        setVariantes(variantesProduto);
        setTemVariantes(variantesProduto.length > 1);

        if (respostaProdutos.data?.success) {
          const produtos = respostaProdutos.data.data || [];
          const marcasExistentes = [
            ...new Set(
              produtos
                .map((item) => (item.brand || "").trim())
                .filter(Boolean)
            ),
          ].sort();

          setMarcas(marcasExistentes);
          setUsarOutraMarca(
            Boolean(produto.brand) && !marcasExistentes.includes(produto.brand)
          );
        }
      })
      .catch(() => {
        if (componenteAtivo) {
          setErro("Erro ao carregar os dados do produto.");
        }
      })
      .finally(() => {
        if (componenteAtivo) {
          setCarregandoPagina(false);
        }
      });

    return () => {
      componenteAtivo = false;
    };
  }, [id, sellerId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((formAtual) => ({
      ...formAtual,
      [name]: value,
    }));
  }

  function handleAlternarVariantes(event) {
    const ativo = event.target.checked;

    if (!ativo && variantes.length > 1) {
      const confirmar = window.confirm(
        "Ao desativar esta opção, apenas a primeira combinação será mantida. Queres continuar?"
      );

      if (!confirmar) {
        return;
      }

      setVariantes((variantesAtuais) => [variantesAtuais[0]]);
    }

    if (ativo && variantes.length === 1) {
      setVariantes((variantesAtuais) => [
        ...variantesAtuais,
        criarVarianteVazia(),
      ]);
    }

    setTemVariantes(ativo);
    setErro("");
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
    setTemVariantes(true);
    setVariantes((variantesAtuais) => [
      ...variantesAtuais,
      criarVarianteVazia(),
    ]);
  }

  function removerVariante(index) {
    const variante = variantes[index];

    if (temVariantes && variantes.length <= 2) {
      setErro(
        "Um produto com várias opções deve ter pelo menos duas variações."
      );
      return;
    }

    if (
      variante.id &&
      !window.confirm(
        "Queres remover esta opção? Se já tiver vendas associadas, ficará com stock 0 para preservar o histórico."
      )
    ) {
      return;
    }

    setErro("");
    setVariantes((variantesAtuais) =>
      variantesAtuais.filter((_, posicao) => posicao !== index)
    );
  }

  function handleFile(file) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErro("Seleciona um ficheiro de imagem válido.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErro("A imagem não pode ter mais de 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((formAtual) => ({
        ...formAtual,
        image: reader.result,
      }));
      setPreview(reader.result);
      setErro("");
    };

    reader.readAsDataURL(file);
  }

  function handleFileChange(event) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    handleFile(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function prepararVariantes() {
    if (variantes.length === 0) {
      throw new Error("O produto deve ter pelo menos uma opção.");
    }

    if (temVariantes && variantes.length < 2) {
      throw new Error(
        "Adiciona pelo menos duas opções ou desativa a opção de várias combinações."
      );
    }

    const variantesPreparadas = variantes.map((variante) => ({
      id: variante.id || undefined,
      size: variante.size,
      color: variante.color.trim(),
      stock: Number(variante.stock),
    }));

    if (
      variantesPreparadas.some(
        (variante) => !variante.size || !variante.color
      )
    ) {
      throw new Error("Preenche o tamanho e a cor de todas as opções.");
    }

    if (
      variantesPreparadas.some(
        (variante) =>
          !Number.isInteger(variante.stock) || variante.stock < 0
      )
    ) {
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
      const preco = Number(form.price);

      if (!Number.isFinite(preco) || preco <= 0) {
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
        price: preco,
        categoryId: Number(form.categoryId),
        brand: form.brand.trim() || null,
        condition: form.condition,
        image: form.image,
        sellerId,
        size: primeiraVariante.size,
        color: primeiraVariante.color,
        stock: stockTotal,
        variants: variantesEnviar,
      };

      setCarregando(true);

      const response = await api.put(`/produtos/atualizar/${id}`, payload);

      if (response.data?.success) {
        navigate("/vendedor/produtos");
      } else {
        setErro(response.data?.message || "Erro ao atualizar o produto.");
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

  if (carregandoPagina) {
    return (
      <div className="container py-5">
        <div className="alert alert-secondary">A carregar produto...</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1>Editar Produto</h1>
        <p className="text-muted mb-0">
          Atualiza os dados e as opções de tamanho, cor e stock.
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
                    id="editarTemVariantes"
                    checked={temVariantes}
                    onChange={handleAlternarVariantes}
                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="editarTemVariantes"
                  >
                    Este produto tem várias opções de tamanho ou cor
                  </label>
                </div>

                <p className="text-muted small mt-2 mb-0">
                  Cada combinação pode ter um stock diferente. Uma opção com
                  stock 0 aparece como esgotada.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 align-items-sm-center mb-3">
                <div>
                  <h5 className="mb-1">
                    {temVariantes ? "Opções do produto" : "Opção do produto"}
                  </h5>
                  <p className="text-muted small mb-0">
                    Define tamanho, cor e stock para cada combinação.
                  </p>
                </div>

                <span className="badge bg-primary align-self-start">
                  Stock total: {stockTotalVariantes}
                </span>
              </div>

              {variantes.map((variante, index) => (
                <div className="border rounded p-3 mb-3" key={variante.id || `nova-${index}`}>
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">
                        Tamanho {temVariantes ? `da opção ${index + 1}` : ""}
                      </label>
                      <select
                        value={variante.size}
                        onChange={(event) =>
                          handleVarianteChange(index, "size", event.target.value)
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
                          handleVarianteChange(index, "color", event.target.value)
                        }
                        className="form-control"
                        placeholder="Ex.: Azul"
                        required
                      />
                    </div>

                    <div className={temVariantes ? "col-md-3" : "col-md-4"}>
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={variante.stock}
                        onChange={(event) =>
                          handleVarianteChange(index, "stock", event.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    {temVariantes && (
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
                    )}
                  </div>

                  {Number(variante.stock) <= 0 && (
                    <div className="text-danger small mt-2 fw-semibold">
                      Esta opção está esgotada.
                    </div>
                  )}
                </div>
              ))}

              {temVariantes && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={adicionarVariante}
                >
                  + Adicionar outra opção
                </button>
              )}
            </div>

            <div className="col-12 mt-4">
              <label className="form-label">Imagem do Produto</label>
              <div
                className="border rounded p-4 d-flex flex-column justify-content-center align-items-center"
                style={{
                  minHeight: 220,
                  borderStyle: "dashed",
                  cursor: "pointer",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Pré-visualização do produto"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 180,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <>
                    <div className="fs-1 text-secondary">↑</div>
                    <div className="text-center text-muted">
                      Arrasta a imagem ou clica para procurar
                    </div>
                    <div className="text-center text-muted small">
                      PNG ou JPG até 5 MB
                    </div>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="col-12 mt-4">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={carregando || Boolean(erro && !form.name)}
                >
                  {carregando ? "A atualizar..." : "Atualizar Produto"}
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

export default EditarProduto;
