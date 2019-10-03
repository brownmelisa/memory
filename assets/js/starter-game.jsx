import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter/>, root);
}

class Starter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numClicks: 0,
      openTiles: [],
      tiles: this.generateTiles(),
    };
    // this.tileClickHandler = this.tileClickHandler.bind(this);
  }

  // generate a list of tiles with default attributes
  generateTiles() {
    let itemsList = ["A", "B", "C", "D", "E", "F", "G", "H"];
    return (_.shuffle(_.map(_.concat(itemsList, itemsList), (item) => {
      return {value: item, hide: true, complete: false};
    })));
  }

  // resets the tiles in game state when new game button is clicked
  newGameHandler() {
    this.setState({tiles: this.generateTiles()});
    this.setState({numClicks: 0});
  };

  // must use a function to update state that depends on current state
  incrementClicks(root) {
    root.setState((state) => {
      return {numClicks: state.numClicks + 1}
    });
  }

  isGameOver() {
    // findIndex returns -1 if index not found, i.e. game over
    return (_.findIndex(
      this.state.tiles, (tile) => {
        return tile.complete === false;
      }) === -1);
  }

  showTile(index, root) {
    const tiles = [...root.state.tiles];
    tiles[index].hide = false;
    root.setState({tiles: tiles});
  }

  hideTile(index, root) {
    const tiles = [...root.state.tiles];
    tiles[index].hide = true;
    root.setState({tiles: tiles});
  }

  markComplete(index1, index2, root) {
    const tiles = [...root.state.tiles];
    tiles[index1].complete = true;
    tiles[index2].complete = true;
    root.setState({tiles: tiles});
  }

  checkMatch() {
    const tiles = [...this.state.tiles];
    let openList = [...this.state.openTiles];
    console.log(openList);
    // tiles match
    if (openList.length === 2) {
      if (tiles[openList[0]].value === tiles[openList[1]].value) {
        this.markComplete(openList[0], openList[1], this);
      }
      // tiles don't match, so hide them
      else {
        this.hideTile(openList[0], this);
        this.hideTile(openList[1], this);
      }
      this.setState({openTiles: []});
    }
  }

  tileClickHandler(index) {
    let openList = [...this.state.openTiles];
    // if 2 tiles are open, check if they match
    if (openList.length === 2) {
      setTimeout(() => {
        this.checkMatch();
      }, 1000);
    }
    // otherwise add the tile to openTiles list if it isn't a duplicate
    else if (openList.indexOf(index) === -1) {
      this.showTile(index, this);
      this.incrementClicks(this);
      openList.push(index);
      this.setState({openTiles: openList});
      if (openList.length === 2) {
        setTimeout(() => {
          this.checkMatch();
        }, 1000);
      }
    }
  }

  render() {
    let tiles = _.map(this.state.tiles, (tile, index) => {
      return <TileItem
        key={index} tile={tile}
        on_tile_click={() => {
          this.tileClickHandler(index)
        }}/>;
    });

    return (
      <div className="container" id="mem-game">
        <h1>Memory Tiles</h1>
        <div className="row">
          <div className="col-8">
            <div className="grid-container">{tiles}</div>
            <NewGameButton new_game={() => {this.newGameHandler()}}/>
          </div>

          <div className="col-4">
           <ScoreBox clicks={this.state.numClicks} game_over={this.isGameOver()}/>
          </div>
        </div>
        <a href="http://mochiswebforge.site">back to home page</a>
      </div>
    );
  }
}

function TileItem(props) {
  let {tile, on_tile_click} = props;
  // text of tile is only displayed if the hide attribute is false
  return (
    <div className="grid-item">
      <button className="tile-btn"
              disabled={tile.complete}
              onClick={on_tile_click}>
        <div className="btn-text"
             style={{display: tile.hide ? "none" : "block"}}>{tile.value}
        </div>
      </button>
    </div>
  );
}

function NewGameButton(props) {
  let {new_game} = props;
  return (
    <div>
      <button id="new-game-btn"
              onClick={new_game}>New Game
      </button>
    </div>
  );
}

function ScoreBox(props) {
  let {clicks, game_over} = props;
  return (
    <div id="score-box">
      <p>Clicks: {clicks}</p>
      {game_over ? <p>You win!</p> : null}
    </div>
  );
}

