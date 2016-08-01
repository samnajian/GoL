"use strict";

(function(doc, win){

    function Cell( x, y ){
        let cell_width = 10,
            node = doc.createElement("span"),
            state = false,
            dead_color = "#ccc",
            alive_color = "green";


        (function(){ // init cell

            if( [10].indexOf( y ) !== -1 && [6, 7, 8].indexOf( x ) !== -1 ){
                state = true;
            }


            node.style.width = cell_width + "px";
            node.style.height = cell_width + "px";
            node.style.display = "inline-block";
            node.style.border = "1px solid #fff";
            node.style.margin = 0;
            node.style.padding = 0;
            node.style.float = "left";
            node.style.boxSizing = "border-box";

            if( state )
                node.style.backgroundColor = alive_color;
            else
                node.style.backgroundColor = dead_color;
        }());


        return {
            state: state,
            node: node
        };
    }


    function Grid(cells){
        let grid = doc.querySelector("#grid"),
            cell_width = 10,
            dead_color = "#ccc",
            alive_color = "green",
            next_gen;


        /**
         * Populates cells array
         *
         * @param width
         * @param height
         */
        const init_cells = (width, height) => {
            width = width / cell_width;
            height = height / cell_width;

            for( let y = 0; y < width; y++ ){
                for( let x = 0; x < height; x++ ){
                    cells[x] = cells[x] || [];
                    cells[x][y] = new Cell(x, y);

                }
            }

        };

        /**
         * Initial draw of grid with default alive cells
         *
         * @param width
         * @param height
         */
        const initial_draw = (width, height) => {
            grid.innerHTML = "";
            grid.style.width =  width   + "px";
            grid.style.height =  height + "px";

            for( let x = 0; x < cells.length; x++ ){
                for( let y = 0; y < cells.length; y++ ){
                    grid.appendChild( cells[x][y].node );
                }
            }

        };

        /**
         * Updates cells and then the DOM
         *
         */
        const update = () => {
            grid.innerHTML = ""; // remove prev state from DOM
            next_gen = [];
            for( let y = 0; y < cells.length; y++ ){
                for( let x = 0; x < cells.length; x++ ){
                    grid.appendChild( update_cell(x, y).node );
                }
            }

            cells = next_gen;
        };

        /**
         * Initializes the grid
         *
         * @param width
         * @param height
         */
        const init = ( width, height ) => {
            init_cells(width, height);
            initial_draw(width, height);
        };


        /**
         * Counts live neighbors
         *
         * @param cells
         * @returns {number}
         */
        const count_alive_neighbors = ( x, y ) => {
            let count = 0,
                x_count = cells.length - 1; //  given cell height and width are the same this should work for the y as well

            if (y < x_count && cells[x][ y + 1 ].state ) // cell on top
                count++;

            if ( 0 !== y && cells[x][ y - 1 ].state ) // cell on bottom
                count++;

            if (0 !== x &&  cells[x - 1][ y ].state ) // cell on left
                count++;

            if ( x < x_count && cells[ x + 1 ][ y ].state ) //  cell on right
                count++;


            if ( 0 !== y && x < x_count && cells[ x + 1 ][ y - 1 ].state ) // cell bottom right
                count++;

            if ( 0 !== x && 0 !== y && cells[ x - 1 ][ y - 1 ].state ) // cell on the bottom left
                count++;

            if ( x < x_count && y < x_count && cells[ x + 1 ][ y + 1 ].state ) // cell top right
                count++;

            if (  0 !== x && y < x_count && cells[ x - 1 ][ y + 1 ].state ) // cell on top left
                count++;


            return count;
        };

        /**
         * Returns new state of cell
         *
         * @param cells
         * @returns {boolean}
         */
        const get_new_state = ( x, y, cell ) => {
            let count = count_alive_neighbors( x, y ),
                state = cell.state;

            if (state && count < 2) //  Live cell with less than 2 live cells
                state = false;

            if ( state &&  [2, 3].indexOf( count ) !== -1 ) //  Live cell with 2 or 3 live neighbors
                state = true;

            if (state && count > 3) //  Live cell with more than 3 live neighbors
                state = false;

            if (!state && count == 3) //  Dead cell with exactly  3 live neighbors
                state = true;


            return state;
        };

        /**
         * Updates the cell state
         *
         * @param cells
         * @returns {update}
         */
        const update_cell = ( x, y ) => {
            next_gen[x] = next_gen[x] || [];
            next_gen[x][y] = Cell(x, y);

            next_gen[x][y].state = get_new_state( x, y, next_gen[x][y] );
            if( next_gen[x][y] .state )
                next_gen[x][y] .node.style.backgroundColor = alive_color;
            else
                next_gen[x][y] .node.style.backgroundColor = dead_color;

            return next_gen[x][y];
        };


        return {
            init: init,
            update: update
        };
    }


    function Game( width, height  ){
        let cells = [],
            grid = new Grid( cells );

        // init
        grid.init( width, height );

        // update on intervals
        let handle = setInterval(grid.update, 600);

        doc.querySelector("#stop").addEventListener("click", function(){
            clearInterval( handle );
        });
    }


     new Game(200, 200);


}(document, window));