<template>
  <div class="root" style="display: flex;">
    <el-row>
      <el-col :span="12">
        <el-button @click="restart" size="mini" type="primary">重玩</el-button>
        雷量:<el-input-number
          v-model="boomSet"
          size="mini"
          :step="10"
          controls-position="right"
          @change="handleChange"
          :min="1"
        ></el-input-number>
      </el-col>
      <el-col :span="12">
        <div
          style="text-align: right"
          :class="{ vec: !playState && score > 0 }"
        >
          当前得分:{{ score }} 剩余地雷:{{ boom }} 当前生命:{{ life }} 用时:{{
            userTime
          }}秒
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div style="text-align: center">
        <span
          STYLE="display: inline-block;"
          :class="{ vec: !playState && score > 0 }"
        >
          {{ message }}
        </span>
      </div>
    </el-row>
    <div v-for="(item, index) in gridIndex" :key="`y_${index}`" class="row">
      <div
        ref="${index}_${idx}"
        v-for="(grid, idx) in item"
        :key="`x_${idx}`"
        class="box"
        :class="{
          'iconfont iconbiaoji orange': grid.right,
          blue: grid.active && grid.value !== 0,
          gray: grid.active && grid.value === 0,
          'iconfont icondilei red': grid.active && grid.value === -1
        }"
        @click="toggle(index, idx)"
        @contextmenu="right(index, idx, $event)"
      >
        <template v-if="grid.active && grid.value > 0">
          {{ grid.value }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "- _ -",
      size: 10,
      grid: [],
      gridIndex: [],
      boom: 0,
      score: 0,
      gameOver: "游戏结束!",
      boomSet: 1,
      life: 3,
      lifeSet: 3,
      userTime: 0,
      time: 0,
      timer: null,
      playState: true
    };
  },
  beforeDestroy() {
    this.clearTime();
  },
  mounted() {
    this.restart();
  },
  watch: {
    playState(val) {
      if (!val) {
        this.message = this.gameOver;
        this.clearTime();
        this.calScore();
      }
    },
    life(val) {
      if (val <= 0) {
        this.playState = false;
      }
    },
    boom(val) {}
  },
  methods: {
    handleChange() {
      this.restart();
    },
    calScore() {
      let play = false;
      let right = 0;
      let boom = 0;
      let score = 0;
      this.gridIndex.forEach(i => {
        i.forEach(g => {
          if (!g.active && !g.right) {
            play = true;
          } else if (g.active && g.value === -1) {
            boom++;
            score--;
          } else if (g.right && g.value === -1) {
            right++;
            score++;
          } else if (g.right) {
            right++;
          }
        });
      });
      if (!play && right + boom === this.boomSet) {
        this.score = score;
        this.playState = false;
      } else if (boom >= this.boomSet) {
        this.score = score;
        this.playState = false;
      }
    },
    boomOne(count, indexArr) {
      const r = Math.round(Math.random() * (indexArr.length - 1));
      if (this.grid[indexArr[r][0]][indexArr[r][1]] === 0) {
        this.grid[indexArr[r][0]][indexArr[r][1]] = 1;
        this.$set(this.grid, indexArr[r][0], this.grid[indexArr[r][0]]);
        console.log(indexArr[r]);
        count--;
      }
      if (count > 0) {
        this.boomOne(count, indexArr);
      }
    },
    renderDomData() {
      this.time = new Date().getTime();
      this.message = "游戏开始";
      this.score = 0;
      this.playState = true;
      this.life = this.lifeSet;
      this.boom = this.boomSet;
      this.grid.splice(0, this.grid.length);
      this.gridIndex.splice(0, this.gridIndex.length);
      const arr = [];
      for (let i = 0; i < this.size; i++) {
        this.grid.push(new Array(this.size));
        for (let j = 0; j < this.size; j++) {
          arr.push([i, j]);
          this.grid[i][j] = 0;
        }
      }
      this.boomOne(this.boomSet, arr);
      for (let i = 0; i < this.size; i++) {
        const arr = [];
        for (let j = 0; j < this.size; j++) {
          arr.push({
            active: false,
            right: false,
            value: this.calcIndexCount(j, i)
          });
        }
        this.gridIndex.push(arr);
      }
      this.calcTime();
    },
    clearTime() {
      if (this.timer) {
        cancelAnimationFrame(this.timer);
      }
    },
    calcTime() {
      this.clearTime();
      this.timer = requestAnimationFrame(() => {
        this.userTime = Math.ceil((new Date().getTime() - this.time) / 1000);
        this.calcTime();
      });
    },
    restart() {
      this.renderDomData();
    },
    L(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x + 1];
      count += this.grid[y + 1][x];
      count += this.grid[y + 1][x + 1];
      count += this.grid[y - 1][x];
      count += this.grid[y - 1][x + 1];
      return count;
    },
    R(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x - 1];
      count += this.grid[y + 1][x];
      count += this.grid[y + 1][x - 1];
      count += this.grid[y - 1][x];
      count += this.grid[y - 1][x - 1];
      return count;
    },
    T(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x - 1];
      count += this.grid[y][x + 1];
      count += this.grid[y + 1][x];
      count += this.grid[y + 1][x - 1];
      count += this.grid[y + 1][x + 1];
      return count;
    },
    B(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x - 1];
      count += this.grid[y][x + 1];
      count += this.grid[y - 1][x];
      count += this.grid[y - 1][x - 1];
      count += this.grid[y - 1][x + 1];
      return count;
    },
    RT(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x - 1];
      count += this.grid[y + 1][x];
      count += this.grid[y + 1][x - 1];
      return count;
    },
    LT(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x + 1];
      count += this.grid[y + 1][x];
      count += this.grid[y + 1][x + 1];
      return count;
    },
    RB(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x - 1];
      count += this.grid[y - 1][x];
      count += this.grid[y - 1][x - 1];
      return count;
    },
    LB(x, y) {
      let count = 0;
      count += this.grid[y - 1][x];
      count += this.grid[y - 1][x + 1];
      count += this.grid[y][x];
      count += this.grid[y][x + 1];
      return count;
    },
    CENTER(x, y) {
      let count = 0;
      count += this.grid[y][x];
      count += this.grid[y][x - 1];
      count += this.grid[y][x + 1];
      count += this.grid[y + 1][x];
      count += this.grid[y + 1][x - 1];
      count += this.grid[y + 1][x + 1];
      count += this.grid[y - 1][x];
      count += this.grid[y - 1][x - 1];
      count += this.grid[y - 1][x + 1];
      return count;
    },
    calcIndexCount(x, y) {
      let c = 0;
      if (this.grid[y][x]) {
        return -1;
      }
      if (y !== 0 && y !== this.size - 1 && x !== 0 && x !== this.size - 1) {
        c = this.CENTER(x, y);
      } else if (y === 0 && x === 0) {
        c = this.LT(x, y);
      } else if (y === 0 && x === this.size - 1) {
        c = this.RT(x, y);
      } else if (y === 0) {
        c = this.T(x, y);
      } else if (y === this.size - 1 && x === 0) {
        c = this.LB(x, y);
      } else if (y === this.size - 1 && x === this.size - 1) {
        c = this.RB(x, y);
      } else if (y === this.size - 1) {
        c = this.B(x, y);
      } else if (x === 0) {
        c = this.L(x, y);
      } else if (x === this.size - 1) {
        c = this.R(x, y);
      }
      return c;
    },
    right(y, x, ev) {
      ev.preventDefault();
      if (this.gridIndex[y][x].active || !this.playState) {
        return;
      }
      this.gridIndex[y][x].right = !this.gridIndex[y][x].right;
      this.$set(this.gridIndex, y, this.gridIndex[y]);
      this.boom += this.gridIndex[y][x].right ? -1 : 1;
      this.calScore();
    },
    clean(y, x) {
      //<0
      let xi = x - 1;
      let yi = y - 1;
      if (
        yi >= 0 &&
        xi >= 0 &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        yi >= 0 &&
        xi >= 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }
      xi = x;
      yi = y - 1;
      if (
        yi >= 0 &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        yi >= 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }
      xi = x + 1;
      yi = y - 1;
      if (
        yi >= 0 &&
        xi < this.size &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        yi >= 0 &&
        xi < this.size &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }

      //===0
      xi = x - 1;
      yi = y;
      if (
        xi >= 0 &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        xi >= 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }
      xi = x + 1;
      yi = y;
      if (
        xi < this.size &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        xi < this.size &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }

      //>0

      xi = x - 1;
      yi = y + 1;
      if (
        yi < this.size &&
        xi >= 0 &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        yi < this.size &&
        xi >= 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }
      xi = x;
      yi = y + 1;
      if (
        yi < this.size &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        yi < this.size &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }
      xi = x + 1;
      yi = y + 1;
      if (
        yi < this.size &&
        xi < this.size &&
        this.gridIndex[yi][xi].value === 0 &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
        this.clean(yi, xi);
      } else if (
        yi < this.size &&
        xi < this.size &&
        !this.gridIndex[yi][xi].active &&
        !this.gridIndex[yi][xi].right
      ) {
        this.gridIndex[yi][xi].active = true;
        this.$set(this.gridIndex, yi, this.gridIndex[yi]);
      }
    },
    cleanZero(y, x) {
      this.clean(y, x);
    },
    toggle(y, x) {
      if (
        this.gridIndex[y][x].right ||
        this.gridIndex[y][x].active ||
        !this.playState
      ) {
        return;
      }
      this.gridIndex[y][x].active = true;
      this.$set(this.gridIndex, y, this.gridIndex[y]);
      this.message = "安全";
      if (this.gridIndex[y][x].value === -1) {
        this.message = "踩到了地雷";
        this.boom--;
        this.life--;
        this.score--;
      } else if (this.gridIndex[y][x].value === 0) {
        this.cleanZero(y, x);
      }
      this.calScore();
    }
  }
};
</script>

<style scoped>
@import "../../assets/font/iconfont.css";
.root {
  display: flex;
  flex-direction: column;
}
.row {
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  cursor: pointer;
  /* width: 10px; */
  height: 20px;
  line-height: 20px;
  /* background: #fff; */
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  /* text-shadow: 1px 1px grey; */
  /* margin: 10px; */
  /* cursor: pointer; */
  font-size: 12px;
  /* color: #fff; */
  -webkit-box-shadow: 1px 1px 2px grey;
  box-shadow: 1px 1px 2px grey;
  /* border-radius: 100%; */
  text-align: center;
  border-radius: 5px;
  /* padding: 10px; */
  font-size: 12px;
  text-decoration: none;
  margin: 10px;
  color: #fff;
  position: relative;
  display: inline-block;
}
.blue {
  background-color: #55acee;
  box-shadow: 0px 5px 0px 0px #3c93d5;
}
.red {
  background-color: #e74c3c;
  box-shadow: 0px 5px 0px 0px #ce3323;
}
.green {
  background-color: #2ecc71;
  box-shadow: 0px 5px 0px 0px #15b358;
}
.orange {
  background-color: #e67e22;
  box-shadow: 0px 5px 0px 0px #cd6509;
}
.gray {
  background-color: #bbb5b51c;
  box-shadow: 0px 5px 0px 0px #bbb5b53d;
}
.box.active {
  box-shadow: 1px 1px 2px black;
  background: gray;
}
.box.right {
  box-shadow: 1px 1px 2px yellow;
  background: orange;
}
.box.boom {
  box-shadow: 1px 1px 2px red;
  background: black;
}
.vec {
  font-weight: bold;
  font-style: italic;
  color: black;
  animation: vector 10s;
  animation-iteration-count: infinite;
}
@keyframes vector {
  0% {
    color: black;
  }
  10% {
    color: red;
  }
  20% {
    color: orange;
  }
  30% {
    color: yellow;
  }
  40% {
    color: green;
  }
  50% {
    color: palegreen;
  }
  70% {
    color: blue;
  }
  85% {
    color: purple;
  }
  100% {
    color: black;
  }
}
</style>
