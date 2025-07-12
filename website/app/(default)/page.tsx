import Badge from "@lib/Badge";
import { CodePager, CodePagerPage } from "@lib/CodePager";
import Link from "@lib/Link";
import ReactLogo from "@lib/ReactLogo";
import Section from "@lib/Section";
import TopDivider from "@lib/TopDivider";

import styles from "./home.module.css";
import { Josefin_Sans } from "next/font/google";

import lisnPkgJson from "lisn.js/package.json";
const lisnVersion = lisnPkgJson.version;

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export default function Page() {
  return (
    <>
      <TopDivider />
      <Section fullWidth={true}>
        <div className={styles.banner}>
          <div className={styles.intro}>
            <p>Lightweight and simple. Powerful and flexible.</p>
            <p>
              LISN handles all complexities so you can simply handle user
              gestures, interactions and layout events.
            </p>
          </div>
          <div className={`${styles.title} ${josefinSans.className}`}>
            <h1>
              LISN<span className={styles.tiny}>.js</span>
            </h1>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-center">Why LISN?</h2>
        <p>
          LISN makes it super simple and easy to implement any kind of scroll,
          view, size, layout or user gesture triggered actions or animations
          with minimal boilerplate, and even if you wish, with zero JavaScript,
          using the HTML-only mode. It also comes with many customizable
          widgets.
        </p>
      </Section>

      <Section opaque={true}>
        <ul className="checked bold center fit">
          <li>100% vanilla TypeScript.</li>
          <li>No layout thrashing.</li>
          <li>Optimal performance.</li>
          <li>Server-side rendering.</li>
          <li>Flexible and customizable.</li>
          <li>Easy and simple to use.</li>
          <li>No dependencies.</li>
          <li>HTML-only mode.</li>
        </ul>

        <div className="bold flex i-center gap-3">
          <ReactLogo />
          <Link
            href="https://www.npmjs.com/package/@lisn.js/react"
            external={true}
          >
            React wrappers
          </Link>{" "}
        </div>
      </Section>

      {/*
      <Section>
        <h2 className="text-center">Take action when...</h2>
        <ul>
          <li>
            The user performs a gesture (scroll, zoom, drag; wheel, key, touch,
            pointer).
          </li>
          <li>The user scrolls.</li>
          <li>
            An element or an offset from top/bottom/left/right comes into/out of
            view.
          </li>
          <li>An element or the window is resized.</li>
          <li>
            An element or the window size or aspect ratio hit one of the
            breakpoints.
          </li>
          <li>An element is added, changed or removed.</li>
          <li>... and lots more.</li>
        </ul>
      </Section>
			*/}

      <Section textCenter={true}>
        <h2>Do anything with the watchers/triggers, actions and widgets:</h2>
        <ul className="plain">
          <li>Scroll watcher</li>
          <li>Gesture watcher</li>
          <li>View watcher</li>
          <li>Size watcher</li>
          <li>Layout watcher</li>
          <li>DOM watcher</li>
          <li>Pointer watcher</li>
          <li className="hrule center"></li>
          <li>Collapsible</li>
          <li>Floating popup/tooltip</li>
          <li>Modal</li>
          <li>Offcanvas menu</li>
          <li>Pager (carousel/slider/tabs)</li>
          <li>Flex same-height</li>
          <li>Scrollbars (native scrolling)</li>
          <li>Sortable</li>
          <li>Auto-hide/remove matching elements</li>
          <li>Scroll-to-top button</li>
          <li>Page loader</li>
          <li>
            <em>Coming soon:</em> <b>Native</b> smooth scrolling and
            scroll-based transforms
          </li>
        </ul>
      </Section>

      <Section opaque={true} textCenter={true}>
        <h2>Powerful and intuitive API.</h2>
        <p>
          The JavaScript API is super easy to use, but you can also use LISN
          without writing a single line of JS using its powerful HTML-only API.
        </p>

        <div className="flex gap-3 j-center">
          <h3>
            <Link href="/demos/">Demos</Link>
          </h3>
          <h3>
            <Link href="/docs/" external={true}>
              Docs
            </Link>
          </h3>
        </div>
      </Section>

      <Section id="quick-start">
        <h2 className="text-center">Getting started.</h2>

        <CodePager
          tabNames={["npm", "React", "Browser bundle"]}
          multiBlocks={true}
        >
          <CodePagerPage>
            <pre>
              <code className="language-bash">{`npm install lisn.js
# OR
yarn add lisn.js`}</code>
            </pre>
            Then import the components and any required CSS in your project:
            <pre>
              <code className="language-javascript">{`// For example, import the pager widget
import { Pager } from "lisn.js";
import "lisn.js/pager.css"`}</code>
            </pre>
          </CodePagerPage>

          <CodePagerPage>
            <pre>
              <code className="language-bash">{`npm install @lisn.js/react
# OR
yarn add @lisn.js/react`}</code>
            </pre>
            Then import the components and any required CSS in your project:
            <pre>
              <code className="language-javascript">{`// For example, import the pager widget
import { PagerComponent, PagerPageComponent } from "@lisn.js/react";
import "lisn.js/pager.css"`}</code>
            </pre>
          </CodePagerPage>

          <CodePagerPage>
            Replace <code>lisn.min.js</code> with your{" "}
            <Link href="#bundles">bundle</Link> of choice.
            <pre>
              <code className="language-html">{`<script
  src="https://cdn.jsdelivr.net/npm/@lisn.js/bundles@${lisnVersion}/lisn.min.js"
  charset="utf-8"
></script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@lisn.js/bundles@${lisnVersion}/styles/lisn.css"
  type="text/css"
  media="screen"
  title="no title"
  charset="utf-8"
/>

<!-- or download and embed it manually -->
`}</code>
            </pre>
            Then use the <code>LISN</code> global variable as your entry point.
            <pre>
              <code className="language-javascript">{`// For example, using the scroll watcher
LISN.watchers.ScrollWatcher.onScroll(
  () => {/* do something cool */},
  {/* config... */}
);`}</code>
            </pre>
            or alternatively, just start using the triggers and widgets in
            HTML-only mode:
            <pre>
              <code className="language-html">{`<div data-lisn-modal
     data-lisn-on-view="@open +target=top: 50% +rootMargin=-48%,0px +once"
>
  <p>
    Here's a modal popping up to tell you you've reached the middle of the page!
  </p>
  <p class="footnote">
    P.S. Don't do that, popups are annoying.
  </p>
</div>`}</code>
            </pre>
          </CodePagerPage>
        </CodePager>

        <h5 className="text-center">
          <Link href="/docs/" external={true}>
            Next steps: basic concepts and the API reference &#x00bb;
          </Link>
        </h5>
      </Section>

      <Section id="bundles">
        <h2 className="text-center">Choose your bundle.</h2>

        <p>
          There are pre-build bundles available as CDN assets. You can download
          them directly from the{" "}
          <Link href="https://github.com/lisnjs/lisn.js/tree/main/packages/lisn.js-bundles">
            repository
          </Link>{" "}
          or install the{" "}
          <Link href="http://npmjs.com/package/@lisn.js/bundles">
            @lisn.js/bundles
          </Link>{" "}
          node package.
        </p>

        <div>
          <h4>
            Default: <code>lisn.min.js</code>
          </h4>
          <div>
            <Badge
              label="File size in bytes"
              path="github/size/lisnjs/lisn.js/packages%2F%40lisn.js%2Fbundles%2Flisn.min.js"
            />
          </div>
          <p className="small">
            Includes everything: watchers, triggers, actions, widgets and their
            CSS (dynamically injected).
          </p>
        </div>

        <div>
          <h4>
            Slim: <code>lisn.slim.min.js</code>
          </h4>
          <div>
            <Badge
              label="File size in bytes"
              path="github/size/lisnjs/lisn.js/packages%2F%40lisn.js%2Fbundles%2Flisn.slim.min.js"
            />
          </div>
          <p className="small">
            Includes watchers, triggers and actions but not widgets or
            widget-specific actions.
          </p>
        </div>

        <div>
          <h4>
            Essentials: <code>lisn.essentials.min.js</code>
          </h4>
          <div>
            <Badge
              label="File size in bytes"
              path="github/size/lisnjs/lisn.js/packages%2F%40lisn.js%2Fbundles%2Flisn.essentials.min.js"
            />
          </div>
          <p className="small">Includes just the watchers.</p>
        </div>

        <div>
          <h4>
            Debug/dev (not minified): <code>lisn.debug.js</code>
          </h4>
          <div>
            <Badge
              label="File size in bytes"
              path="github/size/lisnjs/lisn.js/packages%2F%40lisn.js%2Fbundles%2Flisn.debug.js"
            />
          </div>
          <p className="small">
            You likely won't be using it but it's there. Includes everything the
            default bundle does <em>plus</em> utility functions and logging
            functionality including remote logging via{" "}
            <Link href="https://socket.io/" external={true}>
              socket.io
            </Link>{" "}
            for easier testing on mobile.
          </p>
        </div>
      </Section>

      <Section id="bundles">
        <h2 className="text-center">Browser support.</h2>
        <p>Official support is for:</p>
        <ul>
          <li>Chrome &gt;= 64</li>
          <li>Edge &gt;= 79</li>
          <li>Firefox &gt;= 69</li>
          <li>Safari &gt;= 13.1</li>
          <li>iOS &gt;= 13.4</li>
        </ul>
        <p>
          If you require older browser support (like IE), you'll need to
          transpile from source and include polyfills for{" "}
          <code>ResizeObserver</code>, <code>IntersectionObserver</code> and
          possibly other features.
        </p>
      </Section>

      <Section>
        <h2 className="text-center">Future plans.</h2>
        <ul className="center fit">
          <li>SmoothScroll widget (coming in next version).</li>
          <li>Momentum based Pager transition.</li>
          <li>Realtime drag to reveal for Pager (slider mode).</li>
          <li>
            Sortable to support a child element of each sortable item to
            function as the drag handle.
          </li>
          <li>Wrappers for more frameworks.</li>
          <li>
            <Link href="https://github.com/lisnjs/lisn.js/issues">
              You tell me :)
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
