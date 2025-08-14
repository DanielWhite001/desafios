# Diagrama de Arquitetura do Projeto Pacman

Este documento descreve a arquitetura do jogo Pacman através de um diagrama Mermaid, detalhando a interação entre os diferentes componentes do sistema.

```mermaid
graph TD
    subgraph "Browser"
        HTML[index.html]
    end

    subgraph "Game Engine"
        Jogo[jogo.js]
    end

    subgraph "Game Objects"
        PacmanJS[pacman.js]
        FantasmaJS[fantasma.js]
    end

    subgraph "Assets"
        Canvas[Canvas Element]
        Imagens[Imagens (Pacman/Fantasmas)]
        Fonte[Fonte (Emulogic)]
    end

    %% HTML to JS Loading
    HTML -- Carrega & Inicia --> Jogo
    HTML -- Carrega Definição --> PacmanJS
    HTML -- Carrega Definição --> FantasmaJS
    HTML -- Fornece Elementos --> Canvas
    HTML -- Fornece Elementos --> Imagens
    HTML -- Fornece Estilo --> Fonte

    %% Jogo.js (Engine)
    Jogo -- Inicializa --> Pacman_Instance
    Jogo -- Inicializa --> Ghosts_Array
    Jogo -- Gerencia --> GameLoop
    Jogo -- Captura --> UserInput

    subgraph "Game Loop"
        direction LR
        GameLoop -- Chama --> Update
        Update -- Chama --> Draw
    end

    %% Update Logic
    Update -- Chama --> Pacman_Instance_Move
    Update -- Chama --> Pacman_Instance_Eat
    Update -- Chama --> Update_Ghosts
    Update -- Verifica --> Ghost_Collision
    Update -- Verifica --> Win_Condition

    %% Draw Logic
    Draw -- Desenha --> Draw_Walls
    Draw -- Desenha --> Draw_Foods
    Draw -- Desenha --> Pacman_Instance_Draw
    Draw -- Desenha --> Draw_Ghosts
    Draw -- Desenha --> Draw_UI

    %% Game Objects Dependencies
    PacmanJS -- Define a Classe --> Pacman_Instance[Pacman (Instância)]
    FantasmaJS -- Define a Classe --> Ghost_Instance[Ghost (Instância)]
    Jogo -- Cria Múltiplas --> Ghost_Instance
    Ghosts_Array[Array de Ghosts] -- Contém --> Ghost_Instance

    %% Inter-module Communication
    UserInput[Evento de Teclado] -- Atualiza --> Pacman_Instance_NextDirection[pacman.nextDirection]
    Pacman_Instance -- Lê --> Map[map (Array)]
    Pacman_Instance -- Lê --> Ghosts_Array
    Ghost_Instance -- Lê --> Map
    Ghost_Instance -- Lê --> Pacman_Instance_Position[Posição do Pacman]

    %% Class Details
    subgraph "pacman.js"
        Pacman_Instance_Move[pacman.moveProcess()]
        Pacman_Instance_Eat[pacman.eat()]
        Pacman_Instance_Draw[pacman.draw()]
    end

    subgraph "fantasma.js"
        Update_Ghosts[updateGhosts()] -- Itera e Chama --> Ghost_Instance_Move[ghost.moveProcess()]
        Draw_Ghosts[drawGhosts()] -- Itera e Chama --> Ghost_Instance_Draw[ghost.draw()]
        Ghost_Instance_Move -- Usa --> BFS[calculateNewDirection() - BFS]
    end

    %% UI
    subgraph "UI Elements"
        Draw_UI[Desenha UI]
        Draw_UI -- Inclui --> Draw_Score[drawScore()]
        Draw_UI -- Inclui --> Draw_Lives[drawRemainingLives()]
        Draw_UI -- Inclui --> Draw_Win[drawWinMessage()]
    end

    %% Styling
    style HTML fill:#F9F,stroke:#333,stroke-width:2px
    style Jogo fill:#bbf,stroke:#333,stroke-width:2px
    style PacmanJS fill:#ccf,stroke:#333,stroke-width:2px
    style FantasmaJS fill:#fcc,stroke:#333,stroke-width:2px
    style GameLoop fill:#dfd,stroke:#333,stroke-width:2px
```

### Detalhes da Arquitetura:

1.  **`index.html`**: É o ponto de entrada. Ele define a estrutura da página com o elemento `<canvas>`, carrega as imagens e a fonte customizada, e, crucialmente, carrega os scripts na ordem correta: `fantasma.js`, `pacman.js`, e por último `jogo.js`.

2.  **`jogo.js` (O Motor do Jogo)**:
    *   **Inicialização**: Pega os elementos do DOM (canvas, imagens), define variáveis globais como o `map` (o labirinto), `score`, `lives`, etc.
    *   **Criação de Objetos**: Instancia o `Pacman` e cria um array de `Ghost`, populando-o.
    *   **Game Loop**: A função `gameLoop` é chamada repetidamente via `setInterval`. Ela orquestra o jogo chamando as funções `update()` e `draw()`.
    *   **Lógica de Update**: A função `update()` é responsável por toda a lógica a cada frame: mover o pacman, verificar se ele comeu, atualizar a posição dos fantasmas e checar colisões.
    *   **Lógica de Desenho**: A função `draw()` limpa o canvas e redesenha todos os elementos visuais: o labirinto, as comidas, o Pacman, os fantasmas e a interface (pontuação, vidas).
    *   **Input**: Adiciona um `event listener` para o teclado, que atualiza a `nextDirection` do Pacman, permitindo o controle pelo jogador.

3.  **`pacman.js` (O Jogador)**:
    *   Define a classe `Pacman`.
    *   `moveProcess()`: Controla a movimentação, verificando se a direção desejada é possível.
    *   `checkCollisions()`: Detecta colisões com as paredes do `map`.
    *   `eat()`: Verifica se a posição atual do Pacman corresponde a uma comida no `map`.
    *   `draw()`: Desenha o Pacman no canvas, com a rotação e animação corretas.

4.  **`fantasma.js` (Os Inimigos)**:
    *   Define a classe `Ghost`.
    *   **IA de Movimento**: A lógica principal está em `moveProcess()`.
        *   `isInRange()`: Verifica se o Pacman está perto o suficiente para ser perseguido.
        *   `calculateNewDirection()`: Implementa um algoritmo de **Busca em Largura (BFS)** para encontrar o caminho mais curto até o alvo (Pacman ou um ponto aleatório), evitando as paredes. Esta é a parte mais complexa da IA.
    *   `draw()`: Desenha o fantasma no canvas.
    *   **Funções Auxiliares**: `updateGhosts()` e `drawGhosts()` são chamadas por `jogo.js` para iterar sobre todos os fantasmas e chamar seus respectivos métodos de `moveProcess` e `draw`.
