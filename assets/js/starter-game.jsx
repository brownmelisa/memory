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
      tiles: [],
    };
    this.newGameHandler = this.newGameHandler.bind(this);
    this.tileClickHandler = this.tileClickHandler.bind(this);
  }

  generateTiles() {
    let itemsList = ["A", "B", "C", "D", "E", "F", "G", "H"];
    return (_.shuffle(_.map(_.concat(itemsList, itemsList), (item) => {
      return {value: item, hide: true, complete: false};
    })));
  }

  newGameHandler(event) {
    this.setState({tiles: this.generateTiles()});
    this.setState({numClicks: 0});
  }

  // must use a function to update state that depends on current state
  incrementClicks(root) {
    root.setState((state) => {
      return {numClicks: state.numClicks + 1}
    });
  }

  // toggleTile(index) {
  //   const tiles = [...this.state.tiles];
  //   const isHidden = tiles[index].hide;
  //   tiles[index].hide = !isHidden;
  //   this.setState({tiles: tiles});
  // }

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

  // addToOpenList(index, root) {
  //   let openList = [...root.state.openTiles];
  //   if (openList.length < 2 && openList.indexOf(index) === -1) {
  //     openList.push(index);
  //     console.log(openList);
  //     console.log("index is", index);
  //     root.setState({openTiles: openList});
  //     return true;
  //   }
  //   return false;
  // }

  tileClickHandler(event, index, tile) {
    let openList = [...this.state.openTiles];
    if (openList.length < 2 && openList.indexOf(index) === -1) {
      openList.push(index);
      this.setState({openTiles: openList});
    } else {
      console.log("too many tiles open", openList);
      return;
    }

    console.log("open tiles are", openList);
    const tiles = [...this.state.tiles];
    this.incrementClicks(this);
    this.showTile(index, this);

    // first tile open
    if (openList.length === 1) {
      console.log("first tile open");
      return;
    }
    // tiles match
    else if (tiles[openList[0]].value === tiles[openList[1]].value) {
      this.markComplete(openList[0], openList[1], this);
      this.setState({openTiles: []});
      console.log("tiles match");
    }
    // tiles don't match
    else {
      setTimeout(() => {
        this.hideTile(openList[0], this);
        this.hideTile(openList[1], this);
      }, 1000);
      this.setState({openTiles: []});
      console.log("tiles don't match");
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
               <p>How good is your memory? <br/>Click on New Game to start playing.</p>
             </div>}
            <div className="grid-container">{tiles}</div>
            <NewGameButton root={this}/>
          </div>
          <div className="col-4">
            {this.state.tiles.length === 0 ? null : <ScoreBox root={this}/>}
          </div>
        </div>
        <a href="http://mochiswebforge.site">back to home page</a>
      </div>
    );
  }
}

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
    return (_.findIndex(root.state.tiles, (tile) => {
      return tile.complete === false;
    }) === -1);
  }

  return (
    <div id="score-box">
      <p>Clicks: {root.state.numClicks}</p>
      {isGameOver() ? <p>You've won!</p> : null}
    </div>
  );
}
