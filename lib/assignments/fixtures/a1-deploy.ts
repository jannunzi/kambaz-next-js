/**
 * Synthetic A1 student deploy used by checker tests. It follows the book's
 * Chapter 1 structure (Labs TOC layout, Lab 1 components with On your own
 * and With AI extras, and the Kambaz screens) and scores the full 113 auto
 * points. Names and URLs are made up; no student work is copied here.
 *
 * Cases from the Oct 7 QA sweep (S6, X2, X5, …) are small edits of this
 * deploy so each test shows exactly what differs.
 */
import type { AssignmentCheckProbes, HtmlFetchResult } from "../check-types";

export const FIXTURE_ORIGIN = "https://jane-doe-a1.vercel.app";

export const FIXTURE_TOC = `
<ul id="wd-toc" class="nav nav-pills">
  <li><a id="wd-home-link" href="/">Home</a></li>
  <li><a id="wd-lab1-link" href="/labs/lab1">Lab 1</a></li>
  <li><a id="wd-lab2-link" href="/labs/lab2">Lab 2</a></li>
  <li><a id="wd-lab3-link" href="/labs/lab3">Lab 3</a></li>
  <li><a id="wd-toc-book-link" href="https://kambaz.dev/book/ch1">Chapter 1</a></li>
  <li><a id="wd-kambaz-link" href="/account/signin">Kambaz</a></li>
  <li><a id="wd-github" href="https://github.com/jane-doe/webdev-client">My GitHub</a></li>
</ul>
<p>Jane Doe · CS5610</p>`;

function page(body: string, payloadIds: string[] = []): string {
  // Flight payload in a script, like a Next.js server render. It mentions ids
  // as JSON text; checks must not treat it as markup.
  const payload = payloadIds.map((id) => `\\"id\\":\\"${id}\\"`).join(",");
  return `<!DOCTYPE html><html><head><title>Kambaz</title><style>.x{color:red}</style></head><body>${body}<script>self.__next_f.push([1,"{${payload}}"])</script></body></html>`;
}

function labsPage(content: string): string {
  return page(`<table><tbody><tr><td valign="top">${FIXTURE_TOC}</td><td valign="top">${content}</td></tr></tbody></table>`, ["wd-toc"]);
}

export const LABS_INDEX_CONTENT = `
<div id="wd-labs">
  <h1>Labs</h1>
  <ul>
    <li><a href="/labs/lab1">Lab 1</a></li>
    <li><a href="/labs/lab2">Lab 2</a></li>
    <li><a href="/labs/lab3">Lab 3</a></li>
    <li><a id="wd-lab4-link" href="/labs/lab4">Lab 4</a></li>
    <li><a href="/labs/lab5">Lab 5</a></li>
  </ul>
</div>`;

export const LAB1_CONTENT = `
<div id="wd-lab1">
  <h2>Lab 1</h2>
  <div id="wd-h-tag">
    <h4>Heading Tags</h4>
    <p>Text documents are often broken up into several sections and subsections.</p>
    <h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>
    <h3 id="wd-your-heading">About me <span id="wd-your-span">(Jane)</span></h3>
    <div id="wd-ai-headings"><h4>Lab notes</h4><h5>What I built</h5><h6>Next step</h6></div>
  </div>
  <div id="wd-p-tag">
    <h4>Paragraph Tag</h4>
    <p id="wd-p-1">This is a paragraph.</p>
    <p id="wd-p-2">This is another paragraph.</p>
    <p id="wd-p-your-1">I like hiking.</p>
    <p id="wd-p-your-2">I also like coffee.</p>
    <p id="wd-ai-p">Paragraphs add vertical space between blocks of text.</p>
  </div>
  <div id="wd-lists">
    <h4>List Tags</h4>
    <ol id="wd-pancakes"><li>Mix dry ingredients.</li><li>Add wet ingredients.</li><li>Cook.</li></ol>
    <ul><li>Your favorite books</li><li>Dune</li></ul>
    <ol id="wd-your-favorite-recipe"><li>Boil water.</li><li>Add pasta.</li></ol>
    <ul id="wd-your-books"><li>Book A</li><li>Book B</li></ul>
    <ul id="wd-ai-html-tags"><li>h1</li><li>p</li><li>ul</li><li>table</li><li>img</li></ul>
  </div>
  <div id="wd-tables">
    <h4>Table Tag</h4>
    <table border="1" width="100%">
      <thead><tr><th>Quiz</th><th>Score</th></tr></thead>
      <tbody>
        <tr><td>Q1</td><td>90</td></tr><tr><td>Q2</td><td>85</td></tr><tr><td>Q3</td><td>88</td></tr>
        <tr><td>Q4</td><td>80</td></tr><tr><td>Q5</td><td>91</td></tr><tr><td>Q6</td><td>77</td></tr>
        <tr><td>Q7</td><td>89</td></tr><tr><td>Q8</td><td>95</td></tr><tr><td>Q9</td><td>83</td></tr>
        <tr><td>Q10</td><td>90</td></tr>
      </tbody>
      <tfoot><tr><td>Average</td><td>86.8</td></tr></tfoot>
    </table>
    <table id="wd-your-table"><tr><th>Day</th><th>Class</th></tr><tr><td>Mon</td><td>CS5610</td></tr></table>
  </div>
  <div id="wd-images">
    <h4>Image tag</h4>
    <img id="wd-starship" width="400" src="https://example.com/starship.jpg" alt="Starship" />
    <img id="wd-teslabot" height="200" src="/images/teslabot.jpg" alt="Teslabot" />
    <img id="wd-your-image" src="/images/me.jpg" alt="Me" />
    <img id="wd-ai-image" src="https://example.com/space.jpg" alt="Space" />
  </div>
  <div id="wd-forms">
    <h4>Form Elements</h4>
    <form id="wd-text-fields">
      <label for="wd-text-fields-username">Username:</label>
      <input id="wd-text-fields-username" placeholder="jdoe" />
      <input type="password" id="wd-text-fields-password" />
      <textarea id="wd-textarea" cols="30" rows="5">Some text</textarea>
      <input type="radio" name="genre" id="wd-radio-comedy" /><label for="wd-radio-comedy">Comedy</label>
      <input type="checkbox" id="wd-chkbox-comedy" />
      <select id="wd-select-one-genre"><option>Comedy</option><option>Drama</option></select>
      <button id="wd-all-good">Hello World!</button>
    </form>
    <form id="wd-your-form">
      <input type="text" placeholder="First name" /><input type="email" />
      <textarea>Bio</textarea>
      <button type="submit">Save</button><button type="button">Cancel</button>
    </form>
  </div>
  <p id="wd-highlighted-paragraph" style="background-color:yellow;color:blue">Highlighted text.</p>
  <p style="background-color:pink;color:black">My own highlighted sentence.</p>
  <div id="wd-highlighted-box" style="background-color:lightblue;padding:10px"><h4>Box</h4><p>Nested</p></div>
  <div id="wd-anchors">
    <h4>Anchor tag</h4>
    Please <a id="wd-lipsum" href="https://www.lipsum.com">click here</a> for dummy text.<br />
    <a id="wd-github-sample" href="https://github.com/jannunzi">The author on GitHub</a><br />
    <a id="wd-your-link" href="https://jane-doe.dev">My portfolio</a><br />
    <a id="wd-your-github" href="https://github.com/jane-doe">My GitHub</a><br />
    <a id="wd-ai-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table">MDN table</a>
  </div>
</div>`;

const KAMBAZ_NAV = `
<nav id="wd-kambaz-navigation">
  <a id="wd-account-link" href="/account">Account</a>
  <a id="wd-dashboard-link" href="/dashboard">Dashboard</a>
  <a id="wd-course-link" href="/dashboard">Courses</a>
  <a id="wd-labs-link" href="/labs">Labs</a>
</nav>`;

const COURSE_NAV = `
<div id="wd-courses-navigation">
  <a id="wd-course-home-link" href="/courses/1234/home">Home</a>
  <a id="wd-course-modules-link" href="/courses/1234/modules">Modules</a>
  <a id="wd-course-piazza-link" href="/courses/1234/piazza">Piazza</a>
  <a id="wd-course-assignments-link" href="/courses/1234/assignments">Assignments</a>
</div>`;

function kambaz(content: string): string {
  return page(`<table><tr><td valign="top">${KAMBAZ_NAV}</td><td valign="top">${content}</td></tr></table>`);
}

function course(content: string): string {
  return kambaz(`<h2>Course 1234</h2>${COURSE_NAV}${content}`);
}

export const MODULES_CONTENT = `
<div id="wd-modules">
  <div id="wd-modules-controls"><button>Collapse All</button></div>
  <ul id="wd-module-list"><li>Week 1<ul><li>Introduction</li></ul></li></ul>
</div>`;

export const ASSIGNMENTS_CONTENT = `
<div id="wd-assignments">
  <input placeholder="Search for Assignments" />
  <ul id="wd-assignment-list">
    <li><a href="/courses/1234/assignments/123">A1 - ENV + HTML</a></li>
    <li><a href="/courses/1234/assignments/124">A2 - CSS + BOOTSTRAP</a></li>
    <li><a href="/courses/1234/assignments/125">A3 - JAVASCRIPT + REACT</a></li>
  </ul>
</div>`;

export const EDITOR_CONTENT = `
<div id="wd-assignments-editor">
  <label for="wd-name">Assignment Name</label>
  <input id="wd-name" value="A1 - ENV + HTML" />
  <textarea id="wd-description">The assignment is available online.</textarea>
  <input id="wd-points" type="number" value="100" />
  <select id="wd-group"><option>ASSIGNMENTS</option></select>
</div>`;

/** Path → HTML for a passing deploy. */
export function passingDeployPages(): Record<string, string> {
  return {
    "/": page(`<div id="wd-kambaz"><a href="/account/signin">Kambaz</a> <a href="/labs">Labs</a></div>`),
    "/labs": labsPage(LABS_INDEX_CONTENT),
    "/labs/lab1": labsPage(LAB1_CONTENT),
    "/labs/lab2": labsPage("<h2>Lab 2</h2>"),
    "/labs/lab3": labsPage("<h2>Lab 3</h2>"),
    "/labs/lab4": labsPage("<h2>Lab 4</h2>"),
    "/labs/lab5": labsPage("<h2>Lab 5</h2>"),
    "/account/signin": kambaz(`
      <div id="wd-signin-screen">
        <h3>Sign in</h3>
        <input placeholder="username" class="wd-username" />
        <input placeholder="password" type="password" class="wd-password" />
        <a id="wd-signin-btn" href="/dashboard">Sign in</a>
        <a id="wd-signup-link" href="/account/signup">Sign up</a>
      </div>`),
    "/account/signup": kambaz(`
      <div id="wd-signup-screen"><h3>Sign up</h3><input placeholder="username" /><input type="password" /></div>`),
    "/account/profile": kambaz(`
      <div id="wd-profile-screen"><h3>Profile</h3><input value="alice" /><input type="date" /></div>
      <div id="wd-account-navigation"><a href="/account/signin">Signin</a><a href="/account/profile">Profile</a></div>`),
    "/dashboard": kambaz(`
      <div id="wd-dashboard"><h1 id="wd-dashboard-title">Dashboard</h1>
        <div id="wd-dashboard-courses">
          <div class="wd-dashboard-course"><a href="/courses/1234/home"><h5>CS1234 React JS</h5></a></div>
          <div class="wd-dashboard-course"><a href="/courses/1235/home"><h5>CS1235 Node</h5></a></div>
          <div class="wd-dashboard-course"><a href="/courses/1236/home"><h5>CS1236 Mongo</h5></a></div>
        </div>
      </div>`),
    "/courses/1234/home": course(`
      <div id="wd-home">${MODULES_CONTENT}
        <div id="wd-course-status"><h2>Course Status</h2><button>Unpublish</button><button>Publish</button></div>
      </div>`),
    "/courses/1234/modules": course(MODULES_CONTENT),
    "/courses/1234/assignments": course(ASSIGNMENTS_CONTENT),
    "/courses/1234/assignments/123": course(EDITOR_CONTENT),
  };
}

const NOT_FOUND: HtmlFetchResult = {
  ok: false,
  status: 404,
  code: "http_error",
  message: "HTTP 404",
};

/** Probes that serve `pages` (pathname → HTML) and 404 everything else. */
export function fixtureProbes(
  pages: Record<string, string>,
  transform: (html: string) => string = (html) => html,
): AssignmentCheckProbes {
  return {
    async getHtml(url) {
      const path = new URL(url).pathname.replace(/\/$/, "") || "/";
      const html = pages[path];
      if (html == null) return NOT_FOUND;
      return { ok: true, status: 200, finalUrl: url, html: transform(html) };
    },
    async probeUrl() {
      return { ok: true, status: 200 };
    },
  };
}
