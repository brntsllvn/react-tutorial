import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
  
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return ( 
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {    
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function alreadyClickedSquare(square) {
  return square;
}

function mapSquareIdToColRow(i) {
  if (!i || i === -1) return null;
  
  var map = {
    0: [0,0],
    1: [1,0],
    2: [2,0],
    3: [0,1],
    4: [1,1],
    5: [2,1],
    6: [0,2],
    7: [1,2],
    8: [2,2]
  }

  if (!(i in map)) {
    throw "Square does not exist!"
  }

  return map[i];
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        currentSquare: -1
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  whoIsNext() {
    return (
      this.state.xIsNext ? 'X' : 'O'
    )
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || alreadyClickedSquare(squares[i])) {
      return;
    }
    squares[i] = this.whoIsNext();
    this.setState({
      history: history.concat([{
        squares: squares,
        currentSquare: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  getDesc(move, history) {
    const historySquare = history[move].currentSquare;
    const currColRow = mapSquareIdToColRow(historySquare);

    console.log("history square");
    console.log(historySquare);

    if (move && currColRow) {
      const col = currColRow[0];
      const row = currColRow[1];
      return 'Go to move #' + move + ': (' + col + ', ' + row + ')';
    } else {
      return 'Go to game start';
    }    
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    // console.log(history);
    // console.log(current);
    
    const moves = history.map((step, move) => {
      const desc = this.getDesc(move, history);
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    const winner = calculateWinner(current.squares); 
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + this.whoIsNext();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
    
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  