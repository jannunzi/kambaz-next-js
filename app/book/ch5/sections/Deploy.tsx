import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function Deploy() {
  return (
    <Section
      id="sec-5-5"
      title="5.5 Deploying RESTful Web Service APIs to a Public Remote Server"
    >
      <p>
        Up to this point you should have a working two-tiered
        application with the first tier consisting of a front-end React
        user interface application and the second tier consisting of a
        Node Express HTTP server application. In this section we are
        going to learn how to replicate this setup so that it can
        execute on remote servers. All development should be done in
        the local development environment on your personal development
        computer, and only when we are satisfied that all works fine
        locally should we make an effort at deploying the application
        on remote servers.
      </p>
      <p>
        The React Web application is already configured to deploy and
        run remotely on{" "}
        <OfficialLink href="https://vercel.com/">Vercel</OfficialLink>{" "}
        when you commit and push to the GitHub repository containing
        the source for the project. This section demonstrates how to
        configure the Node Express HTTP server project to deploy to a
        remote server hosted by{" "}
        <OfficialLink href="https://render.com/">Render</OfficialLink>{" "}
        (or Heroku) and then integrate the remote React Web application
        on Vercel with the Node Express server deployed and running on
        Render (or Heroku).
      </p>

      <Section
        level={3}
        id="sec-5-5-1"
        title="5.5.1 Committing and Pushing the Node Server Source to GitHub"
      >
        <p>
          First create a local Git repository in the Node Express
          project by typing{" "}
          <code>git init</code>{" "}at the command line at the root of
          the project. It is okay if the repository was already
          initialized. The working source in this book repo is already{" "}
          <code>webdev-server/</code>{" "}at the Next.js root, which is
          convenient for LiveDemos, but delivery still wants a{" "}
          <strong>separate</strong>{" "}GitHub repository so graders can
          open the server history without the Next.js tree. In that
          folder run <code>git init</code>{" "}if you have not already.
        </p>
        <CodeBlock language="shell">{`git init`}</CodeBlock>
        <p>
          Configure the Git repository to disregard unnecessary files
          by listing them in{" "}
          <code>.gitignore</code>. Create a new file called{" "}
          <code>.gitignore</code>{" "}if it does not already exist. Note
          the leading period in front of the file name. The file should
          contain at least{" "}
          <code>node_modules</code>, but should also contain any
          IDE-specific files or directories. If using IntelliJ, include
          the <code>.idea</code>{" "}folder. Environment files such as{" "}
          <code>.env</code>{" "}and{" "}
          <code>.env.development</code>{" "}should also be included in{" "}
          <code>.gitignore</code>{" "}so session secrets and local URLs
          never land on GitHub.
        </p>
        <CodeBlock language="shell">{`# webdev-server/.gitignore
node_modules
.env
.env.development
.idea`}</CodeBlock>
        <p>
          Use <code>git add</code>{" "}to add all the source code into
          the repository and commit with a simple comment. Then head
          over to github.com and create a{" "}
          <strong>public</strong>{" "}repository named{" "}
          <code>webdev-server</code>. Add this repository as the origin
          target using the{" "}
          <code>git remote</code>{" "}command. Make sure to use your
          GitHub username instead of a sample account. Push the code in
          your local repository to the remote origin repository. Note
          that your default branch might be called{" "}
          <code>main</code>{" "}or{" "}
          <code>master</code>. Refresh the remote GitHub repository and
          confirm the code is now available online.
        </p>
        <CodeBlock language="shell">{`git add .
git commit -m "first commit"
git remote add origin https://github.com/<you>/webdev-server.git
git push -u origin main`}</CodeBlock>
        <p>
          Work on branch{" "}
          <code>a5</code>{" "}in <em>both</em>{" "}repos — the Next.js
          client and this new server repository. Creating{" "}
          <code>a5</code>{" "}now means Render and Vercel can track the
          assignment branch instead of mixing earlier chapters into the
          same history. After the first push,{" "}
          <code>git checkout -b a5</code>{" "}and push that branch as
          well so <SectionLink to="5.7" />{" "}can point graders at a
          stable pair of URLs.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-5-2"
        title="5.5.2 Deploying to Render.com from GitHub"
      >
        <p>
          If you do not already have an account at render.com, create a
          new account to deploy the Node server remotely. From the
          dashboard on the top right, select{" "}
          <strong>Add New</strong>{" "}and then{" "}
          <strong>Web Service</strong>. In the New web service screen,
          in the Source Code option, select the Git Provider tab,
          search for the git repository created earlier and select it
          from the dropdown list. In the Name field, type the name of
          the application, e.g., use the same name as the GitHub
          repository <code>webdev-server</code>, or something similar.
          In the Build Command field type{" "}
          <code>npm install</code>. In the Start Command field type{" "}
          <code>npm start</code>{" "}or{" "}
          <code>node index.js</code>. Under the Instance Type select{" "}
          <strong>Free</strong>{" "}— the first request after idle can
          be slow while Render wakes the service. In the Environment
          Variables section click Add Environment Variable to create
          all the environment variables in the{" "}
          <code>.env</code>{" "}file, but with the production values
          shown below.
        </p>
        <ul>
          <li>
            <code>SERVER_ENV</code>{" "}= <code>production</code>
          </li>
          <li>
            <code>CLIENT_URL</code>{" "}= your Vercel origin (no
            trailing slash), for example{" "}
            <code>https://your-app.vercel.app</code>
          </li>
          <li>
            <code>SERVER_URL</code>{" "}= the Render hostname{" "}
            <em>without</em>{" "}<code>https://</code>, for example{" "}
            <code>webdev-server.onrender.com</code>
          </li>
          <li>
            <code>SESSION_SECRET</code>{" "}= a phrase that is not
            committed — not the sample string from the notes
          </li>
        </ul>
        <p>
          For the{" "}
          <code>CLIENT_URL</code>{" "}environment variable, use the URL
          of your React Web application deployed on Vercel, not a
          sample from these notes. For{" "}
          <code>SERVER_URL</code>, use the domain name in the Name
          field, but make sure it has the postfix{" "}
          <code>.onrender.com</code>. Note that after the application
          deploys, Render might modify the domain name slightly if the
          domain is already taken. You will need to edit the
          environment variable so that its value is the actual domain
          name. Make sure that{" "}
          <code>SERVER_URL</code>{" "}does not contain{" "}
          <code>http://</code>{" "}or{" "}
          <code>https://</code>{" "}as a prefix.
        </p>
        <p>
          Click Deploy Web Service to deploy the server. In the deploy
          screen take a look at the logs. You can click on Maximize to
          see the logs better. Look for a Build successful message. You
          can click on Minimize to minimize the logs. If the deployment
          fails, fix whatever the logs complain about, commit and push
          changes to GitHub, and try deploying again by selecting
          Deploy last commit from the Manual Deploy drop menu at the
          top right. If the deployment succeeds a URL appears at the
          top of the screen. Navigate to that URL and confirm you get
          the same greeting you would get locally, e.g., Welcome to
          Full Stack Development! Also confirm you can get the array of
          courses from the remote API at{" "}
          <code>/api/courses</code>. Finally, make sure you can get the
          list of modules for at least one of the courses, e.g.,{" "}
          <code>/api/courses/RS101/modules</code>. The actual URL might
          be different based on the actual name you chose for the
          application.
        </p>
        <p>
          If the name chosen was not unique, Render will modify the
          name of the domain so that it is unique. It might append a
          random string at the end of the name. If this is the case,
          modify the{" "}
          <code>SERVER_URL</code>{" "}environment variable by clicking
          Environment on the left sidebar of the Render dashboard. Make
          sure all environment variables have the correct values and
          edit if necessary. To edit{" "}
          <code>SERVER_URL</code>, click Edit and replace the value
          with the actual domain name. Do not include the protocol{" "}
          <code>https://</code>, or extra slashes. Click Save, rebuild,
          and deploy when done.
        </p>
        <OnYourOwn>
          Open the Render hello and courses URLs in a browser before
          touching Vercel.
        </OnYourOwn>
        <WithAI
          prompt={`Do not invent my Render URL. Checklist: Build npm install, Start npm start, SERVER_ENV production, CLIENT_URL is the Vercel origin, SERVER_URL has no https://.`}
        >
          Ask the assistant for the Render checklist — you still paste
          your own URLs:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-5-3"
        title="5.5.3 Configuring the Remote Environment in Vercel"
      >
        <p>
          Now that the Node.js HTTP server is running remotely on
          Render.com, the React Web application running on Vercel needs
          to be configured to integrate with the server running on
          Render.com. Currently the React Web application is configured
          to connect to the local Node Express server, but when the Web
          application is running on Vercel it needs to connect to the
          remote Node Express server running on Render or Heroku.
          Configure Vercel by defining the environment variable{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>{" "}so that it references
          the remote server running on Render or Heroku.
        </p>
        <p>
          To configure environment variables in Vercel, navigate to
          your project. In the Overview screen, navigate to the
          Deployment. In the Deployment Details screen, under the
          Environment label, navigate to Production. In the Project
          Settings screen, navigate to Environment variables on the
          left sidebar. In the Environment Variables screen, in the
          Create new tab, in the Key input field, enter{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>, and then in the Value
          field, copy and paste the root URL of the application running
          on Render or Heroku, e.g.,{" "}
          <code>https://webdev-server.onrender.com</code>. Make sure
          there is no trailing slash. Click Save and then Redeploy.
          Note that here we{" "}
          <em>do</em>{" "}want the protocol{" "}
          <code>https://</code>, but not in the{" "}
          <code>SERVER_URL</code>{" "}environment variable on
          Render.com. Redeploy the React application and confirm that
          the Dashboard renders the courses from the remote Node server
          and Modules still renders the modules for the selected
          course. Also confirm all the labs still work when running on
          Vercel.
        </p>
        <p>
          Using the Network tab in the Inspector in the Development
          Tools of the browser, make sure that none of the API calls
          still use{" "}
          <code>http://localhost:4000</code>{" "}on the live site. The
          Express companion is 4000, and that is the origin that must
          disappear from production requests. Locally keep{" "}
          <code>.env.development</code>{" "}at{" "}
          <code>http://localhost:4000</code>{" "}so{" "}
          <SectionLink to="5.2" />{" "}LiveDemos stay on the companion
          process. Same <code>httpServer()</code>{" "}helper — only the
          env value changes. Lab 5 LiveDemos do{" "}
          <em>not</em>{" "}need this Vercel step; they already work
          against <code>http://localhost:4000</code>. Route Handler
          demos in{" "}
          <SectionLink to="5.3" />{" "}keep using same-origin{" "}
          <code>/api</code>{" "}even if that env is unset.
        </p>
      </Section>
    </Section>
  );
}
