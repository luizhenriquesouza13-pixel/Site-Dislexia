document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONTROLE DA RÉGUA DE LEITURA ---
    const btnRegua = document.getElementById('btnRegua');
    const reguaLeitura = document.getElementById('reguaLeitura');

    btnRegua.addEventListener('click', () => {
        reguaLeitura.classList.toggle('hidden');
        btnRegua.classList.toggle('active');
    });

    // Move a régua acompanhando o rato verticalmente
    document.addEventListener('mousemove', (e) => {
        if (!reguaLeitura.classList.contains('hidden')) {
            reguaLeitura.style.top = `${e.clientY}px`;
        }
    });

    // --- 2. CONTROLE DE FONTE (OpenDyslexic) ---
    const btnFonte = document.getElementById('btnFonte');

    btnFonte.addEventListener('click', () => {
        document.body.classList.toggle('font-dyslexic');
        document.body.classList.toggle('font-default');
        btnFonte.classList.toggle('active');
    });

    // --- 3. CONTROLE DE ESPAÇAMENTO ---
    const btnEspacamento = document.getElementById('btnEspacamento');

    btnEspacamento.addEventListener('click', () => {
        document.body.classList.toggle('spacing-wide');
        document.body.classList.toggle('spacing-normal');
        btnEspacamento.classList.toggle('active');
    });

    // --- 4. ALTERNADOR DE TEMAS DE COR ---
    const colorBtns = document.querySelectorAll('.color-btn');

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const newTheme = btn.getAttribute('data-color');
            document.body.className = document.body.className
                .replace(/theme-\w+/g, '')
                .trim() + ` ${newTheme}`;
        });
    });

    // --- 5. LEITOR DE VOZ (Text-to-Speech) ---
    const btnVoz = document.getElementById('btnVoz');
    let synth = window.speechSynthesis;

    btnVoz.addEventListener('click', () => {
        if (synth.speaking) {
            synth.cancel();
            btnVoz.classList.remove('active');
            return;
        }

        // Lê o texto que o utilizador tiver selecionado, ou o texto principal por omissão
        let textoParaLer = window.getSelection().toString();
        
        if (!textoParaLer) {
            const mainContent = document.querySelector('main');
            textoParaLer = mainContent.innerText;
        }

        const utterance = new SpeechSynthesisUtterance(textoParaLer);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9; // Velocidade ligeiramente reduzida para clareza

        utterance.onend = () => btnVoz.classList.remove('active');

        synth.speak(utterance);
        btnVoz.classList.add('active');
    });

    // --- 6. MINI-JOGO DE CONSCIÊNCIA FONOLÓGICA ---
    const palavrasJogo = [
        { alvo: 'GATO', correta: 'PRATO', opcoes: ['PRATO', 'BOLA', 'CASA'] },
        { alvo: 'BOLA', correta: 'COLA', opcoes: ['SAPO', 'COLA', 'MESA'] },
        { alvo: 'SOL', correta: 'FAROL', opcoes: ['LUA', 'FAROL', 'MAR'] }
    ];

    let jogoAtual = 0;
    const palavraAlvoEl = document.getElementById('palavraAlvo');
    const opcoesJogoEl = document.getElementById('opcoesJogo');
    const feedbackEl = document.getElementById('gameFeedback');

    function carregarJogo() {
        const desafio = palavrasJogo[jogoAtual];
        palavraAlvoEl.textContent = desafio.alvo;
        opcoesJogoEl.innerHTML = '';
        feedbackEl.className = 'feedback-box hidden';

        desafio.opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.className = 'game-btn';
            btn.textContent = opcao;
            btn.addEventListener('click', () => verificarResposta(opcao, desafio.correta));
            opcoesJogoEl.appendChild(btn);
        });
    }

    function verificarResposta(escolha, correta) {
        feedbackEl.classList.remove('hidden');

        if (escolha === correta) {
            feedbackEl.textContent = 'Boa! Palavras com som final parecido rimam!';
            feedbackEl.className = 'feedback-box feedback-correct';
            
            setTimeout(() => {
                jogoAtual = (jogoAtual + 1) % palavrasJogo.length;
                carregarJogo();
            }, 2000);
        } else {
            feedbackEl.textContent = 'Tente novamente! Preste atenção ao som final.';
            feedbackEl.className = 'feedback-box feedback-wrong';
        }
    }

    carregarJogo();
});