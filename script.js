"use strict";
const conteudo = document.getElementById("conteudo");

const CHAVES = {
    personagens: "rpg_personagens",
    monstros: "rpg_monstros",
    personagemAntigo: "titas_ficha"
};

const NIVEL_MAXIMO = 20;
const XP_INICIAL_POR_NIVEL = 20000;
const XP_MAXIMO_MONSTRO = 200000;

const atributos = [
    { sigla: "FOR", nome: "Força" },
    { sigla: "AGI", nome: "Agilidade" },
    { sigla: "VIG", nome: "Vigor" },
    { sigla: "INT", nome: "Inteligência" },
    { sigla: "PRE", nome: "Presença" },
    { sigla: "ESP", nome: "Espírito" }
];

const valoresIniciais = {
    FOR: 3,
    AGI: 2,
    VIG: 2,
    INT: 1,
    PRE: 1,
    ESP: 0
};

const pericias = [
    "Atletismo",
    "Luta",
    "Pontaria",
    "Furtividade",
    "Investigação",
    "Tecnologia",
    "Medicina",
    "Persuasão",
    "Enganação",
    "Ocultismo",
    "Sobrevivência",
    "Percepção"
];



const classes = {
    Combatente: {
        pv: 16,
        pe: 4,
        pvPorNivel: 5,
        pePorNivel: 1,
        habilidade: "Uma vez por combate, cause +1d4 de dano. Custa 2 PE."
    },

    Conjurador: {
        pv: 10,
        pe: 8,
        pvPorNivel: 3,
        pePorNivel: 3,
        habilidade: "Especialista em poderes e ataques mágicos."
    },

    Trapaceiro: {
        pv: 12,
        pe: 6,
        pvPorNivel: 4,
        pePorNivel: 2,
        habilidade: "Recebe vantagem em Furtividade ou Enganação."
    },

    Suporte: {
        pv: 12,
        pe: 7,
        pvPorNivel: 4,
        pePorNivel: 2,
        habilidade: "Pode recuperar 1d6 PV de um aliado por 2 PE."
    },

    Investigador: {
        pv: 12,
        pe: 6,
        pvPorNivel: 4,
        pePorNivel: 2,
        habilidade: "Pode fazer uma pergunta ao mestre sobre uma pista."
    },

    "Agente do Caos": {
        pv: 14,
        pe: 7,
        pvPorNivel: 4,
        pePorNivel: 2,
        habilidade: "Pode repetir um teste que acabou de falhar."
    }
};


const progressaoClasses = {
    Combatente: {
        3: {
            nome: "Golpe Pesado",
            descricao: "Uma vez por turno, gaste 2 PE para causar +1d6 de dano."
        },
        5: {
            nome: "Casca Grossa",
            descricao: "Reduza em 2 o dano recebido de ataques físicos."
        },
        8: {
            nome: "Contra-ataque",
            descricao: "Uma vez por combate, cause +2d6 no próximo golpe depois de sofrer um ataque."
        },
        10: {
            nome: "Veterano de Guerra",
            descricao: "Recebe +2 de dano físico adicional."
        },
        13: {
            nome: "Último Fôlego",
            descricao: "Uma vez por combate, ao chegar a 0 PV, fique com 1 PV."
        },
        15: {
            nome: "Execução",
            descricao: "Uma vez por combate, um ataque causa +3d6 de dano."
        },
        20: {
            nome: "Lenda de Batalha",
            descricao: "Uma vez por combate, use Golpe Pesado sem custo e dobre seu bônus de dano."
        }
    },

    Conjurador: {
        3: {
            nome: "Canalização",
            descricao: "Uma vez por combate, reduza em 2 PE o custo de um poder."
        },
        5: {
            nome: "Magia Potente",
            descricao: "Uma vez por turno, pague 2 PE para adicionar +1d6 ao dano de um poder."
        },
        8: {
            nome: "Reserva Arcana",
            descricao: "Uma vez por combate, recupere 4 PE."
        },
        10: {
            nome: "Especialista Elemental",
            descricao: "Poderes que exploram uma fraqueza elemental causam +1d6 de dano."
        },
        13: {
            nome: "Conjuração Eficiente",
            descricao: "Uma vez por combate, use um poder de nível 1 sem gastar PE."
        },
        15: {
            nome: "Sobrecarga",
            descricao: "Gaste 4 PE para adicionar +2d6 ao dano de um poder."
        },
        20: {
            nome: "Arquimago",
            descricao: "Uma vez por combate, um poder causa +3d6 de dano sem custo adicional."
        }
    },

    Trapaceiro: {
        3: {
            nome: "Ataque Oportunista",
            descricao: "Uma vez por turno, cause +1d6 de dano ao atacar com vantagem."
        },
        5: {
            nome: "Passo Ligeiro",
            descricao: "Uma vez por combate, evite completamente um ataque."
        },
        8: {
            nome: "Ponto Fraco",
            descricao: "Uma vez por turno, ignore 2 pontos da Defesa do alvo em um ataque."
        },
        10: {
            nome: "Desaparecer",
            descricao: "Gaste 3 PE para obter vantagem em Furtividade ou escapar de uma situação perigosa."
        },
        13: {
            nome: "Golpe Preciso",
            descricao: "Uma vez por combate, cause +3d6 de dano em um ataque com vantagem."
        },
        15: {
            nome: "Sorte Preparada",
            descricao: "Uma vez por combate, repita um teste e fique com o melhor resultado."
        },
        20: {
            nome: "Fantasma",
            descricao: "Uma vez por combate, evite um ataque e cause +3d6 de dano no próximo ataque."
        }
    },

    Suporte: {
        3: {
            nome: "Primeiros Socorros",
            descricao: "Gaste 2 PE para curar 1d8 PV de um aliado."
        },
        5: {
            nome: "Proteção em Equipe",
            descricao: "Uma vez por combate, reduza em 2 o dano recebido por um aliado."
        },
        8: {
            nome: "Pulso Revigorante",
            descricao: "Uma vez por combate, cure 2d8 PV divididos entre aliados."
        },
        10: {
            nome: "Especialista em Recuperação",
            descricao: "Suas curas recuperam +1d6 PV."
        },
        13: {
            nome: "Barreira Protetora",
            descricao: "Gaste 4 PE para conceder 5 PV temporários a um aliado até o fim da cena."
        },
        15: {
            nome: "Reerguer",
            descricao: "Uma vez por combate, um aliado com 0 PV volta com 1d8 PV."
        },
        20: {
            nome: "Pilar do Grupo",
            descricao: "Uma vez por combate, cure 3d8 PV de um aliado e conceda 5 PV temporários."
        }
    },

    Investigador: {
        3: {
            nome: "Olho Clínico",
            descricao: "Uma vez por cena, faça ao mestre uma pergunta adicional sobre uma pista."
        },
        5: {
            nome: "Análise de Fraqueza",
            descricao: "Uma vez por combate, descubra uma fraqueza ou resistência de um inimigo."
        },
        8: {
            nome: "Plano de Ação",
            descricao: "Uma vez por combate, um aliado recebe +2 em um teste importante."
        },
        10: {
            nome: "Preparação",
            descricao: "No início do combate, o primeiro ataque de um aliado contra um inimigo escolhido causa +1d6."
        },
        13: {
            nome: "Leitura de Combate",
            descricao: "Uma vez por combate, revele ao grupo uma informação tática útil."
        },
        15: {
            nome: "Estratégia Perfeita",
            descricao: "Uma vez por combate, dois aliados recebem +2 no próximo teste."
        },
        20: {
            nome: "Mente Mestra",
            descricao: "Uma vez por combate, conceda +2 em um teste de até três aliados."
        }
    },

    "Agente do Caos": {
        3: {
            nome: "Imprevisível",
            descricao: "Uma vez por combate, repita um teste que acabou de falhar."
        },
        5: {
            nome: "Caos Controlado",
            descricao: "Uma vez por combate, adicione +1d6 ao dano ou reduza o dano recebido em 1d6."
        },
        8: {
            nome: "Virada Impossível",
            descricao: "Uma vez por combate, transforme uma falha por pouco em sucesso, a critério do mestre."
        },
        10: {
            nome: "Aposta Alta",
            descricao: "Gaste 3 PE para receber +2 em um teste; se falhar, sofra 1d6 de dano."
        },
        13: {
            nome: "Efeito Dominó",
            descricao: "Uma vez por combate, depois de um sucesso importante, conceda +1 no teste de um aliado."
        },
        15: {
            nome: "Risco Calculado",
            descricao: "Uma vez por combate, repita um teste e some +2 ao novo resultado."
        },
        20: {
            nome: "Caos Absoluto",
            descricao: "Uma vez por combate, repita um teste falho com +2 e recupere 3 PE se tiver sucesso."
        }
    }
};


const elementos = {
    Grama: {
        fortes: ["Água", "Osso"],
        fracos: ["Fogo", "Gelo"]
    },
    Gelo: {
        fortes: ["Grama", "Ar"],
        fracos: ["Fogo", "Metal"]
    },
    Ar: {
        fortes: ["Grama", "Fadas"],
        fracos: ["Gelo", "Água", "Elétrico"]
    },
    Água: {
        fortes: ["Fogo", "Terrestre"],
        fracos: ["Grama", "Elétrico"]
    },
    Fogo: {
        fortes: ["Grama", "Escuridão", "Gelo"],
        fracos: ["Água", "Luz"]
    },
    Etéreo: {
        fortes: ["Osso", "Psíquico"],
        fracos: ["Luz"]
    },
    Psíquico: {
        fortes: ["Fadas", "Luz"],
        fracos: ["Etéreo", "Escuridão"]
    },
    Osso: {
        fortes: ["Fadas", "Escuridão"],
        fracos: ["Grama", "Luz", "Etéreo"]
    },
    Fadas: {
        fortes: ["Escuridão", "Terrestre"],
        fracos: ["Ar", "Psíquico", "Osso"]
    },
    Luz: {
        fortes: ["Escuridão", "Etéreo", "Osso"],
        fracos: ["Fogo", "Psíquico"]
    },
    Escuridão: {
        fortes: ["Psíquico", "Luz"],
        fracos: ["Fogo", "Osso", "Fadas"]
    },
    Terrestre: {
        fortes: ["Elétrico", "Metal"],
        fracos: ["Água", "Fadas"]
    },
    Elétrico: {
        fortes: ["Água", "Ar"],
        fracos: ["Terrestre", "Grama"]
    },
    Dragônico: {
        fortes: ["Ar", "Fogo"],
        fracos: ["Gelo", "Psíquico"]
    },
    Metal: {
        fortes: ["Gelo", "Fadas"],
        fracos: ["Fogo", "Terrestre", "Elétrico"]
    }
};



const catalogoItens = {
    "Armadura Reforçada": {
        descricao: "+2 Defesa",
        defesa: 2
    },
    "Escudo do Guardião": {
        descricao: "+2 Defesa; ocupa uma mão e é focado em proteção.",
        defesa: 2
    },
    "Peitoral de Titã": {
        descricao: "+3 Defesa; armadura pesada.",
        defesa: 3
    },
    "Manto das Sombras": {
        descricao: "+1 Defesa e +1 em testes de Furtividade.",
        defesa: 1
    },
    "Anel de Aço": {
        descricao: "+1 Defesa.",
        defesa: 1
    },
    "Núcleo Vital": {
        descricao: "+4 PV máximos",
        pv: 4
    },
    "Cristal de Energia": {
        descricao: "+3 PE máximos",
        pe: 3
    },
    "Lâmina de Ferro": {
        descricao: "+2 dano físico",
        danoFisico: 2
    },
    "Botas Leves": {
        descricao: "+1 Agilidade e +1 Defesa",
        agi: 1,
        defesa: 1
    },
    "Amuleto Vital": {
        descricao: "+2 PV máximos",
        pv: 2
    },
    "Essência Elemental": {
        descricao: "Permite melhorar um poder além do limite do nível",
        essencia: true
    },
    "Orbe d'O Primeiro": {
        descricao: "Consumível: concede +1 ponto de Determinação.",
        determinacao: 1,
        consumivel: true
    },
    "Espírito d'O Primeiro": {
        descricao: "Relíquia rara: permite ao personagem obter um elemento adicional, além do elemento inicial.",
        elementoAdicional: true
    }
};

const classificacoesMonstro = [
    "Titã",
    "Comum",
    "Humano",
    "Pseudo-Titã"
];



function idNovo() {
    return Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8);
}

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function lerLista(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function gravarLista(chave, lista) {
    try {
        localStorage.setItem(chave, JSON.stringify(lista));
        return true;
    } catch {
        alert("Não foi possível salvar. O armazenamento do navegador pode estar cheio.");
        return false;
    }
}

function numeroSeguro(valor, minimo = 0, maximo = 999999999) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return minimo;
    return Math.max(minimo, Math.min(maximo, numero));
}

function rolarDados(expressao) {
    const combinacao = String(expressao).trim().match(/^(\d+)d(\d+)$/i);

    if (!combinacao) return 0;

    const quantidade = numeroSeguro(combinacao[1], 1, 100);
    const faces = numeroSeguro(combinacao[2], 2, 1000);

    let total = 0;

    for (let i = 0; i < quantidade; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }

    return total;
}


function novoPersonagem() {
    const ficha = {
        id: idNovo(),
        nome: "",
        classe: "Combatente",
        nivel: 1,
        xp: 0,
        elemento: "Grama",
        atributos: { ...valoresIniciais },
        pericias: [],
        itens: [],
        poderes: [],
        peAtual: null,
        pvAtual: null
    };

    return normalizarPersonagem(ficha);
}

function normalizarPersonagem(ficha) {
    ficha.id ||= idNovo();
    ficha.nome ||= "Personagem sem nome";

    if (!classes[ficha.classe]) {
        ficha.classe = "Combatente";
    }

    ficha.nivel = numeroSeguro(ficha.nivel || 1, 1, NIVEL_MAXIMO);
    ficha.xp = numeroSeguro(ficha.xp || 0, 0, 999999999);

    if (!elementos[ficha.elemento]) {
        ficha.elemento = "Grama";
    }

    ficha.atributos = ficha.atributos || { ...valoresIniciais };
    ficha.pericias = Array.isArray(ficha.pericias) ? ficha.pericias : [];
    ficha.itens = Array.isArray(ficha.itens) ? ficha.itens : [];
    ficha.poderes = Array.isArray(ficha.poderes) ? ficha.poderes : [];
    ficha.armeiro = ficha.armeiro && typeof ficha.armeiro === "object" ? ficha.armeiro : { nome: "", dano: "1d8", ajuste: "nenhum", valor: 0 };
    ficha.arvore = ficha.arvore && typeof ficha.arvore === "object" ? ficha.arvore : { caminho: "", nivel: 0, compras: [] };


    for (const atributo of atributos) {
        ficha.atributos[atributo.sigla] =
            numeroSeguro(ficha.atributos[atributo.sigla] ?? 0, 0, 15);
    }

    if (ficha.classe !== "Conjurador") {
        ficha.poderes = ficha.poderes.filter(poder =>
            poder.nome !== "Habilidade de Natureza"
        );
    }

    const stats = calcular(ficha);

    if (ficha.pvAtual === null || ficha.pvAtual === undefined) {
        ficha.pvAtual = stats.pv;
    } else {
        ficha.pvAtual = numeroSeguro(ficha.pvAtual, 0, stats.pv);
    }

    if (ficha.peAtual === null || ficha.peAtual === undefined) {
        ficha.peAtual = stats.pe;
    } else {
        ficha.peAtual = numeroSeguro(ficha.peAtual, 0, stats.pe);
    }

    return ficha;
}

function carregarPersonagens() {
    let lista = lerLista(CHAVES.personagens);

    if (lista.length === 0) {
        try {
            const antiga = JSON.parse(
                localStorage.getItem(CHAVES.personagemAntigo)
            );

            if (antiga && typeof antiga === "object") {
                lista = [normalizarPersonagem(antiga)];
                gravarLista(CHAVES.personagens, lista);
            }
        } catch {
            // Nenhuma ficha antiga válida.
        }
    }

    return lista.map(normalizarPersonagem);
}

function salvarPersonagem(ficha) {
    ficha = normalizarPersonagem(ficha);

    const lista = carregarPersonagens();
    const indice = lista.findIndex(personagem => personagem.id === ficha.id);

    if (indice >= 0) {
        lista[indice] = ficha;
    } else {
        if (lista.length >= 20) {
            alert("Você já atingiu o limite de 20 personagens.");
            return false;
        }

        lista.push(ficha);
    }

    return gravarLista(CHAVES.personagens, lista);
}

function removerPersonagem(id) {
    const lista = carregarPersonagens().filter(ficha => ficha.id !== id);
    gravarLista(CHAVES.personagens, lista);
}



function xpNecessario(nivel) {
    return (Number(nivel) + 1) * 10000;
}

function adicionarXP(ficha, quantidade) {
    quantidade = numeroSeguro(quantidade, 0, 999999999);

    if (ficha.nivel >= NIVEL_MAXIMO || quantidade <= 0) {
        return {
            niveisGanhos: 0,
            xpGanho: 0
        };
    }

    ficha.xp = numeroSeguro(ficha.xp || 0) + quantidade;

    let niveisGanhos = 0;

    while (
        ficha.nivel < NIVEL_MAXIMO &&
        ficha.xp >= xpNecessario(ficha.nivel)
    ) {
        ficha.xp -= xpNecessario(ficha.nivel);
        ficha.nivel++;
        niveisGanhos++;

        const stats = calcular(ficha);

        // Ao subir de nível, ganha os PV e PE adicionais.
        ficha.pvAtual = Math.min(
            stats.pv,
            numeroSeguro(ficha.pvAtual || 0) +
                progressaoClasses[ficha.classe] &&
                progressaoClasses[ficha.classe].pvPorNivel
                ? (Number(ficha.pvAtual) || 0) +
                    progressaoClasses[ficha.classe].pvPorNivel
                : (Number(ficha.pvAtual) || 0)
        );

        ficha.peAtual = Math.min(
            stats.pe,
            (Number(ficha.peAtual) || 0) +
                (classes[ficha.classe].pePorNivel || 0)
        );
    }

    if (ficha.nivel >= NIVEL_MAXIMO) {
        ficha.xp = 0;
    }

    salvarPersonagem(ficha);

    return {
        niveisGanhos,
        xpGanho: quantidade
    };
}


function calcular(ficha) {
    const classe = classes[ficha.classe] || classes.Combatente;
    const nivel = numeroSeguro(ficha.nivel || 1, 1, NIVEL_MAXIMO);

    const contar = nome => ficha.itens.filter(item =>
        item.toLowerCase() === nome.toLowerCase()
    ).length;

    const bonusPV =
        contar("Núcleo Vital") * 4 +
        contar("Amuleto Vital") * 2;

    const bonusPE = contar("Cristal de Energia") * 3;
    const bonusAGI = contar("Botas Leves");
    const bonusDefesa =
        contar("Armadura Reforçada") * 2 +
        contar("Escudo do Guardião") * 2 +
        contar("Peitoral de Titã") * 3 +
        contar("Manto das Sombras") +
        contar("Anel de Aço") + bonusAGI;

    const bonusDano =
        contar("Lâmina de Ferro") * 2 +
        (ficha.classe === "Combatente" && nivel >= 10 ? 2 : 0);

    return {
        pv:
            classe.pv +
            2 * Number(ficha.atributos.VIG || 0) +
            bonusPV +
            (classe.pvPorNivel || 0) * (nivel - 1),

        pe:
            classe.pe +
            2 * Number(ficha.atributos.ESP || 0) +
            bonusPE +
            (classe.pePorNivel || 0) * (nivel - 1),

        defesa:
            8 +
            Number(ficha.atributos.AGI || 0) +
            bonusDefesa,

        danoFisico: bonusDano
    };
}


function habilidadesDesbloqueadas(ficha) {
    const progressao = progressaoClasses[ficha.classe] || {};
    const nivel = Number(ficha.nivel) || 1;

    return Object.entries(progressao)
        .filter(([nivelHabilidade]) =>
            Number(nivelHabilidade) <= nivel
        )
        .map(([nivelHabilidade, habilidade]) => ({
            nivel: Number(nivelHabilidade),
            ...habilidade
        }));
}

function proximasHabilidades(ficha) {
    const progressao = progressaoClasses[ficha.classe] || {};
    const nivel = Number(ficha.nivel) || 1;

    return Object.entries(progressao)
        .filter(([nivelHabilidade]) =>
            Number(nivelHabilidade) > nivel
        )
        .map(([nivelHabilidade, habilidade]) => ({
            nivel: Number(nivelHabilidade),
            ...habilidade
        }));
}

function renderizarProgressao(ficha) {
    const stats = calcular(ficha);
    const desbloqueadas = habilidadesDesbloqueadas(ficha);
    const proximas = proximasHabilidades(ficha);
    const proximoXP = ficha.nivel < NIVEL_MAXIMO
        ? xpNecessario(ficha.nivel)
        : 0;

    const porcentagemXP = ficha.nivel >= NIVEL_MAXIMO
        ? 100
        : Math.min(100, ficha.xp / proximoXP * 100);

    return `
        <section class="secao">
            <h3>Progressão — Nível ${ficha.nivel}</h3>

            <p><strong>PV máximos:</strong> ${stats.pv}</p>
            <p><strong>PV atuais:</strong> ${ficha.pvAtual}</p>
            <p><strong>PE máximos:</strong> ${stats.pe}</p>
            <p><strong>PE atuais:</strong> ${ficha.peAtual}</p>

            ${
                ficha.nivel < NIVEL_MAXIMO
                    ? `
                        <p>
                            XP: ${ficha.xp.toLocaleString("pt-BR")}
                            /
                            ${proximoXP.toLocaleString("pt-BR")}
                        </p>
                        <div style="background:#ddd;border-radius:8px;overflow:hidden;height:12px">
                            <div style="height:12px;width:${porcentagemXP}%;background:#57915c"></div>
                        </div>
                    `
                    : "<p><strong>Nível máximo alcançado!</strong></p>"
            }

            <h4>Habilidades desbloqueadas</h4>

            ${
                desbloqueadas.length
                    ? desbloqueadas.map(habilidade => `
                        <div class="ficha-bloco">
                            <strong>
                                Nível ${habilidade.nivel} —
                                ${escaparHTML(habilidade.nome)}
                            </strong>
                            <p>${escaparHTML(habilidade.descricao)}</p>
                        </div>
                    `).join("")
                    : "<p>Nenhuma habilidade adicional desbloqueada ainda.</p>"
            }

            <h4>Próximos desbloqueios</h4>

            ${
                proximas.length
                    ? proximas.map(habilidade => `
                        <div class="ficha-bloco">
                            <strong>
                                Nível ${habilidade.nivel} —
                                ${escaparHTML(habilidade.nome)}
                            </strong>
                            <p>${escaparHTML(habilidade.descricao)}</p>
                        </div>
                    `).join("")
                    : "<p>Todas as habilidades da classe foram desbloqueadas.</p>"
            }
        </section>
    `;
}



function mostrarInicio() {
    conteudo.innerHTML = `
        <h2>Bem-vinde ao RPG!</h2>
        <p>Resenha Pro Grupo — escolha uma área para continuar.</p>

        <div class="grade">
            <div class="ficha-bloco">
                <h3>Personagens</h3>
                <p>Crie e organize fichas, classes, poderes, itens e níveis.</p>
                <button id="abrir-personagens">Abrir personagens</button>
            </div>

            <div class="ficha-bloco">
                <h3>Monstros</h3>
                <p>Crie criaturas e configure o XP recebido ao derrotá-las.</p>
                <button id="abrir-monstros">Criador de monstros</button>
            </div>

            <div class="ficha-bloco">
                <h3>Livro de Regras</h3>
                <p>Consulte atributos, perícias, XP, classes e combate.</p>
                <button id="abrir-regras">Consultar regras</button>
            </div>
        </div>

        <p class="aviso">
            Seus dados ficam salvos neste navegador.
        </p>
    `;

    document.getElementById("abrir-personagens").onclick =
        mostrarPersonagens;

    document.getElementById("abrir-monstros").onclick =
        mostrarMonstros;

    document.getElementById("abrir-regras").onclick =
        mostrarRegras;
}

function botaoVoltar() {
    return `
        <div class="acoes">
            <button id="voltar-inicio" class="secundario">
                Voltar ao menu
            </button>
        </div>
    `;
}

function ligarVoltar() {
    const botao = document.getElementById("voltar-inicio");

    if (botao) {
        botao.onclick = mostrarInicio;
    }
}



function mostrarPersonagens() {
    const lista = carregarPersonagens();

    conteudo.innerHTML = `
        <h2>Personagens (${lista.length}/20)</h2>
        <p>Suas fichas salvas neste navegador.</p>

        <div class="acoes">
            <button id="novo-personagem" ${lista.length >= 20 ? "disabled" : ""}>
                Criar personagem
            </button>
            <button id="voltar-inicio" class="secundario">
                Voltar ao menu
            </button>
        </div>

        <div id="lista-personagens"></div>
    `;

    document.getElementById("novo-personagem").onclick = () => {
        abrirEditor(novoPersonagem());
    };

    ligarVoltar();

    const area = document.getElementById("lista-personagens");

    if (!lista.length) {
        area.innerHTML = `
            <p class="vazio">Você ainda não criou personagens.</p>
        `;
        return;
    }

    area.innerHTML = lista.map(ficha => `
        <div class="item-linha">
            <div>
                <strong>${escaparHTML(ficha.nome)}</strong>
                <p>
                    ${escaparHTML(ficha.classe)}
                    · Nível ${ficha.nivel}
                    · ${escaparHTML(ficha.elemento)}
                </p>
            </div>

            <div class="acoes">
                <button data-abrir="${ficha.id}">Abrir ficha</button>
                <button class="secundario" data-editar="${ficha.id}">
                    Editar
                </button>
                <button class="perigo" data-excluir="${ficha.id}">
                    Excluir
                </button>
            </div>
        </div>
    `).join("");

    area.querySelectorAll("[data-abrir]").forEach(botao => {
        botao.onclick = () => {
            const ficha = carregarPersonagens().find(
                personagem => personagem.id === botao.dataset.abrir
            );

            if (ficha) mostrarFicha(ficha);
        };
    });

    area.querySelectorAll("[data-editar]").forEach(botao => {
        botao.onclick = () => {
            const ficha = carregarPersonagens().find(
                personagem => personagem.id === botao.dataset.editar
            );

            if (ficha) abrirEditor(ficha);
        };
    });

    area.querySelectorAll("[data-excluir]").forEach(botao => {
        botao.onclick = () => {
            const ficha = lista.find(
                personagem => personagem.id === botao.dataset.excluir
            );

            if (
                ficha &&
                confirm(`Excluir o personagem "${ficha.nome}"?`)
            ) {
                removerPersonagem(ficha.id);
                mostrarPersonagens();
            }
        };
    });
}



function abrirEditor(ficha) {
    const editando = carregarPersonagens().some(
        personagem => personagem.id === ficha.id
    );

    conteudo.innerHTML = `
        <h2>${editando ? "Editar personagem" : "Criar personagem"}</h2>

        <div class="campo">
            <label for="nome">Nome</label>
            <input
                id="nome"
                maxlength="30"
                value="${escaparHTML(ficha.nome)}"
                placeholder="Nome do personagem"
            >
        </div>

        <div class="grade">
            <div class="campo">
                <label for="classe">Classe</label>
                <select id="classe">
                    ${Object.keys(classes).map(classe => `
                        <option
                            value="${escaparHTML(classe)}"
                            ${ficha.classe === classe ? "selected" : ""}
                        >
                            ${escaparHTML(classe)}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="campo">
                <label for="elemento">Elemento principal</label>
                <select id="elemento">
                    ${Object.keys(elementos).map(elemento => `
                        <option
                            value="${escaparHTML(elemento)}"
                            ${ficha.elemento === elemento ? "selected" : ""}
                        >
                            ${escaparHTML(elemento)}
                        </option>
                    `).join("")}
                </select>
            </div>
        </div>

        <section class="secao">
            <h3>Atributos</h3>
            <p>Distribua +3, +2, +2, +1, +1 e +0, usando cada valor uma vez.</p>

            <div class="grade-atributos">
                ${atributos.map(atributo => `
                    <div class="atributo">
                        <label for="attr-${atributo.sigla}">
                            ${atributo.sigla} — ${atributo.nome}
                        </label>

                        <select id="attr-${atributo.sigla}" class="attr">
                            ${[0, 1, 2, 3].map(valor => `
                                <option
                                    value="${valor}"
                                    ${
                                        Number(ficha.atributos[atributo.sigla]) === valor
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    +${valor}
                                </option>
                            `).join("")}
                        </select>
                    </div>
                `).join("")}
            </div>

            <p id="aviso-attr" class="aviso"></p>
        </section>

        <section class="secao">
            <h3>Perícias treinadas</h3>
            <p>Escolha exatamente 3 perícias. Cada uma concede +2 nos testes relacionados.</p>

            <p>Selecionadas: <strong id="contador">0/3</strong></p>

            <div class="lista-pericias">
                ${pericias.map(pericia => `
                    <label class="pericia">
                        <input
                            type="checkbox"
                            name="pericia"
                            value="${escaparHTML(pericia)}"
                            ${ficha.pericias.includes(pericia) ? "checked" : ""}
                        >
                        ${escaparHTML(pericia)}
                    </label>
                `).join("")}
            </div>
        </section>

        <div class="acoes">
            <button id="salvar-personagem">
                ${editando ? "Salvar alterações" : "Criar personagem"}
            </button>
            <button id="cancelar" class="secundario">Cancelar</button>
        </div>
    `;

    const caixas = [...document.querySelectorAll('input[name="pericia"]')];

    function atualizarContador() {
        const selecionadas = caixas.filter(caixa => caixa.checked);

        document.getElementById("contador").textContent =
            `${selecionadas.length}/3`;

        caixas.forEach(caixa => {
            caixa.disabled =
                selecionadas.length >= 3 && !caixa.checked;
        });
    }

    caixas.forEach(caixa => {
        caixa.onchange = atualizarContador;
    });

    atualizarContador();

    document.getElementById("salvar-personagem").onclick = () => {
        const nome = document.getElementById("nome").value.trim();
        const classeAnterior = ficha.classe;
        const classeNova = document.getElementById("classe").value;

        if (!nome) {
            alert("Digite um nome para o personagem.");
            return;
        }

        const atributosEscolhidos = {};

        for (const atributo of atributos) {
            atributosEscolhidos[atributo.sigla] = Number(
                document.getElementById(`attr-${atributo.sigla}`).value
            );
        }

        const soma = Object.values(atributosEscolhidos)
            .reduce((total, valor) => total + valor, 0);

        if (soma !== 9) {
            alert("A soma dos atributos deve ser 9.");
            return;
        }

        const selecionadas = caixas
            .filter(caixa => caixa.checked)
            .map(caixa => caixa.value);

        if (selecionadas.length !== 3) {
            alert("Escolha exatamente 3 perícias.");
            return;
        }

        ficha.nome = nome;
        ficha.classe = classeNova;
        ficha.elemento = document.getElementById("elemento").value;
        ficha.atributos = atributosEscolhidos;
        ficha.pericias = selecionadas;

        if (classeAnterior !== classeNova) {
            const statsAntigos = calcular({
                ...ficha,
                classe: classeAnterior
            });

            const statsNovos = calcular(ficha);

            ficha.pvAtual = Math.min(
                statsNovos.pv,
                Math.max(1, ficha.pvAtual || statsAntigos.pv)
            );

            ficha.peAtual = Math.min(
                statsNovos.pe,
                Math.max(0, ficha.peAtual || statsAntigos.pe)
            );
        }

        const stats = calcular(ficha);

        ficha.pvAtual = Math.min(
            Number(ficha.pvAtual ?? stats.pv),
            stats.pv
        );

        ficha.peAtual = Math.min(
            Number(ficha.peAtual ?? stats.pe),
            stats.pe
        );

        if (salvarPersonagem(ficha)) {
            mostrarFicha(ficha);
        }
    };

    document.getElementById("cancelar").onclick = () => {
        if (editando) mostrarFicha(ficha);
        else mostrarPersonagens();
    };
}



function mostrarFicha(ficha, abaInicial = "geral") {
    ficha = normalizarPersonagem(ficha);

    const stats = calcular(ficha);

    conteudo.innerHTML = `
        <h2>${escaparHTML(ficha.nome)}</h2>

        <p>
            ${escaparHTML(ficha.classe)}
            · Nível ${ficha.nivel}
            · ${escaparHTML(ficha.elemento)}
        </p>

        <div class="acoes">
            <button id="salvar">Salvar ficha</button>
            <button id="editar" class="secundario">Editar personagem</button>
            <button id="voltar-lista" class="secundario">Voltar à lista</button>
            <button id="inicio" class="secundario">Menu inicial</button>
        </div>

        <div class="acoes">
            <button id="subir-nivel" ${ficha.nivel >= NIVEL_MAXIMO ? "disabled" : ""}>
                Subir nível manualmente
            </button>
        </div>

        <p id="mensagem" class="aviso"></p>

        <div class="abas">
            <button data-aba="geral">Geral</button>
            <button data-aba="progressao">Progressão</button>
            <button data-aba="poderes">Poderes</button>
            <button data-aba="itens">Inventário</button>
            <button data-aba="elementos">Elementos</button>
            <button data-aba="xp">XP</button>
        </div>

        <div id="conteudo-aba"></div>
    `;

    let aba = abaInicial;
    const area = document.getElementById("conteudo-aba");

    function renderizarAba() {
        if (aba === "geral") {
            const atualStats = calcular(ficha);

            area.innerHTML = `
                <section class="secao">
                    <h3>Características</h3>
                    <p><strong>Classe:</strong> ${escaparHTML(ficha.classe)}</p>
                    <p><strong>Nível:</strong> ${ficha.nivel}</p>
                    <p><strong>Elemento:</strong> ${escaparHTML(ficha.elemento)}</p>
                    <p><strong>PV:</strong> ${ficha.pvAtual}/${atualStats.pv}</p>
                    <p><strong>PE:</strong> ${ficha.peAtual}/${atualStats.pe}</p>
                    <div class="acoes">
                        <button data-recurso="pv" data-valor="-1">− 1 PV</button>
                        <button data-recurso="pv" data-valor="1">+ 1 PV</button>
                        <button data-recurso="pe" data-valor="-1">− 1 PE</button>
                        <button data-recurso="pe" data-valor="1">+ 1 PE</button>
                    </div>
                    <div class="campo">
                        <label for="quantidade-recurso">Alterar vários pontos de uma vez</label>
                        <input id="quantidade-recurso" type="number" min="1" value="5">
                    </div>
                    <div class="acoes">
                        <button data-recurso-lote="pv" data-valor="-1" class="perigo">Diminuir PV</button>
                        <button data-recurso-lote="pv" data-valor="1">Aumentar PV</button>
                        <button data-recurso-lote="pe" data-valor="-1" class="perigo">Diminuir PE</button>
                        <button data-recurso-lote="pe" data-valor="1">Aumentar PE</button>
                    </div>
                    <p><strong>Defesa:</strong> ${atualStats.defesa}</p>
                    <p><strong>Dano físico adicional:</strong> +${atualStats.danoFisico}</p>
                    <p><strong>Habilidade inicial:</strong> ${escaparHTML(classes[ficha.classe].habilidade)}</p>
                </section>

                <section class="secao">
                    <h3>Atributos</h3>
                    ${atributos.map(atributo => `
                        <p>
                            <strong>${atributo.sigla} — ${atributo.nome}:</strong>
                            +${ficha.atributos[atributo.sigla]}
                        </p>
                    `).join("")}
                </section>

                <section class="secao">
                    <h3>Perícias treinadas</h3>
                    ${
                        ficha.pericias.length
                            ? ficha.pericias.map(pericia => `
                                <span class="etiqueta">
                                    ${escaparHTML(pericia)} (+2)
                                </span>
                            `).join("")
                            : "<p>Nenhuma perícia treinada.</p>"
                    }
                </section>

                ${renderizarProgressao(ficha)}
            `;
        }

        if (aba === "progressao") {
            area.innerHTML = `
                ${renderizarProgressao(ficha)}

                <section class="secao">
                    <h3>Recuperar recursos</h3>
                    <p>Recupere PV ou PE manualmente.</p>

                    <div class="campo">
                        <label for="recuperar-pv">PV a recuperar</label>
                        <input id="recuperar-pv" type="number" min="0" value="0">
                    </div>

                    <button id="botao-recuperar-pv">Recuperar PV</button>

                    <div class="campo">
                        <label for="recuperar-pe">PE a recuperar</label>
                        <input id="recuperar-pe" type="number" min="0" value="0">
                    </div>

                    <button id="botao-recuperar-pe">Recuperar PE</button>
                </section>
            `;

            document.getElementById("botao-recuperar-pv").onclick = () => {
                const quantidade = numeroSeguro(
                    document.getElementById("recuperar-pv").value,
                    0
                );

                ficha.pvAtual = Math.min(
                    calcular(ficha).pv,
                    ficha.pvAtual + quantidade
                );

                salvarPersonagem(ficha);
                mostrarFicha(ficha, "progressao");
            };

            document.getElementById("botao-recuperar-pe").onclick = () => {
                const quantidade = numeroSeguro(
                    document.getElementById("recuperar-pe").value,
                    0
                );

                ficha.peAtual = Math.min(
                    calcular(ficha).pe,
                    ficha.peAtual + quantidade
                );

                salvarPersonagem(ficha);
                mostrarFicha(ficha, "progressao");
            };
        }

        if (aba === "xp") {
            const necessario = ficha.nivel < NIVEL_MAXIMO
                ? xpNecessario(ficha.nivel)
                : 0;

            area.innerHTML = `
                <section class="secao">
                    <h3>Experiência</h3>
                    <p>Nível atual: ${ficha.nivel}</p>
                    <p>XP atual: ${ficha.xp.toLocaleString("pt-BR")}</p>
                    ${
                        ficha.nivel < NIVEL_MAXIMO
                            ? `<p>XP necessário para subir: ${necessario.toLocaleString("pt-BR")}</p>`
                            : "<p>Nível máximo alcançado.</p>"
                    }

                    <div class="campo">
                        <label for="xp-manual">Adicionar XP</label>
                        <input id="xp-manual" type="number" min="0" max="999999999" value="0">
                    </div>

                    <button id="adicionar-xp-manual">Adicionar experiência</button>
                </section>
            `;

            document.getElementById("adicionar-xp-manual").onclick = () => {
                const quantidade = numeroSeguro(
                    document.getElementById("xp-manual").value,
                    0
                );

                if (quantidade <= 0) {
                    alert("Digite uma quantidade de XP maior que zero.");
                    return;
                }

                const resultado = adicionarXP(ficha, quantidade);

                if (resultado.niveisGanhos > 0) {
                    alert(
                        `${ficha.nome} subiu ${resultado.niveisGanhos} nível(is)!`
                    );
                } else {
                    alert(`${quantidade.toLocaleString("pt-BR")} XP adicionados.`);
                }

                mostrarFicha(ficha, "xp");
            };
        }

        if (aba === "poderes") {
            area.innerHTML = `
                <h3>Magias e poderes</h3>
                <p>Um poder causa Nd6 de dano, em que N é o nível do poder. Custa 2 PE por nível.</p>

                <div class="campo">
                    <label for="nome-poder">Nome do poder</label>
                    <input id="nome-poder" maxlength="50" placeholder="Ex.: Explosão de Fogo">
                </div>

                <div class="campo">
                    <label for="elemento-poder">Elemento</label>
                    <select id="elemento-poder">
                        ${Object.keys(elementos).map(elemento => `
                            <option
                                value="${escaparHTML(elemento)}"
                                ${elemento === ficha.elemento ? "selected" : ""}
                            >
                                ${escaparHTML(elemento)}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <button id="adicionar-poder">Aprender poder nível 1</button>
                <div id="lista-poderes"></div>
            `;

            const lista = document.getElementById("lista-poderes");

            function renderizarPoderes() {
                lista.innerHTML = ficha.poderes.length
                    ? ficha.poderes.map((poder, indice) => `
                        <div class="poder-linha">
                            <div>
                                <strong>
                                    ${escaparHTML(poder.nome)} — Nível ${poder.nivel}
                                </strong>
                                <p>Elemento: ${escaparHTML(poder.elemento)}</p>
                                <p>Dano: ${poder.nivel}d6 · Custo: ${poder.nivel * 2} PE</p>
                            </div>

                            <div class="acoes">
                                <button data-usar="${indice}">Usar poder</button>
                                <button class="secundario" data-melhorar="${indice}">
                                    Melhorar
                                </button>
                                <button class="perigo" data-apagar-poder="${indice}">
                                    Excluir
                                </button>
                            </div>
                        </div>
                    `).join("")
                    : "<p class='vazio'>Você ainda não tem poderes.</p>";

                lista.querySelectorAll("[data-usar]").forEach(botao => {
                    botao.onclick = () => {
                        const poder = ficha.poderes[Number(botao.dataset.usar)];
                        const custo = poder.nivel * 2;

                        if (ficha.peAtual < custo) {
                            alert("Você não tem PE suficientes!");
                            return;
                        }

                        ficha.peAtual -= custo;

                        const dano = rolarDados(`${poder.nivel}d6`);

                        salvarPersonagem(ficha);

                        alert(
                            `${poder.nome} ativado!\n` +
                            `Dano rolado: ${dano}\n` +
                            `PE restantes: ${ficha.peAtual}`
                        );

                        mostrarFicha(ficha, "poderes");
                    };
                });

                lista.querySelectorAll("[data-melhorar]").forEach(botao => {
                    botao.onclick = () => {
                        const poder = ficha.poderes[Number(botao.dataset.melhorar)];

                        const indiceEssencia = ficha.itens.findIndex(item =>
                            item.toLowerCase() === "essência elemental" ||
                            item.toLowerCase() === "essencia elemental"
                        );

                        if (
                            poder.nivel >= ficha.nivel &&
                            indiceEssencia < 0
                        ) {
                            alert("Você precisa subir de nível ou ter uma Essência Elemental.");
                            return;
                        }

                        if (poder.nivel >= ficha.nivel && indiceEssencia >= 0) {
                            ficha.itens.splice(indiceEssencia, 1);
                        }

                        poder.nivel++;
                        salvarPersonagem(ficha);
                        mostrarFicha(ficha, "poderes");
                    };
                });

                lista.querySelectorAll("[data-apagar-poder]").forEach(botao => {
                    botao.onclick = () => {
                        ficha.poderes.splice(
                            Number(botao.dataset.apagarPoder),
                            1
                        );

                        salvarPersonagem(ficha);
                        mostrarFicha(ficha, "poderes");
                    };
                });
            }

            document.getElementById("adicionar-poder").onclick = () => {
                const nome = document.getElementById("nome-poder").value.trim();
                const elemento = document.getElementById("elemento-poder").value;

                if (!nome) {
                    alert("Digite o nome do poder.");
                    return;
                }

                ficha.poderes.push({
                    nome,
                    elemento,
                    nivel: 1
                });

                salvarPersonagem(ficha);
                mostrarFicha(ficha, "poderes");
            };

            renderizarPoderes();
        }

        if (aba === "itens") {
            area.innerHTML = `
                <h3>Inventário</h3>

                <div class="campo">
                    <label for="novo-item">Item conhecido</label>
                    <select id="novo-item">
                        ${Object.keys(catalogoItens).map(nome => `
                            <option value="${escaparHTML(nome)}">
                                ${escaparHTML(nome)} — ${escaparHTML(catalogoItens[nome].descricao)}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <button id="adicionar-item">Adicionar item</button>

                <div class="campo">
                    <label for="item-personalizado">Item personalizado</label>
                    <input id="item-personalizado" maxlength="60" placeholder="Ex.: Chave enferrujada">
                    <button id="adicionar-personalizado">
                        Adicionar item personalizado
                    </button>
                </div>

                <div id="lista-itens"></div>
            `;

            const lista = document.getElementById("lista-itens");

            function renderizarItens() {
                lista.innerHTML = ficha.itens.length
                    ? ficha.itens.map((item, indice) => {
                        const efeito = catalogoItens[item];

                        return `
                            <div class="item-linha">
                                <div>
                                    <strong>${escaparHTML(item)}</strong>
                                    <p>
                                        ${
                                            efeito
                                                ? escaparHTML(efeito.descricao)
                                                : "Item personalizado — sem bônus automático."
                                        }
                                    </p>
                                </div>
                                <button class="perigo" data-remover-item="${indice}">
                                    Remover
                                </button>
                            </div>
                        `;
                    }).join("")
                    : "<p class='vazio'>Seu inventário está vazio.</p>";

                lista.querySelectorAll("[data-remover-item]").forEach(botao => {
                    botao.onclick = () => {
                        ficha.itens.splice(
                            Number(botao.dataset.removerItem),
                            1
                        );

                        const stats = calcular(ficha);

                        ficha.pvAtual = Math.min(ficha.pvAtual, stats.pv);
                        ficha.peAtual = Math.min(ficha.peAtual, stats.pe);

                        salvarPersonagem(ficha);
                        mostrarFicha(ficha, "itens");
                    };
                });
            }

            document.getElementById("adicionar-item").onclick = () => {
                ficha.itens.push(document.getElementById("novo-item").value);

                salvarPersonagem(ficha);
                mostrarFicha(ficha, "itens");
            };

            document.getElementById("adicionar-personalizado").onclick = () => {
                const nome = document.getElementById("item-personalizado").value.trim();

                if (!nome) {
                    alert("Digite o nome do item.");
                    return;
                }

                ficha.itens.push(nome);
                salvarPersonagem(ficha);
                mostrarFicha(ficha, "itens");
            };

            renderizarItens();
        }

        if (aba === "elementos") {
            area.innerHTML = `
                <h3>Elemento: ${escaparHTML(ficha.elemento)}</h3>

                <p>
                    <strong>Forte contra:</strong>
                    ${elementos[ficha.elemento].fortes.join(", ")}
                </p>

                <p>
                    <strong>Fraco contra:</strong>
                    ${elementos[ficha.elemento].fracos.join(", ")}
                </p>

                <h3>Tabela de elementos</h3>

                ${Object.keys(elementos).map(elemento => `
                    <div class="ficha-bloco">
                        <strong>${escaparHTML(elemento)}</strong>
                        <p>Forte contra: ${elementos[elemento].fortes.join(", ")}</p>
                        <p>Fraco contra: ${elementos[elemento].fracos.join(", ")}</p>
                    </div>
                `).join("")}

                <p class="aviso">
                    Multiplicador: ×1,5 contra fraqueza; ×0,5 contra resistência; ×1 nos demais casos.
                </p>
            `;
        }
    }

    area.onclick = evento => {
        const botao = evento.target.closest("[data-recurso], [data-recurso-lote]");
        if (!botao) return;
        const recurso = botao.dataset.recurso || botao.dataset.recursoLote;
        let quantidade = 1;
        if (botao.dataset.recursoLote) {
            quantidade = numeroSeguro(document.getElementById("quantidade-recurso")?.value || 1, 1, 999999);
        }
        const delta = quantidade * Number(botao.dataset.valor);
        const stats = calcular(ficha);
        if (recurso === "pv") ficha.pvAtual = Math.max(0, Math.min(stats.pv, ficha.pvAtual + delta));
        if (recurso === "pe") ficha.peAtual = Math.max(0, Math.min(stats.pe, ficha.peAtual + delta));
        salvarPersonagem(ficha);
        mostrarFicha(ficha, aba);
    };

    document.querySelectorAll("[data-aba]").forEach(botao => {
        botao.onclick = () => {
            aba = botao.dataset.aba;
            renderizarAba();
        };
    });

    document.getElementById("subir-nivel").onclick = () => {
        if (ficha.nivel >= NIVEL_MAXIMO) {
            alert("O personagem já está no nível máximo.");
            return;
        }

        ficha.nivel++;

        const stats = calcular(ficha);
        ficha.pvAtual = Math.min(
            stats.pv,
            ficha.pvAtual + (classes[ficha.classe].pvPorNivel || 0)
        );

        ficha.peAtual = Math.min(
            stats.pe,
            ficha.peAtual + (classes[ficha.classe].pePorNivel || 0)
        );

        salvarPersonagem(ficha);
        mostrarFicha(ficha, aba);
    };

    document.getElementById("salvar").onclick = () => {
        if (salvarPersonagem(ficha)) {
            document.getElementById("mensagem").textContent =
                "Ficha salva!";
        }
    };

    document.getElementById("editar").onclick = () => abrirEditor(ficha);
    document.getElementById("voltar-lista").onclick = mostrarPersonagens;
    document.getElementById("inicio").onclick = mostrarInicio;

    renderizarAba();
}



function novoMonstro() {
    return {
        id: idNovo(),
        nome: "",
        elemento: "Grama",
        segundoElemento: "",
        classificacao: "Comum",
        atributos: {
            FOR: 0,
            AGI: 0,
            VIG: 0,
            INT: 0,
            PRE: 0,
            ESP: 0
        },
        pericias: [],
        vida: 10,
        vidaAtual: 10,
        defesa: 10,
        pe: 0,
        peAtual: 0,
        xpRecompensa: 1000,
        magias: "",
        aparencia: ""
    };
}

function normalizarMonstro(monstro) {
    monstro.id ||= idNovo();
    monstro.nome ||= "Monstro sem nome";

    if (!elementos[monstro.elemento]) {
        monstro.elemento = "Grama";
    }

    monstro.segundoElemento ||= "";

    if (!classificacoesMonstro.includes(monstro.classificacao)) {
        monstro.classificacao = "Comum";
    }

    monstro.atributos ||= {};
    monstro.pericias = Array.isArray(monstro.pericias)
        ? monstro.pericias
        : [];

    monstro.vida = numeroSeguro(monstro.vida ?? 10, 0, 999999);
    monstro.vidaAtual = numeroSeguro(monstro.vidaAtual ?? monstro.vida, 0, monstro.vida);
    monstro.peAtual = numeroSeguro(monstro.peAtual ?? monstro.pe ?? 0, 0, 999999);
    monstro.defesa = numeroSeguro(monstro.defesa ?? 10, 0, 999999);
    monstro.pe = numeroSeguro(monstro.pe ?? 0, 0, 999999);
    monstro.xpRecompensa = numeroSeguro(
        monstro.xpRecompensa ?? 1000,
        0,
        XP_MAXIMO_MONSTRO
    );

    for (const atributo of atributos) {
        monstro.atributos[atributo.sigla] = numeroSeguro(
            monstro.atributos[atributo.sigla] ?? 0,
            0,
            15
        );
    }

    monstro.magias ||= "";
    monstro.aparencia ||= "";

    return monstro;
}

function carregarMonstros() {
    return lerLista(CHAVES.monstros).map(normalizarMonstro);
}

function salvarMonstro(monstro) {
    monstro = normalizarMonstro(monstro);

    const lista = carregarMonstros();
    const indice = lista.findIndex(item => item.id === monstro.id);

    if (indice >= 0) {
        lista[indice] = monstro;
    } else {
        lista.push(monstro);
    }

    return gravarLista(CHAVES.monstros, lista);
}

function mostrarMonstros() {
    const lista = carregarMonstros();

    conteudo.innerHTML = `
        <h2>Criador de monstros</h2>
        <p>Monstros cadastrados: ${lista.length}</p>

        <div class="acoes">
            <button id="novo-monstro">Criar monstro</button>
            <button id="voltar-inicio" class="secundario">Voltar ao menu</button>
        </div>

        <div id="lista-monstros"></div>
    `;

    document.getElementById("novo-monstro").onclick = () => {
        abrirEditorMonstro(novoMonstro());
    };

    ligarVoltar();

    const area = document.getElementById("lista-monstros");

    if (!lista.length) {
        area.innerHTML = `
            <p class="vazio">Nenhum monstro criado ainda.</p>
        `;
        return;
    }

    area.innerHTML = lista.map(monstro => `
        <div class="item-linha">
            <div>
                <strong>${escaparHTML(monstro.nome)}</strong>
                <p>
                    ${escaparHTML(monstro.classificacao)}
                    · ${escaparHTML(monstro.elemento)}
                    ${monstro.segundoElemento
                        ? " / " + escaparHTML(monstro.segundoElemento)
                        : ""}
                </p>
                <p>
                    PV: ${monstro.vidaAtual}/${monstro.vida}
                    · Defesa: ${monstro.defesa}
                    · PE: ${monstro.peAtual}/${monstro.pe}
                </p>
                <p>
                    Recompensa: ${monstro.xpRecompensa.toLocaleString("pt-BR")} XP
                </p>
            </div>

            <div class="acoes">
                <button data-ver-monstro="${monstro.id}">Consultar</button>
                <button class="secundario" data-editar-monstro="${monstro.id}">
                    Editar
                </button>
                <button class="perigo" data-excluir-monstro="${monstro.id}">
                    Excluir
                </button>
            </div>
        </div>
    `).join("");

    area.querySelectorAll("[data-ver-monstro]").forEach(botao => {
        botao.onclick = () => {
            const monstro = carregarMonstros().find(
                item => item.id === botao.dataset.verMonstro
            );

            if (monstro) mostrarFichaMonstro(monstro);
        };
    });

    area.querySelectorAll("[data-editar-monstro]").forEach(botao => {
        botao.onclick = () => {
            const monstro = carregarMonstros().find(
                item => item.id === botao.dataset.editarMonstro
            );

            if (monstro) abrirEditorMonstro(monstro);
        };
    });

    area.querySelectorAll("[data-excluir-monstro]").forEach(botao => {
        botao.onclick = () => {
            const monstro = lista.find(
                item => item.id === botao.dataset.excluirMonstro
            );

            if (
                monstro &&
                confirm(`Excluir o monstro "${monstro.nome}"?`)
            ) {
                gravarLista(
                    CHAVES.monstros,
                    carregarMonstros().filter(item => item.id !== monstro.id)
                );

                mostrarMonstros();
            }
        };
    });
}


function abrirEditorMonstro(monstro) {
    monstro = normalizarMonstro(monstro);

    const editando = carregarMonstros().some(
        item => item.id === monstro.id
    );

    conteudo.innerHTML = `
        <h2>${editando ? "Editar monstro" : "Criar monstro"}</h2>

        <div class="campo">
            <label for="monstro-nome">Nome</label>
            <input
                id="monstro-nome"
                maxlength="60"
                value="${escaparHTML(monstro.nome === "Monstro sem nome" ? "" : monstro.nome)}"
            >
        </div>

        <div class="grade">
            <div class="campo">
                <label for="monstro-elemento">Elemento principal</label>
                <select id="monstro-elemento">
                    ${Object.keys(elementos).map(elemento => `
                        <option
                            value="${escaparHTML(elemento)}"
                            ${monstro.elemento === elemento ? "selected" : ""}
                        >
                            ${escaparHTML(elemento)}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="campo">
                <label for="monstro-elemento2">Segundo elemento (opcional)</label>
                <select id="monstro-elemento2">
                    <option value="">Nenhum</option>
                    ${Object.keys(elementos).map(elemento => `
                        <option
                            value="${escaparHTML(elemento)}"
                            ${monstro.segundoElemento === elemento ? "selected" : ""}
                        >
                            ${escaparHTML(elemento)}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="campo">
                <label for="monstro-classificacao">Classificação</label>
                <select id="monstro-classificacao">
                    ${classificacoesMonstro.map(classificacao => `
                        <option
                            value="${escaparHTML(classificacao)}"
                            ${monstro.classificacao === classificacao ? "selected" : ""}
                        >
                            ${escaparHTML(classificacao)}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="campo">
                <label for="monstro-vida">Vida</label>
                <input id="monstro-vida" type="number" min="0" value="${monstro.vida}">
            </div>

            <div class="campo">
                <label for="monstro-defesa">Defesa</label>
                <input id="monstro-defesa" type="number" min="0" value="${monstro.defesa}">
            </div>

            <div class="campo">
                <label for="monstro-pe">PE</label>
                <input id="monstro-pe" type="number" min="0" value="${monstro.pe}">
            </div>

            <div class="campo">
                <label for="monstro-xp">XP ao derrotar (0 a 200.000)</label>
                <input
                    id="monstro-xp"
                    type="number"
                    min="0"
                    max="${XP_MAXIMO_MONSTRO}"
                    value="${monstro.xpRecompensa}"
                >
            </div>
        </div>

        <section class="secao">
            <h3>Atributos (0 a 15)</h3>

            <div class="grade-atributos">
                ${atributos.map(atributo => `
                    <div class="atributo">
                        <label for="monstro-${atributo.sigla}">
                            ${atributo.sigla} — ${atributo.nome}
                        </label>
                        <input
                            id="monstro-${atributo.sigla}"
                            type="number"
                            min="0"
                            max="15"
                            value="${monstro.atributos[atributo.sigla]}"
                        >
                    </div>
                `).join("")}
            </div>
        </section>

        <section class="secao">
            <h3>Perícias</h3>

            <div class="lista-pericias">
                ${pericias.map(pericia => `
                    <label class="pericia">
                        <input
                            type="checkbox"
                            name="monstro-pericia"
                            value="${escaparHTML(pericia)}"
                            ${monstro.pericias.includes(pericia) ? "checked" : ""}
                        >
                        ${escaparHTML(pericia)}
                    </label>
                `).join("")}
            </div>
        </section>

        <div class="campo">
            <label for="monstro-magias">Magias</label>
            <textarea id="monstro-magias" rows="5">${escaparHTML(monstro.magias)}</textarea>
        </div>

        <div class="campo">
            <label for="monstro-aparencia">Aparência</label>
            <textarea id="monstro-aparencia" rows="4">${escaparHTML(monstro.aparencia)}</textarea>
        </div>

        <div class="acoes">
            <button id="salvar-monstro">Salvar monstro</button>
            <button id="cancelar-monstro" class="secundario">Cancelar</button>
        </div>
    `;

    document.getElementById("salvar-monstro").onclick = () => {
        const nome = document.getElementById("monstro-nome").value.trim();

        if (!nome) {
            alert("Digite um nome para o monstro.");
            return;
        }

        monstro.nome = nome;
        monstro.elemento = document.getElementById("monstro-elemento").value;
        monstro.segundoElemento = document.getElementById("monstro-elemento2").value;
        monstro.classificacao = document.getElementById("monstro-classificacao").value;

        monstro.vida = numeroSeguro(
            document.getElementById("monstro-vida").value,
            0
        );

        monstro.defesa = numeroSeguro(
            document.getElementById("monstro-defesa").value,
            0
        );

        monstro.pe = numeroSeguro(
            document.getElementById("monstro-pe").value,
            0
        );

        monstro.xpRecompensa = numeroSeguro(
            document.getElementById("monstro-xp").value,
            0,
            XP_MAXIMO_MONSTRO
        );

        for (const atributo of atributos) {
            monstro.atributos[atributo.sigla] = numeroSeguro(
                document.getElementById(`monstro-${atributo.sigla}`).value,
                0,
                15
            );
        }

        monstro.pericias = [
            ...document.querySelectorAll('input[name="monstro-pericia"]:checked')
        ].map(caixa => caixa.value);

        monstro.magias = document.getElementById("monstro-magias").value.trim();
        monstro.aparencia = document.getElementById("monstro-aparencia").value.trim();

        salvarMonstro(monstro);
        mostrarMonstros();
    };

    document.getElementById("cancelar-monstro").onclick = mostrarMonstros;
}



function mostrarFichaMonstro(monstro) {
    monstro = normalizarMonstro(monstro);

    conteudo.innerHTML = `
        <h2>${escaparHTML(monstro.nome)}</h2>

        <p>
            ${escaparHTML(monstro.classificacao)}
            · ${escaparHTML(monstro.elemento)}
            ${monstro.segundoElemento
                ? " / " + escaparHTML(monstro.segundoElemento)
                : ""}
        </p>

        <section class="secao">
            <p><strong>PV:</strong> <span id="monstro-pv-valor">${monstro.vidaAtual}/${monstro.vida}</span></p>
            <div class="acoes">
                <button data-monstro-recurso="pv" data-valor="-1" class="perigo">− 1 PV</button>
                <button data-monstro-recurso="pv" data-valor="1">+ 1 PV</button>
            </div>
            <p><strong>Defesa:</strong> ${monstro.defesa}</p>
            <p><strong>PE:</strong> <span id="monstro-pe-valor">${monstro.peAtual}/${monstro.pe}</span></p>
            <div class="acoes">
                <button data-monstro-recurso="pe" data-valor="-1" class="perigo">− 1 PE</button>
                <button data-monstro-recurso="pe" data-valor="1">+ 1 PE</button>
            </div>
            <div class="campo">
                <label for="monstro-quantidade">Alterar vários pontos</label>
                <input id="monstro-quantidade" type="number" min="1" value="5">
            </div>
            <div class="acoes">
                <button data-monstro-lote="pv" data-valor="-1" class="perigo">Diminuir PV</button>
                <button data-monstro-lote="pv" data-valor="1">Aumentar PV</button>
                <button data-monstro-lote="pe" data-valor="-1" class="perigo">Diminuir PE</button>
                <button data-monstro-lote="pe" data-valor="1">Aumentar PE</button>
            </div>
            <p>
                <strong>Recompensa:</strong>
                ${monstro.xpRecompensa.toLocaleString("pt-BR")} XP
            </p>

            <h3>Atributos</h3>
            ${atributos.map(atributo => `
                <p>
                    <strong>${atributo.sigla} — ${atributo.nome}:</strong>
                    +${monstro.atributos[atributo.sigla]}
                </p>
            `).join("")}

            <h3>Perícias</h3>
            <p>
                ${
                    monstro.pericias.length
                        ? monstro.pericias.map(escaparHTML).join(", ")
                        : "Nenhuma"
                }
            </p>

            <h3>Magias</h3>
            <p>${escaparHTML(monstro.magias || "Nenhuma magia descrita.")}</p>

            <h3>Aparência</h3>
            <p>${escaparHTML(monstro.aparencia || "Nenhuma descrição.")}</p>
        </section>

        <section class="secao">
            <h3>Derrotar monstro</h3>
            <p>Escolha quem participou da luta para distribuir o XP.</p>

            <div id="personagens-recompensa"></div>

            <button id="confirmar-derrota">Confirmar derrota e distribuir XP</button>
        </section>

        <div class="acoes">
            <button id="editar-monstro">Editar</button>
            <button id="voltar-monstros" class="secundario">Voltar aos monstros</button>
        </div>
    `;

    function alterarRecursoMonstro(recurso, delta) {
        if (recurso === "pv") monstro.vidaAtual = Math.max(0, Math.min(monstro.vida, monstro.vidaAtual + delta));
        if (recurso === "pe") monstro.peAtual = Math.max(0, Math.min(monstro.pe, monstro.peAtual + delta));
        salvarMonstro(monstro);
        mostrarFichaMonstro(monstro);
    }
    document.querySelectorAll("[data-monstro-recurso]").forEach(botao => {
        botao.onclick = () => alterarRecursoMonstro(botao.dataset.monstroRecurso, Number(botao.dataset.valor));
    });
    document.querySelectorAll("[data-monstro-lote]").forEach(botao => {
        botao.onclick = () => {
            const quantidade = numeroSeguro(document.getElementById("monstro-quantidade")?.value || 1, 1, 999999);
            alterarRecursoMonstro(botao.dataset.monstroLote, quantidade * Number(botao.dataset.valor));
        };
    });

    const personagens = carregarPersonagens();
    const area = document.getElementById("personagens-recompensa");

    if (!personagens.length) {
        area.innerHTML = `
            <p class="aviso">Crie um personagem antes de distribuir XP.</p>
        `;
        document.getElementById("confirmar-derrota").disabled = true;
    } else {
        area.innerHTML = personagens.map(personagem => `
            <label class="pericia">
                <input
                    type="checkbox"
                    name="personagem-recompensa"
                    value="${personagem.id}"
                    checked
                >
                ${escaparHTML(personagem.nome)}
                — Nível ${personagem.nivel}
            </label>
        `).join("");
    }

    document.getElementById("confirmar-derrota").onclick = () => {
        const selecionados = [
            ...document.querySelectorAll(
                'input[name="personagem-recompensa"]:checked'
            )
        ].map(caixa => caixa.value);

        if (!selecionados.length) {
            alert("Selecione pelo menos um personagem.");
            return;
        }

        const recompensa = numeroSeguro(
            monstro.xpRecompensa,
            0,
            XP_MAXIMO_MONSTRO
        );

        const xpPorPersonagem = Math.floor(
            recompensa / selecionados.length
        );

        const restantes = recompensa % selecionados.length;
        const lista = carregarPersonagens();
        const subiram = [];

        selecionados.forEach((id, indice) => {
            const personagem = lista.find(item => item.id === id);
            if (!personagem) return;

            const quantidade = xpPorPersonagem +
                (indice < restantes ? 1 : 0);

            const resultado = adicionarXP(personagem, quantidade);

            if (resultado.niveisGanhos > 0) {
                subiram.push(
                    `${personagem.nome}: +${resultado.niveisGanhos} nível(is)`
                );
            }
        });

        if (recompensa === 0) {
            alert("Monstro derrotado! Este monstro não concede XP.");
        } else {
            alert(
                `Monstro derrotado!\n` +
                `XP total: ${recompensa.toLocaleString("pt-BR")}\n` +
                `Personagens: ${selecionados.length}\n` +
                `XP por personagem: aproximadamente ${xpPorPersonagem.toLocaleString("pt-BR")}` +
                (
                    subiram.length
                        ? `\n\nSubiram de nível:\n${subiram.join("\n")}`
                        : ""
                )
            );
        }

        mostrarFichaMonstro(monstro);
    };

    document.getElementById("editar-monstro").onclick = () => {
        abrirEditorMonstro(monstro);
    };

    document.getElementById("voltar-monstros").onclick = mostrarMonstros;
}



function mostrarRegras() {
    conteudo.innerHTML = `
        <h2>Livro de Regras</h2>

        <section class="secao">
            <h3>Atributos</h3>
            <p><strong>FOR — Força:</strong> força física e golpes corpo a corpo.</p>
            <p><strong>AGI — Agilidade:</strong> reflexos, precisão e esquiva.</p>
            <p><strong>VIG — Vigor:</strong> resistência e saúde.</p>
            <p><strong>INT — Inteligência:</strong> conhecimento e raciocínio.</p>
            <p><strong>PRE — Presença:</strong> influência, carisma e intimidação.</p>
            <p><strong>ESP — Espírito:</strong> energia sobrenatural e força de vontade.</p>
        </section>

        <section class="secao">
            <h3>Classes e funções</h3>
            <p><strong>COMBATENTE:</strong> ataca e protege seus amigos com força BRUTA. É a linha de frente e deve aguentar pressão.</p>
            <p><strong>CONJURADOR:</strong> ataca usando MAGIAS. É a classe que mais recebe pontos de Determinação para evoluir magia.</p>
            <p><strong>TRAPACEIRO:</strong> utiliza as fraquezas e a desconcentração do inimigo contra ele mesmo.</p>
            <p><strong>SUPORTE:</strong> atua na linha de trás; ajuda com BUFFs, recuperação de PV e proteção dos aliados. Não é focado em causar dano direto.</p>
            <p><strong>INVESTIGADOR:</strong> atua na linha de trás e fornece informações úteis. Analise BEM os inimigos ao redor e identifique padrões, fraquezas e riscos.</p>
            <p><strong>AGENTE DO CAOS:</strong> faz de tudo um pouco e aproveita brechas para concretizar o impossível. É versátil, mas seus efeitos extraordinários devem ter limites definidos pelo mestre.</p>
        </section>

        <section class="secao">
            <h3>Perícias</h3>
            <p>Uma perícia treinada concede +2 nos testes relacionados.</p>
            <p>Ao criar um personagem, escolha exatamente 3 perícias.</p>
        </section>

        <section class="secao">
            <h3>Experiência e níveis</h3>
            <p>Os personagens começam no nível 1 e podem chegar até o nível 20.</p>
            <p>Nível 1 → 2: 20.000 XP; nível 2 → 3: 30.000 XP; nível 3 → 4: 40.000 XP.</p>
            <p>O custo aumenta em 10.000 XP a cada nível. O XP gasto é consumido e o excedente permanece para o próximo avanço.</p>
            <p>Monstros podem conceder de 0 a 200.000 XP.</p>
        </section>

        <section class="secao">
            <h3>PV e PE por nível</h3>
            <p><strong>Combatente:</strong> +5 PV e +1 PE por nível.</p>
            <p><strong>Conjurador:</strong> +3 PV e +3 PE por nível.</p>
            <p><strong>Trapaceiro, Suporte, Investigador e Agente do Caos:</strong> +4 PV e +2 PE por nível.</p>
            <p>PV e PE máximos também consideram atributos e itens equipados.</p>
        </section>

        <section class="secao">
            <h3>PV e PE durante o jogo</h3>
            <p>Na ficha do personagem ou na consulta do inimigo, use os botões + e − para ajustar PV e PE durante o combate. Os valores nunca ficam abaixo de 0 nem ultrapassam os máximos cadastrados. Para inimigos, aumente o PV ou PE máximo no editor antes de tentar ultrapassar o limite.</p>
        </section>

        <section class="secao">
            <h3>Itens de defesa</h3>
            <p><strong>Armadura Reforçada:</strong> +2 Defesa.</p>
            <p><strong>Escudo do Guardião:</strong> +2 Defesa.</p>
            <p><strong>Peitoral de Titã:</strong> +3 Defesa.</p>
            <p><strong>Manto das Sombras:</strong> +1 Defesa.</p>
            <p><strong>Anel de Aço:</strong> +1 Defesa.</p>
            <p><strong>Botas Leves:</strong> +1 Defesa e +1 Agilidade.</p>
            <p>Os bônus são aplicados automaticamente quando o item está no inventário. Para manter o equilíbrio, itens iguais acumulam, mas o mestre pode limitar armaduras pesadas ou escudos conforme a campanha.</p>
        </section>

        <section class="secao">
            <h3>Dano físico</h3>
            <p>Todo ataque físico causa <strong>dano da arma + Força</strong>. A Força adiciona o valor do atributo: +1, +2 ou +3, conforme o personagem.</p>
            <p>Bônus de habilidades e itens só são somados quando a habilidade ou o item disser explicitamente que concede dano adicional. Evite somar o mesmo bônus duas vezes.</p>
        </section>

        <section class="secao">
            <h3>Magia e Determinação</h3>
            <p>O dano mágico base é sempre calculado em dados de seis lados (d6), conforme o nível da magia. O nível máximo tradicional é 4.</p>
            <p><strong>Nível 1:</strong> 1d6 de dano; <strong>Nível 2:</strong> 2d6; <strong>Nível 3:</strong> 3d6; <strong>Nível 4:</strong> 4d6 (máximo).</p>
            <p>Para elevar uma magia ao próximo nível, é necessário gastar <strong>3 pontos de Determinação</strong> por melhoria. Os pontos são um recurso de progressão distinto dos PE gastos ao conjurar.</p>
            <p>Ao subir de nível, o <strong>Conjurador recebe 3 pontos de Determinação</strong>; todas as outras classes recebem 1 ponto.</p>
            <p>É permitido conhecer uma magia em nível inferior ao nível máximo já alcançado: por exemplo, ter uma magia de nível 1 mesmo podendo aprimorá-la até o nível 3.</p>
            <p>Magias de nível 1 custam 2 PE; nível 2 custa 4 PE; nível 3 custa 6 PE; nível 4 custa 8 PE.</p>
            <p><strong>Magias PRIMORDIAIS:</strong> custam 16 PE e não podem ser obtidas por meios tradicionais. Seu acesso depende de eventos, itens ou decisão especial do mestre.</p>
        </section>

        <section class="secao">
            <h3>Elementos e relíquias</h3>
            <p>O personagem começa com seu elemento inicial. Futuramente, pode obter um elemento adicional por meio do item raro <strong>Espírito d'O Primeiro</strong>; o mestre define como e quando essa relíquia é encontrada.</p>
            <p>Uma vantagem elemental multiplica o dano por 1,5 e uma resistência elemental multiplica o dano por 0,5. Arredonde o resultado final para baixo, salvo regra específica da mesa.</p>
            <p>As <strong>Orbes d'O Primeiro</strong> concedem 1 ponto de Determinação cada quando consumidas.</p>
        </section>

        <section class="secao">
            <h3>Rebalanceamento e limites</h3>
            <p>O Combatente é resistente, mas seus bônus de dano devem ser pontuais; evite acumular vários bônus de dano sem custo no mesmo turno.</p>
            <p>O Conjurador evolui magias com Determinação, mas precisa administrar PE para conjurá-las. O nível 4 é o limite normal e magias Primordiais são exceções raras.</p>
            <p>O Suporte deve priorizar cura, buffs e proteção; o Investigador deve criar vantagem tática com informações, sem resolver automaticamente todos os desafios. O Agente do Caos pode improvisar soluções incomuns, mas o mestre define custo, risco e alcance para não superar todas as outras classes.</p>
            <p>Fraquezas e resistências elementais não se acumulam entre si: aplique apenas o modificador final pertinente ao alvo.</p>
        </section>

        <section class="secao">
            <h3>Desbloqueios</h3>
            <p>As classes recebem habilidades nos níveis 3, 5, 8, 10, 13, 15 e 20.</p>
            <p>As habilidades desbloqueadas aparecem automaticamente na ficha do personagem.</p>
        </section>

        <div class="acoes">
            <button id="voltar-inicio" class="secundario">Voltar ao menu</button>
        </div>
    `;
    ligarVoltar();
}

mostrarInicio();

/* SISTEMAS ADICIONAIS — arma personalizada, trilhas e rebalanceamento */
const trilhasRPG = {
    Combatente: {
        "Casca Grossa": ["Seu PV máximo aumenta em +4. Você também recebe +1 PV máximo por nível de personagem enquanto seguir esta trilha.", "Uma vez por rodada, quando sofrer dano, reduza esse dano em 3 (custa 1 PE). Não reduz dano inevitável ou ambiental decidido pelo mestre.", "Uma vez por combate, quando seria reduzido a 0 PV, fica com 1 PV e recebe resistência 2 a todo dano até o início do seu próximo turno."],
        "Guerreiro": ["Uma vez por rodada, ao acertar um ataque corpo a corpo, causa +1d4 de dano sem custo de PE.", "Uma vez por rodada, pode gastar 2 PE para realizar um golpe preciso: +1d8 de dano. Declare antes de rolar o dano.", "Uma vez por combate, execute um Golpe Devastador: +2d8 de dano e ignore 2 pontos de Defesa do alvo. Até seu próximo turno, sua Defesa diminui em 1."],
        "Destruidor": ["Escolha uma categoria de arma. Com ela, recebe +2 no dano e +1 em testes para desarmar ou manter a arma; bônus não se aplica a outras armas.", "Seus críticos com a arma escolhida acontecem com uma margem 1 ponto maior, respeitando o limite do sistema. Uma vez por rodada, ao tirar o valor máximo em um dado de dano, some +1d4 de dano.", "Uma vez por rodada, gaste 2 PE para um ataque com a arma escolhida que ignora 3 pontos de Defesa. Uma vez por combate, um crítico confirmado causa +2d8 de dano adicional." ]
    },
    Conjurador: {
        "Terror": ["Quando estiver adjacente ao alvo, seus rituais ofensivos causam +2 de dano. Uma vez por rodada, ao acertar um ataque corpo a corpo, cause +1d4 de dano mágico adicional.", "Uma vez por rodada, depois de acertar um ataque corpo a corpo, seu próximo ritual ofensivo na mesma rodada custa 1 PE a menos (mínimo 1). Se gastar 2 PE, o ataque também causa +1d6 de dano mágico.", "Uma vez por combate, una golpe e ritual: após acertar um ataque corpo a corpo, conjure um ritual ofensivo como ação rápida, pagando seu custo normal. O ritual causa metade do dano normal adicional se atingir o mesmo alvo."],
        "Masoquista": ["Uma vez por rodada, pode perder até 3 PV voluntariamente para recuperar 1 PE por PV perdido. Esse dano não pode reduzir você abaixo de 1 PV.", "Ao conjurar um ritual, pode pagar até 3 pontos do custo em PV, na proporção de 2 PV por 1 PE. Não pode usar se estiver com 4 PV ou menos.", "Uma vez por combate, converta até 6 PV em PE na proporção de 1 para 1. Não pode ficar abaixo de 1 PV e, até o fim do próximo turno, recebe +2 de dano de todas as fontes."],
        "Pactoado": ["Pacto Inicial (passiva): escolha uma entidade/elemento e uma característica que ela amplifica. Ao invocar seu poder, role 1d4+2 para determinar o bônus concedido (+2 a +5) e role separadamente 1d4+2 para determinar o preço pago em PV ou PE. Declare qual recurso será pago antes de rolar. Se não puder pagar, a invocação falha. Uma vez por rodada.", "Possessão Parcial (ativa, 2 PE): por 2 rodadas, a entidade concede +1d6+2 em uma categoria coerente com sua natureza (dano, Defesa ou testes específicos). Ao ativar, role 1d4+2 e pague essa quantidade em PV ou PE adicional. Não pode reduzir PV abaixo de 1.", "Acordo de Sangue (reação, 1 vez por combate): quando sofrer dano ou falhar em um teste importante, aceite um custo de 2d4+2 PV ou PE para receber um bônus de 2d4+2 no efeito relacionado. Escolha o recurso antes da rolagem; o bônus não transforma automaticamente uma falha em sucesso. Não pode pagar PV se isso o reduzir a 0.", "Manifestação Total (ativa, 1 vez por combate): por 2 rodadas, a entidade assume parcialmente o corpo; receba +2d6+2 em um atributo ou dano coerente com o pacto e resistência 1d4+2 contra uma fonte de dano. Ao encerrar, pague 2d6+2 PV ou PE, escolhido antes da ativação. Um pacto letal só pode ocorrer por decisão voluntária explícita: nesse caso, o personagem morre ao fim da duração."]
    },
    Trapaceiro: {
        "Assassino em série": ["Ao atacar um alvo que não percebeu sua presença, causa +1d6 de dano. Se estiver em combate direto sem cobertura ou distração, sofre -1 Defesa.", "Pode preparar uma armadilha com 2 PE e uma ação. O primeiro inimigo que a acionar sofre 2d6 de dano e perde 3m de deslocamento; só pode manter uma armadilha ativa.", "Uma vez por rodada, seu ataque furtivo causa +2d6 de dano. Se errar, fica exposto e sofre -1 Defesa até o início do seu próximo turno."],
        "Último Sobrevivente": ["Recebe +2 em testes para fugir, escapar de agarrões e evitar ser derrubado.", "Uma vez por combate, reduza pela metade o dano de um ataque recebido e mova-se até 4,5m sem provocar reação.", "Enquanto estiver com 25% ou menos dos PV máximos, recebe +2 Defesa e pode se levantar ou escapar de agarrão sem gastar ação uma vez por rodada. Uma vez por combate, ao ser atingido, pode mover-se 3m imediatamente."],
        "Entrosa": ["Recebe +2 em Persuasão e Enganação ao interagir com humanos que possam compreender você.", "Uma vez por rodada, gaste 2 PE para impor -2 no próximo teste social de um alvo que possa ouvir e entender você, ou conceder +2 a um aliado na conversa.", "Uma vez por cena, após uma conversa bem-sucedida, pode encerrar uma hostilidade menor, conseguir uma breve trégua ou criar uma abertura de negociação. Não controla mentes nem altera objetivos fundamentais." ]
    },
    Suporte: {
        "Última Opção": ["Uma vez por rodada, gaste 1 PE e perca 2 PV para restaurar 4 PV de um aliado a até 6m. Você não pode ficar abaixo de 1 PV.", "Uma vez por rodada, transfira até 5 PV para um aliado a até 6m, pagando 1 PE para cada 2 PV transferidos (arredondado para cima). Não pode deixar você abaixo de 1 PV.", "Uma vez por combate, transfira até 8 PV e 3 PE para um aliado a até 6m. O aliado também recebe +2 Defesa até o início do seu próximo turno; você não pode ficar abaixo de 1 PV."],
        "Líder": ["Uma vez por rodada, escolha um aliado que possa ouvir você: ele recebe +2 no próximo teste ou pode se mover 3m imediatamente.", "Duas vezes por combate, gaste 2 PE para permitir que um aliado realize uma ação de movimento adicional ou receba +1d6 em um teste ou dano. Não concede ação de ataque completa extra.", "Uma vez por combate, coordene até dois aliados: cada um recebe +2 no próximo teste e pode se mover 3m imediatamente. Um deles também pode usar uma reação para proteger um aliado adjacente, reduzindo o dano recebido em 1d8."],
        "Ferreiro": ["Durante um descanso, conserte uma arma ou armadura e escolha uma arma aliada: ela recebe +1 de dano no próximo combate. Esse bônus não acumula.", "Após 10 minutos de trabalho, gaste 2 PE para aprimorar uma arma: +2 de dano até o fim da próxima cena, ou +1 Defesa em uma armadura. Só um aprimoramento por personagem pode ficar ativo.", "Uma vez por descanso, prepare uma melhoria superior: uma arma recebe +1d6 de dano no próximo ataque que acertar, ou uma armadura reduz em 3 o dano de um ataque recebido. O efeito termina após ativar ou no fim da cena." ]
    },
    Investigador: {
        "Expert": ["Após observar uma pista ou criatura por uma rodada, recebe +2 no próximo teste para identificar uma característica, fraqueza ou padrão dela.", "Depois de descobrir uma vulnerabilidade real do inimigo, a CD dos seus testes diretamente relacionados a explorá-la diminui em 2 até o fim da cena.", "Uma vez por rodada, compartilhe uma descoberta: você e um aliado recebem +2 no próximo teste contra o alvo investigado. Não reduz CDs abaixo do mínimo definido pelo mestre."],
        "Bixo do Mato": ["Recebe +2 em Medicina e Sobrevivência em ambientes naturais. Fora de combate, pode estabilizar um aliado sem teste se tiver ferramentas adequadas.", "Pode gastar uma ação por rodada para estudar o terreno. Após 1 rodada, identifica uma rota segura, cobertura, esconderijo ou ponto plausível de emboscada; após 2 rodadas, também aponta o risco mais provável do local.", "Uma vez por cena, prepara o terreno para o grupo: até três aliados recebem +2 em Furtividade ou no primeiro teste para evitar uma emboscada. Em ambiente natural, você também pode encontrar recursos básicos se houver tempo."],
        "8 ou 80": ["Uma vez por cena, gaste 1 PE para formular duas hipóteses sobre uma pista. O mestre informa qual parece mais plausível, sem garantir que esteja completa.", "Uma vez por rodada, gaste 2 PE para escolher uma entre três abordagens investigativas. Você recebe uma pista útil, mas pode haver custo de tempo, exposição ou recurso.", "Uma vez por cena, gaste 3 PE para testar uma hipótese decisiva. Recebe uma resposta concreta e útil, mas o mestre pode incluir uma complicação realista; não pode revelar automaticamente toda a solução do mistério." ]
    },
    "Agente do Caos": {
        "Apostador do Apocalipse": [
            "Uma vez por rodada, antes de um teste próprio, aposte 1 PE. Se passar, recebe +2 no resultado; se falhar, perde o PE apostado e sofre 1d4 de dano.",
            "Uma vez por combate, antes de um ataque ou teste importante, aposte 2 PE e role normalmente. Se tiver sucesso, escolha +1d8 de dano ou +1d4 no resultado; se falhar, sofre 1d6 de dano e não recupera os PE.",
            "Uma vez por combate, declare uma Aposta Final antes de rolar um ataque. Se acertar, causa +2d8 de dano; se errar, sofre 1d8 de dano que não pode ser reduzido e perde 2 PE. Não pode usar se não tiver os PE para pagar."
        ],
        "Mestre da Desgraça": [
            "Uma vez por rodada, gaste 1 PE depois que um inimigo que esteja participando do combate fizer um teste. Se ele falhar, recebe -1 no próximo teste; se passar, nenhum efeito adicional acontece.",
            "Uma vez por rodada, gaste 2 PE para marcar um inimigo à sua escolha por até 2 rodadas. A primeira vez que ele acertar um ataque nesse período, causa 1d4 a menos de dano (mínimo 1); depois a marca termina.",
            "Uma vez por combate, quando um inimigo marcado usar uma habilidade especial, gaste 2 PE para impor -2 no teste relacionado ou reduzir em 1d8 o dano/efeito numérico da habilidade. Não cancela habilidades nem altera decisões narrativas."
        ],
        "Maldição Ambulante": [
            "Uma vez por rodada, gaste 1 PE para amaldiçoar um inimigo à sua escolha que esteja participando do combate. Até o início do seu próximo turno, ele sofre -1 no próximo teste que fizer.",
            "Uma vez por rodada, gaste 2 PE para reforçar a maldição de um alvo já amaldiçoado. O próximo ataque que acertar esse alvo causa +1d6 de dano; a maldição termina depois desse ataque ou no início do seu próximo turno.",
            "Uma vez por combate, amaldiçoe um alvo por até 2 rodadas. Na primeira vez em cada rodada que ele sofrer dano de um aliado, reduza sua Defesa em 1 contra o próximo ataque antes do fim da rodada. Efeitos da trilha não acumulam entre si."
        ]
    }
};
// Quarta habilidade de cada trilha. Cada uma segue o estilo daquela trilha.
const habilidadesNivel4 = {
    "Casca Grossa": "Uma vez por combate, quando um ataque reduzir você a 0 PV, fique com 1 PV e reduza todo dano recebido em 3 até seu próximo turno.",
    "Guerreiro": "Uma vez por combate, faça um ataque corpo a corpo. Se acertar, causa +3d8 de dano e empurra o alvo 3m.",
    "Destruidor": "Uma vez por combate, faça um ataque com a arma escolhida. Ele ignora 4 pontos de Defesa e causa +3d8 de dano se acertar.",
    "Terror": "Uma vez por combate, depois de acertar um ataque corpo a corpo, lance um ritual ofensivo como ação rápida. Se atingir o mesmo alvo, some +2d8 de dano mágico.",
    "Masoquista": "Uma vez por combate, converta até 10 PV em PE, na proporção de 1 para 1. Você não pode ficar abaixo de 1 PV; até o fim do próximo turno, causa +1d8 de dano.",
    "Pactoado": "Manifestação Total (ativa, 1 vez por combate): por 2 rodadas, a entidade toma parte do seu corpo. Role 2d6+2 para o bônus e 1d6+2 para o preço em PV ou PE. Você escolhe o recurso antes de rolar. Pode aceitar morrer ao fim do efeito, mas só se declarar isso antes da ativação.",
    "Assassino em série": "Uma vez por combate, ataque um alvo que não percebeu sua presença. Se acertar, causa +3d8 de dano e pode se mover 3m sem provocar reação.",
    "Último Sobrevivente": "Uma vez por combate, quando cair a 25% dos PV ou menos, reduza pela metade o dano do ataque que ativou o efeito e recupere 1d8 PV.",
    "Entrosa": "Uma vez por cena, após uma conversa bem-sucedida, convença um grupo a aceitar uma trégua curta ou negociar. Não funciona contra quem não possa ser convencido pela situação.",
    "Última Opção": "Uma vez por combate, escolha um aliado a até 6m. Ele recupera 2d8 PV e 1d4 PE; você perde 1d8 PV e não pode ficar abaixo de 1 PV.",
    "Líder": "Uma vez por combate, escolha até três aliados que possam ouvir você. Cada um recebe +1d8 no próximo teste ou dano e pode se mover 3m imediatamente.",
    "Ferreiro": "Uma vez por descanso, prepare uma arma aliada. No próximo combate, ela causa +2d8 de dano no primeiro ataque que acertar; ou prepare uma armadura para reduzir em 1d8+2 o próximo dano recebido.",
    "Expert": "Uma vez por combate, depois de estudar um inimigo por uma rodada, revele uma fraqueza real. O próximo ataque seu e de até dois aliados contra ele causa +1d8 de dano.",
    "Bixo do Mato": "Uma vez por cena em ambiente natural, encontre uma rota segura e prepare uma emboscada. Até três aliados recebem +1d8 no primeiro ataque ou teste de Furtividade relacionado.",
    "8 ou 80": "Uma vez por cena, gaste 3 PE para testar uma hipótese importante. Receba uma resposta concreta sobre a pista; o mestre ainda pode apontar um custo, risco ou detalhe que ficou de fora.",
    "Apostador do Apocalipse": "Uma vez por combate, antes de um ataque, aposte 3 PE. Se acertar, causa +3d8 de dano; se errar, sofre 1d8 de dano que não pode ser reduzido e perde os PE apostados. Deve ter os 3 PE disponíveis antes de declarar a aposta.",
    "Mestre da Desgraça": "Uma vez por combate, escolha até dois inimigos que estejam participando do combate. Até o início do seu próximo turno, cada um sofre -2 no primeiro teste que fizer ou causa -1d8 no primeiro dano que causar. Cada inimigo é afetado por apenas uma dessas opções.",
    "Maldição Ambulante": "Uma vez por combate, amaldiçoe um inimigo à sua escolha que esteja participando do combate por 2 rodadas. Uma vez por rodada, quando ele sofrer dano, o próximo ataque de um aliado contra ele recebe +1d8 de dano. Esse bônus só pode ocorrer uma vez por rodada e não acumula com outras habilidades desta trilha.",
};
for (const caminhos of Object.values(trilhasRPG)) {
    for (const [nome, habilidades] of Object.entries(caminhos)) {
        while (habilidades.length < 3) habilidades.push("Habilidade ainda não definida.");
        habilidades[3] = habilidadesNivel4[nome] || `Uma vez por combate, use a técnica principal desta trilha com efeito aumentado: some +2d8 ao dano ou +1d8 a um teste ou efeito de suporte relacionado.`;
    }
}
const custosTrilha = [10000, 20000, 30000, 40000];
const trilhaPontos = nivel => Math.max(0, Math.min(3, Math.floor(nivel / 3)));

function calcular(ficha) {
    const classe = classes[ficha.classe] || classes.Combatente;
    const nivel = numeroSeguro(ficha.nivel || 1, 1, NIVEL_MAXIMO);
    const contar = nome => ficha.itens.filter(item => item.toLowerCase() === nome.toLowerCase()).length;
    const bonusPV = contar("Núcleo Vital") * 4 + contar("Amuleto Vital") * 2;
    const bonusPE = contar("Cristal de Energia") * 3;
    const bonusAGI = contar("Botas Leves");
    const bonusDefesa = contar("Armadura Reforçada")*2 + contar("Escudo do Guardião")*2 + contar("Peitoral de Titã")*3 + contar("Manto das Sombras") + contar("Anel de Aço") + bonusAGI;
    const arma = ficha.armeiro || {};
    const ajuste = arma.ajuste === "pv" ? {pv: Number(arma.valor)||0} : arma.ajuste === "pe" ? {pe:Number(arma.valor)||0} : arma.ajuste === "defesa" ? {defesa:Number(arma.valor)||0} : {};
    const bonusTrilhaPV = ficha.arvore?.caminho === "Casca Grossa" ? 4 + (Number(ficha.nivel||1)-1) : 0;
    return {
        pv: classe.pv + 2*Number(ficha.atributos.VIG||0) + bonusPV + (classe.pvPorNivel||0)*(nivel-1) + (ajuste.pv||0) + bonusTrilhaPV,
        pe: classe.pe + 2*Number(ficha.atributos.ESP||0) + bonusPE + (classe.pePorNivel||0)*(nivel-1) + (ajuste.pe||0),
        defesa: 8 + Number(ficha.atributos.AGI||0) + bonusDefesa + (ajuste.defesa||0),
        danoFisico: contar("Lâmina de Ferro")*2 + (ficha.classe==="Combatente" && nivel>=10 ? 2 : 0) + (ficha.arvore?.caminho==="Guerreiro" ? 0 : 0)
    };
}

const abrirEditorOriginal = abrirEditor;
abrirEditor = function(ficha) {
    abrirEditorOriginal(ficha);
    const arma = ficha.armeiro || {nome:"",dano:"1d8",ajuste:"nenhum",valor:0};
    const secao = document.createElement("section");
    secao.className = "secao";
    secao.innerHTML = `<h3>Arma personalizada</h3>
      <p>Escolha apenas um ajuste de ficha. Os valores são aplicados automaticamente ao salvar.</p>
      <div class="grade">
        <div class="campo"><label for="arma-nome">Nome da arma</label><input id="arma-nome" maxlength="40" value="${escaparHTML(arma.nome||"")}" placeholder="Ex.: Lâmina do Eclipse"></div>
        <div class="campo"><label for="arma-dano">Dano-base</label><select id="arma-dano">${["1d4","1d6","1d8","1d10","1d12"].map(v=>`<option ${arma.dano===v?"selected":""}>${v}</option>`).join("")}</select></div>
      </div>
      <div class="grade">
        <div class="campo"><label for="arma-ajuste">Ajuste da ficha</label><select id="arma-ajuste">${[["nenhum","Sem bônus"],["pv","PV máximos"],["pe","PE máximos"],["defesa","Defesa"]].map(([v,n])=>`<option value="${v}" ${arma.ajuste===v?"selected":""}>${n}</option>`).join("")}</select></div>
        <div class="campo"><label for="arma-valor">Valor do ajuste</label><input id="arma-valor" type="number" min="0" max="5" value="${Number(arma.valor)||0}"></div>
      </div>
      <p class="aviso">Limite recomendado: +5 PV, +3 PE ou +1 Defesa. Escolha um único atributo.</p>`;
    const botoes = conteudo.querySelector(".acoes");
    if (botoes) conteudo.insertBefore(secao,botoes);
    const salvar = document.getElementById("salvar-personagem");
    const handlerAntigo = salvar.onclick;
    salvar.onclick = () => {
        const ajuste = document.getElementById("arma-ajuste").value;
        const valor = Number(document.getElementById("arma-valor").value);
        const max = ajuste==="pv" ? 5 : ajuste==="pe" ? 3 : ajuste==="defesa" ? 1 : 0;
        if (!Number.isInteger(valor) || valor < 0 || valor > max) { alert(`Valor inválido. Limite para esse ajuste: ${max}.`); return; }
        ficha.armeiro = {nome:document.getElementById("arma-nome").value.trim(),dano:document.getElementById("arma-dano").value,ajuste,valor};
        handlerAntigo();
    };
};

const mostrarFichaOriginal = mostrarFicha;
mostrarFicha = function(ficha, abaInicial="geral") {
    mostrarFichaOriginal(ficha,abaInicial);
    const arvore = ficha.arvore || {caminho:"",nivel:0,compras:[]};
    const classeTrilhas = trilhasRPG[ficha.classe] || trilhasRPG.Combatente;
    const escolhida = arvore.caminho;
    const bloco = document.createElement("section");
    bloco.className = "secao";
    bloco.innerHTML = `<h3>Árvore de trilha</h3><p><strong>Arma personalizada:</strong> ${escaparHTML(ficha.armeiro?.nome || "Não definida")} · Dano-base ${escaparHTML(ficha.armeiro?.dano || "1d8")} · Ajuste ${escaparHTML(ficha.armeiro?.ajuste || "nenhum")} ${Number(ficha.armeiro?.valor)||0}</p>
      <p>Escolha uma trilha da sua classe. Você desbloqueia uma habilidade por nível. A escolha não pode ser trocada sem reiniciar a trilha.</p>
      ${escolhida ? `<p><strong>Trilha:</strong> ${escaparHTML(escolhida)} <span>·</span> <strong>Nível ${arvore.nivel||0}/4</strong></p>` : `<p>Trilhas disponíveis para ${escaparHTML(ficha.classe)}:</p><div class="grade">${Object.entries(classeTrilhas).map(([nome,skills])=>`<div class="ficha-bloco"><h4>${escaparHTML(nome)}</h4><p>${escaparHTML(skills[0])}</p><button data-trilha="${escaparHTML(nome)}">Escolher trilha</button></div>`).join("")}</div>`}
      ${escolhida ? `<div class="grade niveis-trilha">${(classeTrilhas[escolhida]||[]).map((desc,i)=>{const n=i+1, liberada=n<=(Number(arvore.nivel)||0), custo=[10000,20000,30000,40000][i];return `<article class="ficha-bloco nivel-trilha ${liberada?'desbloqueado':'bloqueado'}"><h4>Nível ${n} ${liberada?'— Desbloqueado':'— Bloqueado'}</h4><p class="custo-xp">${custo.toLocaleString('pt-BR')} XP</p><p>${escaparHTML(desc)}</p></article>`}).join("")}</div>
      ${Number(arvore.nivel||0)<4?`<p>XP disponível: <strong>${(Number(ficha.xp)||0).toLocaleString("pt-BR")}</strong></p><button id="upar-trilha">Desbloquear nível ${Number(arvore.nivel||0)+1} (${[10000,20000,30000,40000][Number(arvore.nivel)||0].toLocaleString("pt-BR")} XP)</button>`:`<p>Você desbloqueou todas as habilidades desta trilha.</p>`}
      <button id="reset-trilha" class="secundario">Reiniciar trilha (sem reembolso de XP)</button>`:""}`;
    const alvo = conteudo.querySelector(".ficha-bloco")?.parentElement || conteudo;
    alvo.appendChild(bloco);
    bloco.querySelectorAll("[data-trilha]").forEach(b=>b.onclick=()=>{
      if(!confirm(`Escolher ${b.dataset.trilha}? Essa escolha é permanente.`)) return;
      ficha.arvore={caminho:b.dataset.trilha,nivel:0,compras:[]}; salvarPersonagem(ficha); mostrarFicha(ficha);
    });
    const upar=bloco.querySelector("#upar-trilha");
    if(upar) upar.onclick=()=>{
      const nivel=Number(ficha.arvore.nivel)||0, custo=[10000,20000,30000,40000][nivel] || 40000;
      if(nivel>=4){return;}
      if((Number(ficha.xp)||0)<custo){alert(`Você precisa de ${custo.toLocaleString("pt-BR")} XP para desbloquear o próximo nível da trilha.`);return;}
      ficha.xp-=custo; ficha.arvore.nivel=nivel+1; ficha.arvore.compras=[...(ficha.arvore.compras||[]),nivel+1];
      salvarPersonagem(ficha); mostrarFicha(ficha);
    };
    const reset=bloco.querySelector("#reset-trilha");
    if(reset) reset.onclick=()=>{if(confirm("Reiniciar sem reembolso?")){ficha.arvore={caminho:"",nivel:0,compras:[]};salvarPersonagem(ficha);mostrarFicha(ficha);}};
};
