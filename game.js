window.onload = function() {
  const box = document.getElementById('aaa');
  const difficultySelect = document.getElementById('difficulty');
  const startBtn = document.getElementById('startBtn');
  const moveCounter = document.getElementById('moveCounter');

  // Add your own images here (absolute URLs or local paths)
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

  function randomImage() {
    const idx = Math.floor(Math.random() * images.length);
    return images[idx];
  }

  function updateMoves(count) {
    moveCounter.textContent = 'Moves: ' + count;
  }

  function createPuzzle(rows, cols, imageUrl) {
    box.innerHTML = '';
    box.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    box.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const gridSize = box.offsetWidth || 400;
    const tileSize = gridSize / cols;

    // Generate card coordinates dynamically
    const card = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        card.push([
          -col * tileSize,  // X position
          -row * tileSize   // Y position
        ]);
      }
    }

    // Shuffle function
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // Create an array of indexes to shuffle
    let indexes = Array.from({length: rows * cols}, (_, i) => i);
    shuffle(indexes);

    // Create grid elements
    let draggedElement = null;
    indexes.forEach((shuffledIndex, i) => {
      const position = card[shuffledIndex];
      const tile = document.createElement("div");
      tile.draggable = true;
      tile.style.backgroundImage = `url('${imageUrl}')`;
      tile.style.backgroundPosition = `${position[0]}px ${position[1]}px`;
      tile.style.backgroundSize = `${tileSize * cols}px ${tileSize * rows}px`;
      tile.style.width = tile.style.height = tileSize + 'px';
      tile.dataset.index = shuffledIndex; // Store the correct index

      // Drag & Drop handlers
      tile.addEventListener('dragstart', (e) => {
        draggedElement = e.target;
        e.target.classList.add('dragging');
      });

      tile.addEventListener('dragover', (e) => e.preventDefault());

      tile.addEventListener('drop', (e) => {
        e.preventDefault();
        const target = e.target;
        if (target !== draggedElement) {
          // Swap background positions and data-index
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
          setTimeout(() => alert('Puzzle solved in ' + moves + ' moves!'), 50);
        }
      });

      box.appendChild(tile);
    });

    // Solution checker
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

  // Start button event
  startBtn.addEventListener('click', function() {
    rows = cols = parseInt(difficultySelect.value, 10);
    currentImage = randomImage();
    moves = 0;
    updateMoves(moves);

      box.classList.remove('grid');
  // Force reflow to restart the animation
  void box.offsetWidth;
  box.classList.add('grid');

    createPuzzle(rows, cols, currentImage);
  });

  // Optionally, start with a puzzle already loaded
  startBtn.click();
};
