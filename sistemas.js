"use strict";

/* ALTAVENTO, RAÇAS, METAMORFOS E RECURSOS */
const RACA_DADOS = {
    "Humano": { hp: 1, pe: 1 },
    "Antropomórficos": { hp: 1, pe: 1 },
    "Esqueleto": { hp: 0.75, pe: 1 },
    "Metamorfo": { hp: 0.8, pe: 1 },
    "Elfo": { hp: 0.85, pe: 1.3 }
};

const ANIMAIS_METAMORFO = {
    "Lobo": { tipo: "comum", atributos: { AGI: 2, FOR: 2, VIG: 3, INT: 1, PRE: 0, ESP: 1 } },
    "Gato": { tipo: "comum", atributos: { AGI: 3, FOR: 0, VIG: 1, INT: 2, PRE: 1, ESP: 2 } },
    "Cachorro": { tipo: "comum", atributos: { AGI: 1, FOR: 2, VIG: 3, INT: 2, PRE: 1, ESP: 0 } },
    "Guepardo": { tipo: "comum", atributos: { AGI: 3, FOR: 1, VIG: 2, INT: 1, PRE: 2, ESP: 0 } },
    "Leopardo": { tipo: "comum", atributos: { AGI: 3, FOR: 2, VIG: 2, INT: 1, PRE: 1, ESP: 0 } },
    "Coelho": { tipo: "comum", atributos: { AGI: 3, FOR: 0, VIG: 1, INT: 2, PRE: 1, ESP: 2 } },
    "Raposa": { tipo: "comum", atributos: { AGI: 2, FOR: 0, VIG: 1, INT: 3, PRE: 2, ESP: 1 } },
    "Wyvern": { tipo: "historico", custo: 4500, atributos: { AGI: 2, FOR: 3, VIG: 2, INT: 1, PRE: 1, ESP: 0 } },
    "Wyvern Alado": { tipo: "historico", custo: 4500, voo: true, atributos: { AGI: 3, FOR: 3, VIG: 2, INT: 1, PRE: 1, ESP: 0 } },
    "Pégaso": { tipo: "historico", bloqueado: true },
    "Grifo": { tipo: "historico", bloqueado: true },
    "Kelpie": { tipo: "historico", bloqueado: true },
    "Kitsune": { tipo: "historico", bloqueado: true },
    "Ancient Tubarão-branco": { tipo: "historico", bloqueado: true },
    "Hipocampo": { tipo: "historico", bloqueado: true }
};

const ARVORE_METAMORFO = [
    { id: "instinto", nome: "Instinto Aguçado", custo: 4500, efeito: "+1 em Percepção enquanto transformado." },
    { id: "predador", nome: "Predador Natural", custo: 6500, efeito: "+1 no dano de ataques físicos enquanto transformado." },
    { id: "carapaca", nome: "Resistência Selvagem", custo: 6500, efeito: "+3 PV máximos." },
    { id: "adaptacao", nome: "Adaptação", custo: 9000, efeito: "Uma vez por cena, transforme-se sem gastar PE." }
];

const calcularBaseRacas = calcular;
calcular = function(ficha) {
    const base = calcularBaseRacas(ficha);
    const raca = ficha.raca || "Humano";
    const regra = RACA_DADOS[raca] || RACA_DADOS.Humano;
    const extras = ficha.limitesExtras || {};
    const compras = ficha.arvoreMetamorfo?.compras || [];
    let pvBase = base.pv;
    if (raca === "Metamorfo" && ficha.arvore?.caminho === "Casca Grossa") {
        pvBase -= 4 + (Number(ficha.nivel || 1) - 1);
    }
    let pv = Math.floor(pvBase * regra.hp);
    let pe = Math.floor(base.pe * regra.pe);
    if (compras.includes("carapaca")) pv += 3;
    pv += numeroSeguro(extras.pv || 0, 0, 9999);
    pe += numeroSeguro(extras.pe || 0, 0, 9999);
    const animal = ANIMAIS_METAMORFO[ficha.animalMetamorfo] || ANIMAIS_METAMORFO.Lobo;
    let bonusForma = { AGI: 0, FOR: 0, VIG: 0, INT: 0, PRE: 0, ESP: 0 };
    if (raca === "Metamorfo" && ficha.transformado && animal.atributos) bonusForma = animal.atributos;
    pv += 2 * (bonusForma.VIG || 0);
    pe += 2 * (bonusForma.ESP || 0);
    const bonusVoo = raca === "Metamorfo" && ficha.transformado && animal.voo && ficha.voando ? 2 : 0;
    const defesa = base.defesa + (bonusForma.AGI || 0) + bonusVoo + numeroSeguro(extras.defesa || 0, 0, 9999);
    return {
        ...base, pv, pe, defesa,
        bonusAtributosForma: bonusForma,
        danoFisico: (base.danoFisico || 0) + (bonusForma.FOR || 0),
        danoOssoBonus: raca === "Esqueleto" ? 2 : 0,
        danoMagicoBonus: raca === "Elfo" ? 2 : 0,
        danoMetamorfoBonus: raca === "Metamorfo" && ficha.transformado && compras.includes("predador") ? 1 : 0
    };
};

const normalizarBaseRacas = normalizarPersonagem;
normalizarPersonagem = function(ficha) {
    ficha.raca = RACA_DADOS[ficha.raca] ? ficha.raca : "Humano";
    ficha.animalMetamorfo = ANIMAIS_METAMORFO[ficha.animalMetamorfo] ? ficha.animalMetamorfo : "Lobo";
    ficha.transformado = Boolean(ficha.transformado);
    ficha.voando = Boolean(ficha.voando);
    ficha.animaisDesbloqueados = Array.isArray(ficha.animaisDesbloqueados) ? ficha.animaisDesbloqueados : [];
    ficha.limitesExtras = ficha.limitesExtras && typeof ficha.limitesExtras === "object" ? ficha.limitesExtras : { pv: 0, pe: 0, defesa: 0 };
    ficha.arvoreMetamorfo = ficha.arvoreMetamorfo && typeof ficha.arvoreMetamorfo === "object" ? ficha.arvoreMetamorfo : { compras: [] };
    ficha.arvoreMetamorfo.compras = Array.isArray(ficha.arvoreMetamorfo.compras) ? ficha.arvoreMetamorfo.compras : [];
    if (ficha.raca === "Esqueleto") ficha.elemento = "Osso";
    if (ficha.raca !== "Metamorfo") ficha.transformado = false;
    return normalizarBaseRacas(ficha);
};

const abrirEditorRacas = abrirEditor;
abrirEditor = function(ficha) {
    abrirEditorRacas(ficha);
    const secao = document.createElement("section");
    secao.className = "secao secao-raca";
    secao.innerHTML = `
      <h3>Raça</h3>
      <div class="campo"><label for="raca-personagem">Escolha sua raça</label>
        <select id="raca-personagem">${Object.keys(RACA_DADOS).map(r => `<option value="${r}" ${ficha.raca===r?"selected":""}>${r}</option>`).join("")}</select>
      </div>
      <p id="descricao-raca" class="aviso"></p>
      <div class="campo" id="campo-animal" style="display:${ficha.raca==="Metamorfo"?"block":"none"}">
        <label for="animal-personagem">Animal de referência</label>
        <select id="animal-personagem">${Object.entries(ANIMAIS_METAMORFO).map(([nome,a]) => `<option value="${nome}" ${ficha.animalMetamorfo===nome?"selected":""} ${a.bloqueado?"disabled":""}>${nome}${a.bloqueado?" — BLOQUEADO":a.tipo==="historico"?" — 4.500 XP":""}</option>`).join("")}</select>
      </div>
      <p class="aviso">Esqueleto: -25% PV, elemento Osso obrigatório e +2 dano de Osso. Metamorfo: -20% PV. Elfo: -15% PV, +30% PE e +2 dano mágico.</p>`;
    const actions = conteudo.querySelector(".acoes");
    if (actions) conteudo.insertBefore(secao, actions);
    const race = document.getElementById("raca-personagem");
    const elem = document.getElementById("elemento");
    const updateRace = () => {
        document.getElementById("campo-animal").style.display = race.value === "Metamorfo" ? "block" : "none";
        const desc = {
          Humano: "Sem modificadores raciais.",
          "Antropomórficos": "Sem modificadores raciais.",
          Esqueleto: "Menos PV; elemento Osso obrigatório; dano de Osso aumentado.",
          Metamorfo: "Menos PV. Pode assumir formas animais e evoluir sua própria árvore com XP.",
          Elfo: "Mais PE, menos PV e dano mágico aumentado."
        };
        document.getElementById("descricao-raca").textContent = desc[race.value];
        if (race.value === "Esqueleto") { elem.value = "Osso"; elem.disabled = true; }
        else elem.disabled = false;
    };
    race.onchange = updateRace; updateRace();
    const save = document.getElementById("salvar-personagem");
    const previous = save.onclick;
    save.onclick = () => {
        ficha.raca = race.value;
        ficha.animalMetamorfo = document.getElementById("animal-personagem").value;
        if (ficha.raca === "Esqueleto") document.getElementById("elemento").value = "Osso";
        previous();
    };
};

const mostrarFichaRacas = mostrarFicha;
mostrarFicha = function(ficha, abaInicial="geral") {
    mostrarFichaRacas(ficha, abaInicial);
    const area = document.getElementById("conteudo-aba");
    if (!area) return;
    const stats = calcular(ficha);
    const pctPV = stats.pv > 0 ? Math.min(100, ficha.pvAtual / stats.pv * 100) : 0;
    const pctPE = stats.pe > 0 ? Math.min(100, ficha.peAtual / stats.pe * 100) : 0;
    const bars = document.createElement("section");
    bars.className = "secao barras-recursos";
    bars.innerHTML = `
      <div class="barra-label"><strong>PV</strong><span>${ficha.pvAtual} / ${stats.pv}</span></div>
      <div class="barra trilho-pv"><div style="width:${pctPV}%"></div></div>
      <div class="barra-label"><strong>PE</strong><span>${ficha.peAtual} / ${stats.pe}</span></div>
      <div class="barra trilho-pe"><div style="width:${pctPE}%"></div></div>
      <div class="acoes">
        <button class="secundario" id="limite-pv">+5 ao limite de PV</button>
        <button class="secundario" id="limite-pe">+3 ao limite de PE</button>
        <button class="secundario" id="limite-defesa">+1 Defesa</button>
      </div>`;
    area.prepend(bars);
    if (ficha.raca === "Esqueleto" || ficha.raca === "Elfo" || (ficha.raca === "Metamorfo" && ficha.transformado)) {
        const racial = document.createElement("p");
        racial.className = "aviso";
        const extrasRaciais = [];
        if (ficha.raca === "Esqueleto") extrasRaciais.push("+2 dano de Osso");
        if (ficha.raca === "Elfo") extrasRaciais.push("+2 dano mágico");
        if (ficha.raca === "Metamorfo" && ficha.transformado) extrasRaciais.push("Bônus de atributos da forma aplicados" + (stats.danoMetamorfoBonus ? " · +1 dano físico da árvore" : ""));
        racial.textContent = extrasRaciais.join(" · ");
        bars.appendChild(racial);
    }
    const atualizarLimite = (chave, valor) => {
        ficha.limitesExtras[chave] = numeroSeguro(ficha.limitesExtras[chave] || 0, 0, 9999) + valor;
        salvarPersonagem(ficha);
        mostrarFicha(ficha, abaInicial);
    };
    bars.querySelector("#limite-pv").onclick = () => atualizarLimite("pv", 5);
    bars.querySelector("#limite-pe").onclick = () => atualizarLimite("pe", 3);
    bars.querySelector("#limite-defesa").onclick = () => atualizarLimite("defesa", 1);

    const blocoTrilha = [...conteudo.querySelectorAll(".secao")].find(s => s.textContent.includes("Árvore de trilha"));
    if (ficha.raca === "Metamorfo") {
        if (blocoTrilha) blocoTrilha.style.display = "none";
        const animal = ANIMAIS_METAMORFO[ficha.animalMetamorfo] || ANIMAIS_METAMORFO.Lobo;
        const tree = document.createElement("section");
        tree.className = "secao arvore-metamorfo";
        const compras = ficha.arvoreMetamorfo.compras || [];
        tree.innerHTML = `
          <h3>Árvore de habilidades — Metamorfo</h3>
          <p>Você não possui trilhas de classe. Evolua seu domínio das formas usando XP.</p>
          <p><strong>Forma escolhida:</strong> ${ficha.animalMetamorfo} ${ficha.transformado?"(transformado)":"(forma humana)"}</p>
          ${animal.tipo==="historico" && !animal.bloqueado && !ficha.animaisDesbloqueados?.includes(ficha.animalMetamorfo) ? `<p class="aviso">Esta forma histórica ainda precisa ser desbloqueada por 4.500 XP.</p><button id="desbloquear-animal">Desbloquear ${ficha.animalMetamorfo} — 4.500 XP</button>` : ""}
          ${animal.bloqueado ? `<p class="aviso">Esta criatura está bloqueada e ainda não pode ser escolhida.</p>` : ""}
          <div class="campo"><label for="forma-animal-ativa">Selecionar forma</label><select id="forma-animal-ativa">${Object.entries(ANIMAIS_METAMORFO).map(([n,a])=>`<option value="${n}" ${n===ficha.animalMetamorfo?"selected":""} ${a.bloqueado?"disabled":""}>${n}${a.bloqueado?" — bloqueado":""}</option>`).join("")}</select></div>
          <div class="grade">${ARVORE_METAMORFO.map(n=>`<article class="ficha-bloco"><h4>${n.nome}</h4><p>${n.efeito}</p><p><strong>${n.custo.toLocaleString("pt-BR")} XP</strong></p>${compras.includes(n.id)?'<span class="etiqueta">Adquirida</span>':`<button data-comprar-metamorfo="${n.id}">Desbloquear</button>`}</article>`).join("")}</div>
          <p>XP disponível: <strong>${(Number(ficha.xp)||0).toLocaleString("pt-BR")}</strong></p>
          <p class="aviso">Transformar-se consome 1 turno e 1 PE. As formas comuns não custam XP; formas históricas custam 4.500 XP para desbloquear.</p>
          <button id="transformar-metamorfo" ${ficha.peAtual<1?"disabled":""}>${ficha.transformado?"Voltar à forma original":"Transformar-se (1 turno + 1 PE)"}</button>
          ${ficha.transformado && animal.voo?`<p class="voo-aviso">Habilidade: Voar — enquanto estiver no ar, recebe +2 de Agilidade.</p><button id="alternar-voo" class="secundario">${ficha.voando?"Pousar":"Voar"}</button>`:""}
          <div class="ficha-bloco"><strong>Bônus da forma:</strong> ${animal.atributos?Object.entries(animal.atributos).map(([k,v])=>`${k} +${v}`).join(" · "):"—"}</div>`;
        area.appendChild(tree);
        tree.querySelector("#forma-animal-ativa")?.addEventListener("change", e=>{
            const novo = e.target.value, a = ANIMAIS_METAMORFO[novo];
            if(a.tipo==="historico" && !a.bloqueado && !(ficha.animaisDesbloqueados||[]).includes(novo)) {
                ficha.animalMetamorfo=novo; salvarPersonagem(ficha); mostrarFicha(ficha,abaInicial); return;
            }
            ficha.animalMetamorfo=novo; ficha.transformado=false; salvarPersonagem(ficha); mostrarFicha(ficha,abaInicial);
        });
        tree.querySelector("#desbloquear-animal")?.addEventListener("click",()=>{
            const custo=4500;
            if(ficha.xp<custo){alert("Você precisa de 4.500 XP.");return;}
            ficha.xp-=custo;
            ficha.animaisDesbloqueados=[...(ficha.animaisDesbloqueados||[]),ficha.animalMetamorfo];
            salvarPersonagem(ficha); mostrarFicha(ficha,abaInicial);
        });
        tree.querySelectorAll("[data-comprar-metamorfo]").forEach(btn=>btn.onclick=()=>{
            const node=ARVORE_METAMORFO.find(n=>n.id===btn.dataset.comprarMetamorfo);
            if(!node || compras.includes(node.id)) return;
            if(ficha.xp<node.custo){alert(`Você precisa de ${node.custo.toLocaleString("pt-BR")} XP.`);return;}
            ficha.xp-=node.custo; ficha.arvoreMetamorfo.compras.push(node.id);
            salvarPersonagem(ficha); mostrarFicha(ficha,abaInicial);
        });
        tree.querySelector("#alternar-voo")?.addEventListener("click",()=>{
            ficha.voando = !ficha.voando; salvarPersonagem(ficha); mostrarFicha(ficha,abaInicial);
        });
        tree.querySelector("#transformar-metamorfo")?.addEventListener("click",()=>{
            if(!ficha.transformado) {
                if(animal.tipo==="historico" && !(ficha.animaisDesbloqueados||[]).includes(ficha.animalMetamorfo)){alert("Desbloqueie esta forma primeiro.");return;}
                if(ficha.peAtual<1){alert("Você precisa de 1 PE.");return;}
                ficha.peAtual-=1; ficha.transformado=true; ficha.voando=false;
            } else { ficha.transformado=false; ficha.voando=false; }
            salvarPersonagem(ficha); mostrarFicha(ficha,abaInicial);
        });
    }
    const racaInfo = document.createElement("p");
    racaInfo.className = "etiqueta etiqueta-raca";
    racaInfo.textContent = `Raça: ${ficha.raca || "Humano"}`;
    const header = conteudo.querySelector("h2");
    if(header) header.after(racaInfo);
};

const mostrarRegrasAltavento = mostrarRegras;
mostrarRegras = function() {
    mostrarRegrasAltavento();
    const secao = document.createElement("section");
    secao.className = "secao";
    secao.innerHTML = `
      <h3>Raças</h3>
      <p><strong>Humano:</strong> sem modificadores.</p>
      <p><strong>Antropomórficos:</strong> sem modificadores.</p>
      <p><strong>Esqueleto:</strong> -25% PV, deve obrigatoriamente possuir o elemento Osso e causa +2 dano de Osso.</p>
      <p><strong>Metamorfo:</strong> -20% PV. Não possui trilhas de classe: compra habilidades em sua árvore própria com XP. Transformar-se custa 1 turno e 1 PE.</p>
      <p><strong>Elfo:</strong> +30% PE, -15% PV e +2 dano mágico.</p>
    `;
    conteudo.appendChild(secao);
    const armas = document.createElement("section");
    armas.className = "secao";
    armas.innerHTML = `
      <h3>Armas e dano-base</h3>
      <p><strong>Crossbow:</strong> 2d8 · <strong>Arco e flecha:</strong> 1d6 · <strong>Espada:</strong> 1d6.</p>
      <p>O inventário também inclui revólver, espingarda, rifle, machadinha, machado de lenhador, faca de caça, chicote, lança e martelo de guerra. Consulte a descrição de cada item para dano e peso.</p>
    `;
    conteudo.appendChild(armas);
};
