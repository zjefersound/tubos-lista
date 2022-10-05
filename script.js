const QUANTIDADE_POR_TUBO = 4;
const ALTURA_POR_CONTEUDO = 3;
const COLORS = {
  amarelo: "#f5b942",
  azul: "#4272f5",
  verde: "#42f551",
  vermelho: "#f54260",
};
Object.freeze(COLORS);

let tuboSelecionado = null;
let tubos = [
  [COLORS.amarelo, COLORS.verde, COLORS.vermelho, COLORS.azul],
  [COLORS.amarelo, COLORS.azul, COLORS.vermelho, COLORS.verde],
  [COLORS.azul, COLORS.amarelo, COLORS.vermelho, COLORS.verde],
  [],
];

const getPrimeirosItensDoTubo = (tempTubo, limit, itens = []) => {
  let tubo = [...tempTubo];
  const cor = tubo[0];
  const semItens = !tubo.length;
  const corDiferente = itens.length && !itens.includes(cor);
  const atingiuLimite = limit && itens.length === limit;
  if (atingiuLimite || semItens || corDiferente) return [itens, tubo];

  tubo.shift();
  itens.push(cor);
  return getPrimeirosItensDoTubo(tubo, limit, itens);
};

const verificarTubos = () => {
  const ganhou = tubos.reduce((resultado, tubo) => {
    const todosIguais = tubo.every((cor) => cor === tubo[0]);
    return resultado && todosIguais;
  }, true);

  if (ganhou) {
    const texto = document.getElementById("mensagem");
    texto.innerHTML = "Venceu!";
  }
};

const onClicarTubo = (tubo, index) => {
  if (tuboSelecionado === null) {
    tuboSelecionado = { index, tubo };
  } else {
    if (tubo.length < QUANTIDADE_POR_TUBO) {
      const limite = QUANTIDADE_POR_TUBO - tubo.length;
      const [coresParaAdd, newTubo] = getPrimeirosItensDoTubo(
        tuboSelecionado.tubo,
        limite
      );
      tubos[tuboSelecionado.index] = [...newTubo];
      tubos[index] = [...coresParaAdd, ...tubos[index]];
      verificarTubos();
    }
    tuboSelecionado = null;
  }

  showTubos();
};

const showTubos = () => {
  const listaElement = document.getElementById("lista");
  listaElement.innerHTML = "";
  tubos.forEach((tubo, index) => {
    const tuboElemento = document.createElement("li");
    tuboElemento.style.height =
      QUANTIDADE_POR_TUBO * ALTURA_POR_CONTEUDO + 1 + ".5rem";
    tuboElemento.onclick = () => onClicarTubo(tubo, index);
    const isSelecionado = tuboSelecionado && tuboSelecionado.index === index;
    tuboElemento.className = `tubo ${isSelecionado ? "selecionado" : ""}`;
    tubo.forEach((cor) => {
      const conteudo = document.createElement("div");
      conteudo.style.background = cor;
      conteudo.className = "conteudo";
      tuboElemento.appendChild(conteudo);
    });
    listaElement.appendChild(tuboElemento);
  });
};
showTubos();
