import LectureDemoFrame from "./LectureDemoFrame";

export default function HashTocEmbed() {
  return (
    <LectureDemoFrame label="Wikipedia-style #hash TOC">
      <div className="font-sans text-lg [&_a]:underline">
        <p className="mt-0 mb-2 font-semibold">On this page</p>
        <ul className="mb-6 mt-0">
          <li>
            <a href="#wd-hash-intro">Introduction</a>
          </li>
          <li>
            <a href="#wd-anchor-bottom">Jump to bottom</a>
          </li>
        </ul>
        <h5 id="wd-hash-intro" className="mt-0">
          Introduction
        </h5>
        <p>
          A hash fragment is not a new route. The browser scrolls to the element
          whose <code>id</code> matches the text after <code>#</code>.
        </p>
        <p id="wd-anchor-bottom">
          You landed here via <code>#wd-anchor-bottom</code>.
        </p>
      </div>
    </LectureDemoFrame>
  );
}
