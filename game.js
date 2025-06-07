window.onload = function() {
    const box = document.getElementById('aaa');
    const difficultySelect = document.getElementById('difficulty');
    const startBtn = document.getElementById('startBtn');
    const moveCounter = document.getElementById('moveCounter');
    const playingSound = document.getElementById('playing-sound');
    const endSound = document.getElementById('end-sound');
    const hintIcon = document.getElementById('hintIcon');
    const referenceImage = document.getElementById('referenceImage');
    const soundToggle = document.getElementById('soundToggle');

    const images = [
        'https://images.fineartamerica.com/images/artworkimages/medium/3/the-interesting-book-seymour-joseph-guy.jpg',
        'https://wallpapers.com/images/hd/interesting-pictures-po41u39o3h7tq7u6.jpg',
        'https://c.ndtvimg.com/gws/ms/interesting-facts-about-fishing-cat/assets/2.jpeg?1741699913',
        'https://www.carredartistes.com/fr-fr/content_images/mere%20et%20enfant%20-%20Picasso.png',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&q=80',
        'https://i.pinimg.com/736x/17/76/0a/17760a6daad2edf7f4d9b837b5437246.jpg'
    ];

    let rows = 3, cols = 3, currentImage = images[0], moves = 0;
    let soundOn = true;

    // Hide the bulb icon initially
    hintIcon.style.display = 'none';

    function randomImage() {
        const idx = Math.floor(Math.random() * images.length);
        return images[idx];
    }

    function updateMoves(count) {
        moveCounter.textContent = 'Moves: ' + count;
        // Show bulb icon after 5 moves
        if (count >= 5) {
            hintIcon.style.display = 'inline';
        } else {
            hintIcon.style.display = 'none';
            // Also hide the reference image if bulb is hidden
            referenceImage.style.display = 'none';
            referenceImage.innerHTML = '';
        }
    }

    function createPuzzle(rows, cols, imageUrl) {
        box.innerHTML = '';
        box.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        box.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        const gridSize = box.offsetWidth || 400;
        const tileSize = gridSize / cols;

        const card = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                card.push([-col * tileSize, -row * tileSize]);
            }
        }

        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        let indexes = Array.from({length: rows * cols}, (_, i) => i);
        shuffle(indexes);

        let draggedElement = null;
        indexes.forEach((shuffledIndex, i) => {
            const position = card[shuffledIndex];
            const tile = document.createElement("div");
            tile.draggable = true;
            tile.style.backgroundImage = `url('${imageUrl}')`;
            tile.style.backgroundPosition = `${position[0]}px ${position[1]}px`;
            tile.style.backgroundSize = `${tileSize * cols}px ${tileSize * rows}px`;
            tile.style.width = tile.style.height = tileSize + 'px';
            tile.dataset.index = shuffledIndex;

            tile.addEventListener('dragstart', (e) => {
                draggedElement = e.target;
                e.target.classList.add('dragging');
            });

            tile.addEventListener('dragover', (e) => e.preventDefault());

            tile.addEventListener('drop', (e) => {
                e.preventDefault();
                const target = e.target;
                if (target !== draggedElement) {
                    const tempBg = draggedElement.style.backgroundPosition;
                    const tempIndex = draggedElement.dataset.index;

                    draggedElement.style.backgroundPosition = target.style.backgroundPosition;
                    draggedElement.dataset.index = target.dataset.index;

                    target.style.backgroundPosition = tempBg;
                    target.dataset.index = tempIndex;

                    moves++;
                    updateMoves(moves);
                }
                draggedElement.classList.remove('dragging');
                draggedElement = null;
                if (checkSolution()) {
                    endGame();
                    setTimeout(() => alert('Puzzle solved in ' + moves + ' moves!'), 50);
                }
            });

            box.appendChild(tile);
        });

        function checkSolution() {
            const tiles = box.children;
            for (let i = 0; i < tiles.length; i++) {
                if (parseInt(tiles[i].dataset.index) !== i) {
                    return false;
                }
            }
            return true;
        }
    }

    // Bulb icon click to toggle reference image
    hintIcon.addEventListener('click', function() {
        if (referenceImage.style.display === 'none' || referenceImage.style.display === '') {
            referenceImage.style.display = 'block';
            referenceImage.innerHTML = `<img src="${currentImage}" style="width: 100%; height: auto; display: block;">`;
        } else {
            referenceImage.style.display = 'none';
            referenceImage.innerHTML = '';
        }
    });

    // Sound toggle functionality
    soundToggle.addEventListener('click', function() {
        soundOn = !soundOn;
        soundToggle.textContent = soundOn ? '🔊' : '🔇';
        playingSound.muted = !soundOn;
        endSound.muted = !soundOn;
    });

    function startGame() {
        playingSound.currentTime = 0;
        playingSound.muted = !soundOn;
        playingSound.play().catch(error => {});
        endSound.pause();
        endSound.currentTime = 0;
        endSound.muted = !soundOn;
    }

    function endGame() {
        playingSound.pause();
        playingSound.currentTime = 0;
        endSound.currentTime = 0;
        endSound.muted = !soundOn;
        endSound.play();
    }

    // Start button click
    startBtn.addEventListener('click', function() {
        rows = cols = parseInt(difficultySelect.value, 10);
        currentImage = randomImage();
        moves = 0;
        updateMoves(moves);

        box.classList.remove('grid');
        void box.offsetWidth;
        box.classList.add('grid');

        referenceImage.style.display = 'none';
        referenceImage.innerHTML = '';
        hintIcon.style.display = 'none'; // Hide hint icon on new game

        createPuzzle(rows, cols, currentImage);
        startGame();
    });

    // Start game on load
    startBtn.click();
};
