
window.onload = function() {
    var canvas = document.getElementById('stage');
    var ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    

    // Ajustar o tamanho do canvas para ocupar a largura e altura total da janela
    canvas.width = window.innerWidth/1.3;
    canvas.height = window.innerHeight/1.3;

    // Centralizar o canvas horizontalmente
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
    // Centralizar o canvas verticalmente
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";

   
    // Posicionamento do botão
    const btnPararAudio = document.getElementById('btnPararAudio');
    const iconVolumeHigh = '<i class="fas fa-volume-up"></i>';
    const iconVolumeXMark = '<i class="fas fa-volume-mute"></i>';
    let isAudioPlaying = true; // Variável para controlar o estado do áudio

    // Função para alternar o ícone do botão
    function toggleButtonIcon() {
        if (isAudioPlaying) {
            btnPararAudio.innerHTML = iconVolumeHigh;
        } else {
            btnPararAudio.innerHTML = iconVolumeXMark;
            isAudioPlaying = false;
        }
    } 

    // Configurar o evento de clique no botão para alternar o áudio e o ícone
    btnPararAudio.addEventListener('click', function() {
        isAudioPlaying = !isAudioPlaying;
        if (isAudioPlaying) {
            playAudio();
        } else {
            pauseAudio();
        }
        toggleButtonIcon();
    });

    // Variável para guardar a referência ao elemento <audio>
    var audioElement = document.getElementById('audio');;

    // Funções para controlar a reprodução e pausa do áudio
    function playAudio() {
        audioElement.volume = 0.1;
        audioElement.play();
        // Configurar o ouvinte de eventos para reiniciar o áudio quando terminar
        audioElement.addEventListener('ended', function() {
            this.currentTime = 0; // Reinicia a reprodução do áudio para o início
            this.play(); // Reproduz o áudio novamente
        });
    }

    function pauseAudio() {
        audioElement.pause();
    }
 
    

    var gameInterval = setInterval(game, 80);

    const vel = 1;
    var gameOver = false;
    var velocidadeX = vel;
    var velocidadeY = 0;
    var cabecaX = 10;
    var cabecaY = 15;
    var pecaTamanho = Math.min(canvas.width, canvas.height) / 20;
    var quantidadePecaX = Math.floor(canvas.width / pecaTamanho);
    var quantidadePecaY = Math.floor(canvas.height / pecaTamanho);
    var macaX = 15;
    var macaY = 15;

    var rastro = [];
    var comprimento = 5;

    var pontuacao = 0;

    var pontosElement = document.getElementById('pontuacao');

    function desenharPontuacao(pontuacao) {
        pontosElement.innerHTML = pontuacao;
      }

      playAudio();

    function game() {

       

        cabecaX += velocidadeX;
        cabecaY += velocidadeY;

        if (cabecaX < 0) {
            cabecaX = quantidadePecaX - 1;
        }
        if (cabecaX >= quantidadePecaX) {
            cabecaX = 0;
        }
        if (cabecaY < 0) {
            cabecaY = quantidadePecaY - 1;
        }
        if (cabecaY >= quantidadePecaY) {
            cabecaY = 0;
        }

            // Preencher o fundo com quadrados pretos e linhas cinzas
        for (var x = 0; x < quantidadePecaX; x++) {
            for (var y = 0; y < quantidadePecaY; y++) {
            // Definir a cor do quadrado
            ctx.fillStyle = "#000000";
            ctx.fillRect(x * pecaTamanho, y * pecaTamanho, pecaTamanho, pecaTamanho);
            
        }
        }
  
  

        ctx.fillStyle = "red";
        ctx.fillRect(macaX * pecaTamanho, macaY * pecaTamanho, pecaTamanho, pecaTamanho);

        for (var i = 0; i < rastro.length; i++) {
            var cor = getRandomColor();
            ctx.fillStyle = cor;
            ctx.fillRect(rastro[i].x * pecaTamanho, rastro[i].y * pecaTamanho, pecaTamanho - 1, pecaTamanho - 1);
           
            if (rastro[i].x == cabecaX && rastro[i].y == cabecaY) {
                gameOver = true;
                break;
            }
        }

        if (gameOver) {
            const audioElement = document.getElementById('audio');
            audioElement.pause();
            clearInterval(gameInterval);
            gameOverScreen();
            return; // Encerra a função game
        }
        

        rastro.push({x: cabecaX, y: cabecaY});
        while (rastro.length > comprimento) {
            rastro.shift();
        }

        if (macaX == cabecaX && macaY == cabecaY) {
            comprimento++;
            pontuacao++;
            const Comer = document.getElementById('Comer');
             Comer.volume = 0.5; // Defina o volume desejado para o som da cobra comendo a maçã
            Comer.play();
            macaX = Math.floor(Math.random() * quantidadePecaX);
            macaY = Math.floor(Math.random() * quantidadePecaY);
        }



        desenharPontuacao(pontuacao);
    }
    function keyPush(event) {
        // Se for um evento de teclado
        if (event.type === "keydown") {
            switch (event.keyCode) {
                case 37: // Left
                    if (velocidadeX !== vel) {
                        velocidadeX = -vel;
                        velocidadeY = 0;
                    }
                    break;
                case 38: // Up
                    if (velocidadeY !== vel) {
                        velocidadeX = 0;
                        velocidadeY = -vel;
                    }
                    break;
                case 39: // Right
                    if (velocidadeX !== -vel) {
                        velocidadeX = vel;
                        velocidadeY = 0;
                    }
                    break;
                case 40: // Down
                    if (velocidadeY !== -vel) {
                        velocidadeX = 0;
                        velocidadeY = vel;
                    }
                    break;
                default:
                    break;
            }
        } else if (event.type === "touchstart" || event.type === "touchmove") {
            // Se for um evento de toque
            // Obtém o primeiro dedo que tocou a tela
            var touch = event.touches[0];
    
            // Calcula a diferença do toque anterior (se existir)
            var deltaX = touch.clientX - (lastTouchX || touch.clientX);
            var deltaY = touch.clientY - (lastTouchY || touch.clientY);
    
            // Verifica se o toque foi na horizontal ou vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Movimento horizontal
                if (deltaX > 0 && velocidadeX !== -vel) {
                    velocidadeX = vel;
                    velocidadeY = 0;
                } else if (deltaX < 0 && velocidadeX !== vel) {
                    velocidadeX = -vel;
                    velocidadeY = 0;
                }
            } else {
                // Movimento vertical
                if (deltaY > 0 && velocidadeY !== -vel) {
                    velocidadeX = 0;
                    velocidadeY = vel;
                } else if (deltaY < 0 && velocidadeY !== vel) {
                    velocidadeX = 0;
                    velocidadeY = -vel;
                }
            }
    
            // Armazena a posição do último toque
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        }
    }
    

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function gameOverScreen() {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Definir o fundo como preto
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = "20px Arial";
        ctx.fillText("Pontuação: " + pontuacao, canvas.width / 2, canvas.height / 2 + 10);

        var pontuacaoMaisAlta = localStorage.getItem("pontuacaoMaisAlta");
        if (!pontuacaoMaisAlta || pontuacao > pontuacaoMaisAlta) {
            pontuacaoMaisAlta = pontuacao;
            localStorage.setItem("pontuacaoMaisAlta", pontuacaoMaisAlta);
        }
        ctx.fillText("Pontuação Mais Alta: " + pontuacaoMaisAlta, canvas.width / 2, canvas.height / 2 + 40);

        ctx.fillStyle = "green";
        ctx.fillRect(canvas.width / 2 - 80, canvas.height / 2 + 80, 160, 40);
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Reiniciar", canvas.width / 2, canvas.height / 2 + 105);

        canvas.addEventListener("click", reiniciarJogo);
    }

    function reiniciarJogo() {
        clearInterval(gameInterval);
        canvas.removeEventListener("click", reiniciarJogo);
        gameInterval = setInterval(game, 80);
        gameOver = false;
        pontuacao = 0;
        rastro = [];
        comprimento = 5;
        cabecaX = 10;
        cabecaY = 15;
        macaX = 15;
        macaY = 15;
        game();
    }

}


