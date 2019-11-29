<template>
  <div style="width: 100%;height: 100%;">
    <point-map ref="map" :geo="geo" :bounds="bounds"></point-map>
    <div
      ref="side"
      style="position: absolute;right: 0;width: 20%;top: 0;text-align: center;height: 100%;background-color: rgba(0, 0, 0, 0.2);"
      :style="{
        lineHeight: lineHeight + 'px'
      }"
    >
      <el-form style="display: inline-block;">
        <el-form-item>
          <h1 style="color: #fff;">
            <span>{{ title }}</span> <span class="version">{{ version }}</span>
          </h1>
        </el-form-item>
        <el-form-item>
          <el-input v-model="username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="pwd" show-password placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <button class="loginButton" @click.prevent="loginIn">登录</button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PointMap from "@/views/canvas/PointMap";
import { login } from "@/api/system";
import { setStore } from "@/plugins/util/store";
import geoJSON from "@/plugins/map.json";
export default {
  name: "Login",
  components: {
    PointMap
  },
  data() {
    return {
      title: "大屏管理系统",
      version: "V1.0",
      requestID: null,
      time: 0,
      speed: 5000,
      username: "",
      pwd: "",
      geo: {},
      lineHeight: 0,
      bounds: {
        southwest: [73.44586543252842, 13.16888427734375],
        northeast: [150.76846313476562, 58.553741455078125]
      }
    };
  },
  beforeMount() {
    this.geo = geoJSON;
  },
  mounted() {
    this.lineHeight = this.$refs.side.clientHeight;
    this.time = new Date().getTime();
    if (this.$refs.map) {
      this.$refs.map.addData([
        { lng: 0, lat: 0, name: "北京" },
        { lng: 80, lat: 60, name: "上海" }
      ]);
    }
    this.updateData();
    setTimeout(() => {
      this.version = "V2.0";
    }, 3000);
  },
  methods: {
    updateData() {
      if (this.requestID) {
        window.cancelAnimationFrame(this.requestID);
      }
      this.requestID = window.requestAnimationFrame(() => {
        if (new Date().getTime() - this.time > this.speed) {
          this.time = new Date().getTime();
          const data = [];
          for (let i = 0; i < Math.random() * 10; i++) {
            data.push({
              lng: Math.random() * 190 + 10,
              lat: Math.random() * 80,
              name: "大屏数量:" + Math.round(Math.random() * 100),
              itemStyle: {
                symbol: Math.random() * 2 > 1 ? "rect" : "circle",
                color: [
                  Math.round(Math.random() * 255),
                  Math.round(Math.random() * 255),
                  Math.round(Math.random() * 255)
                ]
              }
            });
          }
          if (this.$refs.map) {
            this.$refs.map.addData(data);
          }
        }
        this.updateData();
      });
    },
    loginIn() {
      this.$store.commit("Login");
      login({ username: "admin", pwd: "admin" }).then(resp => {
        if (resp.data.status) {
          setStore({
            name: "login",
            content: resp.data.msg,
            type: "session"
          });
          this.$router.push("/");
        }
      });
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.requestID);
  }
};
</script>

<style scoped>
.loginButton {
  width: 100%;
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: rgb(2, 59, 146);
  box-shadow: inset 0 0 15px rgba(41, 229, 255, 0.4);
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
.loginButton:hover {
  background-color: rgb(255, 115, 0);
}
.version {
  /*width: 50%;*/
  /*font-size: 35px;*/
  text-align: right;
  display: inline-block;
  /*font-family: Agency FB;*/
  font-weight: bolder;
  background: linear-gradient(to bottom, #fff 0%, #00a6d8 90%, #56d6fb 100%);
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: currentColor;
  text-fill-color: transparent;
}
</style>
