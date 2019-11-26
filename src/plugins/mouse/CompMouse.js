import event from "../event";

const MouseEventType = {
  CLICK: "click",
  DBCLICK: "dbclick",
  MOUSEOVER: "mouseover",
  MOUSEMOVE: "mousemove",
  MOUSEUP: "mouseup",
  MOUSEDOWN: "mousedown"
};

class Event_Plugin {
  constructor(target, event, callback) {
    this.target = target;
    this.eventList = [];
    this.callback = callback;
    this.bindEvent(event);
  }
  bindEvent(type) {
    switch (type) {
      case MouseEventType.CLICK:
        this.target.addEventListener("click", this.Mouse_Click);
        this.eventList.push({
          event: MouseEventType.CLICK,
          handle: this.Mouse_Click
        });
        break;
      case MouseEventType.DBCLICK:
        this.target.addEventListener("dbclick", this.Mouse_DBClick);
        this.eventList.push({
          event: MouseEventType.DBCLICK,
          handle: this.Mouse_DBClick
        });
        break;
      case MouseEventType.MOUSEOVER:
        this.target.addEventListener("mouseover", this.Mouse_Hover);
        this.eventList.push({
          event: MouseEventType.MOUSEOVER,
          handle: this.Mouse_Hover
        });
        break;
      case MouseEventType.MOUSEMOVE:
        this.target.addEventListener("mousemove", this.Mouse_Move);
        this.eventList.push({
          event: MouseEventType.MOUSEMOVE,
          handle: this.Mouse_Move
        });
        break;
      case MouseEventType.MOUSEUP:
        this.target.addEventListener("mouseup", this.Mouse_Up);
        this.eventList.push({
          event: MouseEventType.MOUSEUP,
          handle: this.Mouse_Up
        });
        break;
      case MouseEventType.MOUSEDOWN:
        this.target.addEventListener("mousedown", this.Mouse_Down);
        this.eventList.push({
          event: MouseEventType.MOUSEDOWN,
          handle: this.Mouse_Down
        });
        break;
    }
  }

  Mouse_Click(e) {
    this.callback(e);
  }
  Mouse_DBClick(e) {
    this.callback(e);
  }
  Mouse_Hover(e) {
    this.callback(e);
  }
  Mouse_Move(e) {
    this.callback(e);
  }
  Mouse_Up(e) {
    this.callback(e);
  }
  Mouse_Down(e) {
    this.callback(e);
  }
  destory() {
    for (const i in this.eventList) {
      this.target.removeEventListener(
        this.eventList[i].event,
        this.eventList[i].handle
      );
    }
  }
}
Event_Plugin.instance = function(target) {
  return new Event_Plugin(target, event);
};
export default Event_Plugin;
