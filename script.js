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