export function BoxModelWidget() {
  return (
    <div
      className="wd-devtools-box"
      role="img"
      aria-label="Box model: margin 0, 0, 10, 0; border 10; padding 20; content 200 by 50"
    >
      <div className="wd-bm-margin">
        <span className="wd-bm-label">margin</span>
        <span className="wd-bm-top">0</span>
        <span className="wd-bm-left">0</span>
        <span className="wd-bm-right">0</span>
        <span className="wd-bm-bottom">10</span>
        <div className="wd-bm-border">
          <span className="wd-bm-label">border</span>
          <span className="wd-bm-top">10</span>
          <span className="wd-bm-left">10</span>
          <span className="wd-bm-right">10</span>
          <span className="wd-bm-bottom">10</span>
          <div className="wd-bm-padding">
            <span className="wd-bm-label">padding</span>
            <span className="wd-bm-top">20</span>
            <span className="wd-bm-left">20</span>
            <span className="wd-bm-right">20</span>
            <span className="wd-bm-bottom">20</span>
            <div className="wd-bm-content">200×50</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoxModel() {
  return (
    <div id="wd-css-box-model">
      <h2>Box model</h2>
      <BoxModelWidget />
      <h3>box-sizing</h3>
      <div className="wd-box-sizing-demo">
        <div className="wd-box-sizing-content">
          content-box: width 200px plus padding and border
        </div>
        <div className="wd-box-sizing-border">
          border-box: width 200px includes padding and border
        </div>
      </div>
    </div>
  );
}
