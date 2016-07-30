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

            if( [11].indexOf( y ) !== -1 && [8].indexOf( x ) !== -1 ){
                state = true;
            }

            if( [12, 13, 14].indexOf( y ) !== -1 && [7].indexOf( x ) !== -1 ){
                state = true;
            }

            node.style.width = cell_width + "px";
            node.style.height = cell_width + "px";
            node.style.display = "inline-block";
            node.style.border = "1px solid #fff";
            node.style.margin = 0;
            node.style.padding = 0;
            node.style.float = "left";

            if( state )
                node.style.backgroundColor = alive_color;
            else
                node.style.backgroundColor = dead_color;
        }());


        /**
         * Counts live neighbors
         *
         * @param cells
         * @returns {number}
         */
        const count_alive_neighbors = ( cells ) => {
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
        const get_new_state = ( cells ) => {
            let count = count_alive_neighbors( cells );

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
        const update = ( cells ) => {

            if( get_new_state( cells ) )
                node.style.backgroundColor = alive_color;
            else
                node.style.backgroundColor = dead_color;

            return {
                node: node,
                state: state
            };
        };

        return {
            state: state,
            update: update,
            node: node
        };
    }


    function Grid(cells){
        let grid = doc.querySelector("#grid"),
            cell_width = 10;


        /**
         * Populates cells array
         *
         * @param width
         * @param height
         */
        const init_cells = (width, height) => {
            width = width / cell_width;
            height = height / cell_width;

            for( let w = 0; w < width; w++ ){
                for( let h = 0; h < height; h++ ){
                    cells[w] = cells[w] || [];
                    cells[w][h] = new Cell(w, h);

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
            grid.style.width =  width + ( width * 2 / cell_width ) - 3 + "px";
            grid.style.height =  height + ( height * 2 / cell_width ) - 3 + "px";

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

            for( let x = 0; x < cells.length; x++ ){
                for( let y = 0; y < cells.length; y++ ){
                    grid.appendChild( cells[x][y].update(cells).node );
                }
            }

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