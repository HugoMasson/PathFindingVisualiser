/* best alternative to enums I found (e.g java) */
const CasesType = {
	free: 0,
	visualiser: 1,
	obstacle: 2,
	startPos: 3,
    path:4,
    endPos: 5
}

class Map {

    constructor(width, height, type=4) {
        this.width  = width;
        this.height = height;
        this.type   = type;
        this.arr    = Array.from(Array(height), _ => Array(width).fill(0));
    }

    /* Is it 4 way movement or 8 way !irrelevant for now! */
    setType(type) {
        this.type = type
    }

    /* return a 2D array with all the obstacles */
    getAllObstacleAs2DArray() {
        let result = []
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                if(this.arr[i][j] == CasesType.obstacle)
                    result.push([i, j])
            }
        }
        //console.log(result)
        return result;
    }

    /* return a 2D array with all the "progress" of the algo */
    getAllProgressAs2DArray() {
        let result = []
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                if(this.arr[i][j] == CasesType.visualiser)
                    result.push([i, j])
            }
        }
        //console.log(result)
        return result;
    }

    /* Delete 1 obstacle */
    deleteObstacle(a) {
        if(a !== undefined)
            this.arr[a[1]][a[0]] = 0
    }
}