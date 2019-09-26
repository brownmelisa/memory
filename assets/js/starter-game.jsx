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
      tilesOpen: [],
      tiles: [],
    };
    this.newGameHandler = this.newGameHandler.bind(this);
    this.tileClickHandler = this.tileClickHandler.bind(this);
    // this.toggleTile = this.toggleTile.bind(this);
    this.hideTile = this.hideTile.bind(this);
    this.showTile = this.showTile.bind(this);
  }

  generateTiles() {
    let itemsList = ["A", "B", "C", "D", "E", "F", "G", "H"];
    let newTiles = _.shuffle(_.map(_.concat(itemsList, itemsList), (item) => {
      return {value: item, hide: true, complete: false};
    }));
    return newTiles;
  };

  newGameHandler(event) {
    let tiles = this.generateTiles();
    this.setState({tiles: tiles});
    // this.setState(_.assign({}, this.state, {tiles: newTiles}));
    this.setState({numClicks: 0});
  }

  // must use a function to update state that depends on current state
  incrementClicks() {
    this.setState((state) => {
      return {numClicks: state.numClicks + 1}
    });
  }

  // toggleTile(index) {
  //   const tiles = [...this.state.tiles];
  //   const isHidden = tiles[index].hide;
  //   tiles[index].hide = !isHidden;
  //   this.setState({tiles: tiles});
  // }

  showTile(index) {
    const tiles = [...this.state.tiles];
    tiles[index].hide = false;
    this.setState({tiles: tiles});
  }

  hideTile(index) {
    const tiles = [...this.state.tiles];
    tiles[index].hide = true;
    this.setState({tiles: tiles});
  }

  markComplete(index1, index2) {
    const tiles = [...this.state.tiles];
    tiles[index1].complete = true;
    tiles[index2].complete = true;
    this.setState({tiles: tiles});
  }

  tileClickHandler(event, index, tile) {
    const openTiles = [...this.state.tilesOpen];  // or this.state.tilesOpen.slice();
    const tiles = [...this.state.tiles];

    // handle double click events
    if (openTiles[0] === index) {
      return;
    }

    this.incrementClicks();
    this.showTile(index);  // show content of clicked tile

    // no tiles open: open selected tile and add to open tiles list
    if (openTiles.length === 0) {
      openTiles.push(index);
      this.setState({tilesOpen: openTiles});
    }
    // clicked on second tile: check match and update attributes
    else if (openTiles.length === 1) {
      if (tiles[openTiles[0]].value === tiles[index].value) {
        this.markComplete(openTiles[0], index);
        this.showTile(openTiles[0]);
      } else {
        setTimeout(() => {
          // hide text of both tiles
          this.hideTile(openTiles[0]);
          this.hideTile(index);
        }, 1000);
      }
      this.setState({tilesOpen: []});
    }
  }

  render() {
    let tiles = _.map(this.state.tiles, (tile, index) => {
      return <TileItem key={index} index={index} root={this} tile={tile}/>;
    });

    return (
      <div className="container" id="mem-game">
        <h1>Memory Tiles</h1>
        <div className="row">

          <div className="col-8">
            {this.state.tiles.length > 0 ? null :
             <div>
               <p>How good is your memory? <br/>
                 Click on New Game to start playing.</p>
             </div>}
            <div className="grid-container">{tiles}</div>
            <NewGameButton root={this}/>
          </div>

          <div className="col-4">
            {this.state.tiles.length === 0 ? null : <ScoreBox root={this}/>}
          </div>

        </div>
      </div>
    );
  }
}

// displays a tile as a grid item corresponding
function TileItem(props) {
  let {index, root, tile} = props;

  // text of tile is only displayed if the hide attribute is false
  return (
    <div className="grid-item">
      <button
        className="tile-btn"
        disabled={tile.complete}
        onClick={(event) => root.tileClickHandler(event, index, tile)}>
        <div className="btn-text"
             style={{display: tile.hide ? "none" : "block"}}>
          {tile.value}
        </div>
      </button>
    </div>
  );
}

function NewGameButton(props) {
  let {root} = props;
  return (
    <div>
      <button id="new-game-btn"
              onClick={root.newGameHandler}>New Game
      </button>
    </div>
  );
}

function ScoreBox(props) {
  let {root} = props;

  function isGameOver() {
    // findIndex returns -1 if index not found, i.e. game over
    return (_.findIndex(root.state.tiles, (tile) => {return tile.complete === false;}) === -1);
  }

  return (
    <div id="score-box">
      <p>Clicks: {root.state.numClicks}</p>
      {isGameOver() ? <p>You've won!</p>: null}
    </div>
  );
}
