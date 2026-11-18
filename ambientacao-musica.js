/* Seletor independente de ambientação e trilha sonora. */
(() => {
    const iniciar = () => {
        const header = document.querySelector('header');
        if (!header || document.getElementById('painel-ambientacao')) return;

        const painel = document.createElement('section');
        painel.id = 'painel-ambientacao';
        painel.className = 'painel-controles';
        painel.innerHTML = `
          <div class="controle-grupo">
            <h2>AMBIENTAÇÕES</h2>
            <div class="controle-botoes" role="group" aria-label="Selecionar ambientação">
              <button type="button" data-ambiente="ui" aria-pressed="false">U.I</button>
              <button type="button" data-ambiente="altavento" aria-pressed="false">Altavento</button>
              <button type="button" data-ambiente="campos-elisios" aria-pressed="true">Campos-Elísios</button>
            </div>
          </div>
          <div class="controle-grupo">
            <h2>MÚSICAS</h2>
            <div class="controle-botoes" role="group" aria-label="Controles de música">
              <button type="button" data-musica="caatinga">Caatinga</button>
              <button type="button" data-musica="coracao">Coração-Congelado</button>
              <button type="button" data-musica="mudo">Mutar Música</button>
            </div>
            <p id="estado-musica" aria-live="polite">Música mutada</p>
          </div>`;
        header.appendChild(painel);

        const linkAltavento = document.getElementById('tema-altavento');
        const linkCampos = document.getElementById('tema-campos-elisios');
        const aplicarAmbiente = (ambiente) => {
            if (linkAltavento) linkAltavento.disabled = ambiente !== 'altavento';
            if (linkCampos) linkCampos.disabled = ambiente !== 'campos-elisios';
            document.body.dataset.ambiente = ambiente;
            painel.querySelectorAll('[data-ambiente]').forEach(botao => {
                botao.setAttribute('aria-pressed', String(botao.dataset.ambiente === ambiente));
            });
            try { localStorage.setItem('rpg-ambientacao', ambiente); } catch (_) {}
        };

        const audioCaatinga = document.getElementById('musica-caatinga');
        const audioCoracao = document.getElementById('musica-coracao');
        const estado = document.getElementById('estado-musica');
        const pararMusicas = () => [audioCaatinga, audioCoracao].forEach(audio => {
            if (!audio) return;
            audio.pause();
            audio.currentTime = 0;
        });
        const tocar = async (qual) => {
            pararMusicas();
            const audio = qual === 'caatinga' ? audioCaatinga : audioCoracao;
            if (!audio) return;
            audio.loop = true;
            audio.volume = 0.35;
            try {
                await audio.play();
                estado.textContent = qual === 'caatinga' ? 'Tocando: Caatinga' : 'Tocando: Coração-Congelado';
            } catch (erro) {
                estado.textContent = 'Clique novamente para liberar a reprodução da música.';
            }
        };

        painel.querySelectorAll('[data-ambiente]').forEach(botao => {
            botao.addEventListener('click', () => aplicarAmbiente(botao.dataset.ambiente));
        });
        painel.querySelectorAll('[data-musica]').forEach(botao => {
            botao.addEventListener('click', () => {
                if (botao.dataset.musica === 'mudo') {
                    pararMusicas();
                    estado.textContent = 'Música mutada';
                } else tocar(botao.dataset.musica);
            });
        });

        let ambienteSalvo = 'campos-elisios';
        try {
            const salvo = localStorage.getItem('rpg-ambientacao');
            if (['ui', 'altavento', 'campos-elisios'].includes(salvo)) ambienteSalvo = salvo;
        } catch (_) {}
        aplicarAmbiente(ambienteSalvo);
        // Nenhuma música inicia automaticamente: a escolha fica sob controle do usuário.
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar, { once: true });
    else iniciar();
})();
