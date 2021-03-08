(function () {


    class Application {
        constructor() {
            this.n = 10;
            this.m = 10;
            this.mine_map = {};
            this.ui_map = {};

            document.getElementById('restart').onclick = () => this.onRestart();
            document.getElementById('playground').onmousedown = (ev) => this.onCellClick(ev);
            this.containerEl = document.getElementById('container');
            this.playgroundEl = document.getElementById('playground');
            document.body.oncontextmenu = () => false;
        }

        onRestart() {
            this.start({});
        }

        onCellClick({target, button}) {
            const x = +target.getAttribute('x'),
                y = +target.getAttribute('y'),
                coord = `${x}-${y}`;

            console.log(button)
            switch (button) {
                case 0:
                    this.click(x, y);
                    break;

                case 2:
                    if (!this.ui_map[coord] || this.ui_map[coord] === 2) {
                        this.ui_map[coord] = 2 - this.ui_map[coord];
                    }
                    target.classList.remove('flag');
                    this.ui_map[coord] === 2 && target.classList.add('flag');
                    break;
                case 3:
                    console.log(123123)
            }


        }

        click(x, y) {
            const coord = `${x}-${y}`,
                target = document.getElementById(coord);

            if (this.mine_map[coord]) {
                for (let id in this.mine_map) {
                    this.mine_map[id] && document.getElementById(id).classList.add('bomb');
                }
                target.classList.add('exploded');
            } else if (!this.ui_map[coord]) {
                this.ui_map[coord] = 1;
                target.classList.add('open');
                (target.innerHTML = this.getBombs(x, y) || '') || this.checkNeighborhoods(x, y);
            }
        }

        getBombs(x, y) {
            let i, j, count = 0;
            for (i = -1; i < 2; i++)
                for (j = -1; j < 2; j++)
                    count += this.mine_map[`${i + x}-${j + y}`] ? 1 : 0;

            return count;
        }

        checkNeighborhoods(x, y) {
            let i, j;
            for (i = -1; i < 2; i++)
                for (j = -1; j < 2; j++)
                    if (this.mine_map[`${i + x}-${j + y}`] !== 2 && this.mine_map[`${i + x}-${j + y}`] !== undefined)
                        this.click(i + x, j + y);
        }

        start(options) {
            let html = [];

            this.n = options.N || 10;
            this.m = options.M || 10;
            this.containerEl.style.width = this.n * (20 + 2) + 'px';
            const a = [];
            for (let j, i = 0; i < this.n; i++) {
                a.length = 0;
                for (j = 0; j < this.m; j++) {
                    this.mine_map[`${i}-${j}`] = Math.random() < 0.2 ? 1 : 0;
                    this.ui_map[`${i}-${j}`] = null;
                    html.push(`<div id="${i}-${j}" class="cell" x="${i}" y="${j}"></div>`);
                    a.push(this.mine_map[`${i}-${j}`]);
                }
            }
            this.playgroundEl.innerHTML = html.join('');
        }

    }


    new Application().start({N: 10, m: 10});

})()