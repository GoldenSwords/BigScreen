class FlyLines {
  constructor(map) {
    this.map = map;
  }
  tool(data) {
    this.map.addData(data);
  }
}
FlyLines.instance = function(map) {
  return new FlyLines(map);
};
export default FlyLines;
