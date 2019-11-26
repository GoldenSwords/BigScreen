<template>
  <div>
    <el-button @click="send">send</el-button>
    <iframe ref="iframe" src="http://localhost:22122/iframe.html"></iframe>
  </div>
</template>

<script>
export default {
  name: "iframe",
  beforeMount() {
    window.addEventListener("message", message => {
      console.log("get message from iframe [", message.data, "]");
    });
  },
  mounted() {},
  methods: {
    send() {
      const q = this.$refs.iframe.src.substring(
        this.$refs.iframe.src.indexOf("//") + 2,
        this.$refs.iframe.src.length
      );
      const index = q.indexOf("/") === -1 ? q.length : q.indexOf("/");
      this.$refs.iframe.contentWindow.postMessage(
        "send to iframe",
        "http://" + q.substring(0, index)
      );
    }
  }
};
</script>

<style scoped></style>
