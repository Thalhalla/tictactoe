class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restart');
        this.playerScore = 0;
        this.botScore = 0;
        this.drawScore = 0;
        this.playerScoreDisplay = document.getElementById('player-score');
        this.botScoreDisplay = document.getElementById('bot-score');
        this.drawScoreDisplay = document.getElementById('draw-score');
        
        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            cell.textContent = '';
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.board = Array(9).fill('');
        this.updateStatus();
    }

    handleCellClick(event) {
        const clickedCell = event.target;
        const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.makeMove(cellIndex);
        
        if (this.gameActive) {
            setTimeout(() => this.botMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        
        if (this.checkWin()) {
            this.gameActive = false;
            this.statusDisplay.textContent = `${this.currentPlayer} wins!`;
            if (this.currentPlayer === 'X') {
                this.playerScore++;
                this.playerScoreDisplay.textContent = this.playerScore;
            } else {
                this.botScore++;
                this.botScoreDisplay.textContent = this.botScore;
            }
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.statusDisplay.textContent = "It's a draw!";
            this.drawScore++;
            this.drawScoreDisplay.textContent = this.drawScore;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    botMove() {
        const bestMove = this.findBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove);
        }
    }

    findBestMove() {
        // First, try to win
        const winMove = this.findWinningMove('O');
        if (winMove !== -1) return winMove;

        // Second, block player's winning move
        const blockMove = this.findWinningMove('X');
        if (blockMove !== -1) return blockMove;

        // Third, take center if available
        if (this.board[4] === '') return 4;

        // Fourth, take corners if available
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Finally, take any available space
        const availableMoves = this.board.reduce((acc, curr, idx) => {
            if (curr === '') acc.push(idx);
            return acc;
        }, []);

        return availableMoves.length > 0 ? 
            availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
    }

    findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        return -1;
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] !== '' &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return !this.board.includes('');
    }

    updateStatus() {
        this.statusDisplay.textContent = `${this.currentPlayer === 'X' ? 'Your' : "Bot's"} turn`;
    }

    restartGame() {
        this.cells.forEach(cell => cell.textContent = '');
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateStatus();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});