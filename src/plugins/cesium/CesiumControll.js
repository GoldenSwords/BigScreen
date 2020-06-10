import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
let Viewer = null;
class CesiumTool {
  constructor(dom) {
    this.dom = dom;
    // 地图token
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ODZhY2RlNS02Nzg0LTQzZTUtYjc5OC0xZWNiNTcyMGI1YTMiLCJpZCI6MTkxNzgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzUwOTk0NzJ9.O7QAJ4dKjTolXb7Mi-Kpg-a9oE7eEtYLKo61cS1yfvY";
    // 天地图token
    //     TianDiTuToken = "77ff4a71beccbe1a124e99cd1ae60765";
    Viewer = new Cesium.Viewer(dom);
    var Layer = Viewer.imageryLayers.addImageryProvider(
      new Cesium.IonImageryProvider({ assetId: 2 })
    );
    Viewer.zoomTo(Layer).otherwise(function(error) {
      console.log(error);
    });
    // this.baseMap();
  }
  baseMap() {
    // 天地图矢量底图
    Viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=4d133cc2c1d12cea409bb954d40f02c9",
        layer: "tdtVecBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMaps"
      })
    );
  }
}
CesiumTool.instance = function(dom) {
  return new CesiumTool(dom);
};
export default CesiumTool;
