const ALTURA_POR_CONTEUDO = 3;
const COLORS = {
  amarelo: "#f5b942",
  azul: "#4272f5",
  verde: "#42f551",
  vermelho: "#f54260",
  purple: "#7b42f5",
};
Object.freeze(COLORS);
const QUANTIDADE_POR_TUBO = Object.entries(COLORS).length;
let tuboSelecionado = null;

const popularTubo = () => {
  const cores = Object.entries(COLORS).map(([_, cor]) => cor);
  const coresUtilizadas = [];
  const newTubos = Array(cores.length - 1)
    .fill(1)
    .map((tubo) => {
      tubo = [];
      while (tubo.length < cores.length) {
        const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
        if (
          coresUtilizadas.filter((cor) => cor === corAleatoria).length <
          cores.length-1
        ) {
          tubo.push(corAleatoria);
          coresUtilizadas.push(corAleatoria);
        }
      }
      return tubo;
    });
  newTubos.push([]);
  return newTubos;
};

let tubos = popularTubo();

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
