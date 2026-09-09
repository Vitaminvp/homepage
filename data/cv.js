"use strict";

// The CV data module: every fact about the person, stated once.
//
// Read by build/render.js, which owns the shapes. Values are trusted HTML —
// the renderer does not escape them, so entities (&ndash;, &#x1f389;) are
// written here exactly as they should reach the page.
//
// Date ranges are stored as markup strings rather than parsed dates: the
// ordinals are part of the typography, and a stored string keeps the diff
// readable when a date changes. The source spelled "31th"; that is corrected
// now the document is being read by strangers rather than reproduced.

// URL per technology, referenced by key from project stacks.
const links = {
  react: { text: "react", url: "https://github.com/facebook/react" },
  nextjs: { text: "Next.js", url: "https://nextjs.org/" },
  typescript: { text: "typescript", url: "https://www.typescriptlang.org/" },
  graphql: { text: "graphql", url: "https://graphql.org/" },
  tailwindcss: { text: "tailwindcss", url: "https://tailwindcss.com/" },
  tanstackQuery: {
    text: "TanStack Query",
    url: "https://tanstack.com/query/latest",
  },
  zod: { text: "zod", url: "https://zod.dev/" },
  playwright: { text: "playwright", url: "https://playwright.dev/" },
  vitest: { text: "vitest", url: "https://vitest.dev/" },
  storybook: { text: "storybook", url: "https://storybook.js.org/" },
  turborepo: { text: "turborepo", url: "https://turborepo.com/" },
  aws: { text: "AWS", url: "https://aws.amazon.com/" },
};

// The UK number is the only one shown. The Ukrainian one is kept as a fact but
// carries `hidden` on its contact, so it reaches neither the screen nor print.
const phones = {
  ua: { tel: "+380675070150", display: "+38 067 5070150", flag: "🇺🇦" },
  uk: { tel: "+447445569501", display: "+44 7445 569501", flag: "🇬🇧" },
};

module.exports = {
  identity: {
    name: "Vitalii Ovcharenko",
    title: "Senior Frontend Engineer",
    email: "vitamin@ukr.net",
    site: "https://vitaminvp.github.io/homepage/",
    siteLabel: "https://vitaminvp.github.io/",
    // A UK CV states where the person is and how they will work. The statement
    // says "UK-based" in prose; this is the same fact where a reader scanning
    // the header will find it.
    location: "UK &middot; open to hybrid &amp; remote",
    // UK recruiters filter on this before anything else, and an unstated status
    // is read as the worse answer — so it is stated, and it prints. Worded as
    // availability rather than as a requirement the reader has to satisfy:
    // "Requires UK visa sponsorship" reads like a rejection notice for
    // something that is simply a fact about paperwork.
    rightToWork: "eligible to work in the UK with sponsorship",
  },

  // What the site is called when installed to a home screen.
  manifestName: "Vitalii Ovcharenko — CV",

  meta: {
    // A recruiter searching the name reads this title in the results list and
    // in the browser tab, so it carries the role rather than the word for what
    // kind of document it is. Likewise the description: {{experience}} is
    // filled in by the renderer, so no number here can drift from the intro.
    title: "Vitalii Ovcharenko &mdash; Senior Frontend Engineer",
    description:
      "Senior frontend engineer, UK-based, with {{experience}} in production React &mdash; TypeScript, Next.js App Router, GraphQL, frontend architecture, accessibility and test infrastructure.",
    subject: "Senior Frontend Engineer CV",
    // {{experience}} is filled in by the renderer from dates.experienceStart,
    // so the years are counted in one place and never drift from the intro.
    ogDescription:
      "Senior frontend engineer, UK-based, with {{experience}} in production React &mdash; nearly four of them at Altrata, a B2B data-intelligence business serving 3,300+ enterprise clients. I own front-end architecture and standards on a 25,000-commit Turborepo monorepo of 16 Next.js apps and 57 shared packages.",
    themeColor: "#ffffff",
    tileColor: "#ffffff",
    accent: "midnightblue",
  },

  // Consumed by runtime JS through data attributes on <body>, not by the
  // renderer: scripts.js counts from these.
  dates: {
    experienceStart: "2018-02-01",
    kyivRelocation: "1998-08-01",
  },

  // One list of icon sizes, feeding <head>, manifest.json and
  // browserconfig.xml — which is what keeps their paths from drifting apart.
  icons: {
    apple: [57, 60, 72, 76, 114, 120, 144, 152, 180],
    android: [36, 48, 72, 96, 144, 192],
    ms: [70, 144, 150, 310],
    favicons: [32, 96, 16],
  },

  phones,

  contacts: [
    {
      icon: "facebook",
      href: "https://www.facebook.com/vitaliy.ovcharenko.98",
      className: "facebook slide",
      text: "facebook.com/vitaliy.ovcharenko.98",
      // A personal profile is not something a UK hiring manager should be
      // reading, so it stays off the paper — and off the screen until the
      // personal half of the page is opened.
      exceptPrint: true,
      personal: true,
      relMe: { type: "text/html" },
    },
    // href and link text both come from identity.email.
    { icon: "mail", kind: "email", className: "mail slide", relMe: {} },
    {
      icon: "github",
      href: "https://github.com/Vitaminvp",
      className: "github slide",
      text: "github.com/vitaminvp",
    },
    {
      icon: "linkedin",
      href: "https://www.linkedin.com/in/vitaliiovcharenko/",
      className: "linkedin slide",
      text: "linkedin.com/in/vitaliiovcharenko",
    },
    {
      icon: "phone",
      phone: "ua",
      className: "phone slide",
      wrapper: "div",
      flagWrapper: "div",
      textClass: "slide-text ua",
      hidden: true,
      relMe: {},
    },
    {
      icon: "phone",
      phone: "uk",
      className: "phone slide",
      textClass: "slide-text uk",
      relMe: {},
    },
    { icon: "website", kind: "website", className: "website print-only" },
  ],

  intro: {
    // The personal statement. A UK CV is read top-down in about eight seconds
    // and this is what gets read, so unlike the old intro it prints.
    // {{experience}} is filled in by the renderer from dates.experienceStart,
    // so the years are counted in one place and never drift; the visible span
    // is replaced at runtime by the flip clock, and its text only shows with
    // JS off.
    // Read in about eight seconds, so it states the role, the scale and what
    // is owned — and one number, not six. The client count, the commit share
    // and the app and package counts moved into the engagement below, where
    // they are evidence rather than the first thing a reader has to parse.
    // One fact per sentence, too: the first says who this is, the second where
    // and at what scale, the third what is owned. A single 34-word opener made
    // the reader parse all three at once.
    statement: `Senior frontend engineer, UK-based, with {{experience}} in
                      production React. Nearly four of them at
                      <strong>Altrata</strong>, a B2B data-intelligence
                      business, on a 25,000-commit Turborepo monorepo of Next.js
                      and TypeScript. I own front-end architecture and
                      standards, and take features from technical discovery
                      through implementation, testing and deployment to
                      production support &mdash; including a published
                      graph-visualisation package I own outright.`,
    // Kept behind the personal toggle: it is the character of the site, but on
    // a CV — and on the page a recruiter opens — it blurs the positioning.
    footnote: {
      href: "https://css-tricks.com/the-great-divide/",
      text: "The Great Divide",
    },
  },

  // The personal homepage this document used to be. Nothing was deleted to make
  // the CV read first: it sits behind one CSS-only toggle — the same checkbox
  // the project disclosures use — so it works with JavaScript off.
  personalToggle: {
    show: "Also &mdash; the personal version of this page &rarr;",
    hide: "&larr; Back to the CV",
  },

  experience: {
    recent: {
      period: "2022 &ndash; present",
      role: "Senior Frontend Engineer",
      // Euromoney People Intelligence rebranded as Altrata in 2022, and the
      // parent renamed itself Delinian. Naming both is what lets a recruiter
      // connect this line to the company they have heard of.
      employer: { name: "Altrata", url: "https://altrata.com/" },
      employerNote:
        "formerly Euromoney Institutional Investor",
      introLetter: { href: "./", text: "don't have one yet " },
      projects: [
        {
          // The engagement above already states this role and employer.
          sameAsEngagement: true,
          role: "Senior Frontend Engineer",
          product: "Altrata",
          logo: {
            src: "assets/images/euromoney.png",
            alt: "Altrata",
            height: 16,
            width: 30,
          },
          summary:
            "TypeScript, React, Next.js App Router, GraphQL, Tailwind, Playwright, WCAG 2.1 AA",
          stack: [
            "typescript",
            "react",
            "nextjs",
            "graphql",
            "tanstackQuery",
            "zod",
            "tailwindcss",
            "storybook",
            "vitest",
            "playwright",
            "turborepo",
            "aws",
          ],
          bullets: [
            `Own <strong>pathfinder-charts</strong>, the reusable package
                          that renders people-and-organisation relationship
                          graphs &mdash; up to third-degree paths &mdash; across
                          the web UI and generated reports. ~900 TypeScript
                          files, roughly 70% of its history mine. Also built the
                          product's advanced search.`,
            `Own features end to end &mdash; technical discovery and
                          architecture, implementation, testing, deployment and
                          production support &mdash; working with Product,
                          Design and backend engineers to turn business
                          requirements into scalable front-end solutions.`,
            `Set front-end architecture: authored the repo-wide
                          <strong>fetch-seam</strong> data-layer convention and
                          its documentation, created two shared workspace
                          packages, and am the third-largest contributor to the
                          internal design system.`,
            `Led adoption of Next.js <strong>Cache Components</strong>
                          &mdash; partial prerendering &mdash; across three
                          applications, making client components
                          prerender-safe and caching authentication so the
                          static shell renders without waiting on per-request
                          data.`,
            `Accessibility to <strong>WCAG 2.1 AA</strong> &mdash; keyboard
                          navigation, focus management and focus restoration
                          across search and profile flows, enforced by axe-core
                          in CI.`,
            `Own the test estate and the toolchain: Vitest, Playwright e2e
                          against mocked and real APIs, Chromatic visual
                          baselines; led the Tailwind 4, Vite and Storybook
                          major upgrades and extended CI with path-based test
                          selection.`,
            `Introduced the repository-level <strong>AGENTS.md</strong>
                          instructions the team codes against, and the audit
                          script keeping per-workspace agent docs in sync; ship
                          production pull requests through <strong>Claude
                          Code</strong>, which raised my delivery throughput
                          roughly 2.5&times; in the three months after.`,
            `Prototyped <em>Explain this connection</em> on
                          <strong>Vercel AI SDK v6</strong> &mdash; a streaming
                          route handler with a Zod-typed structured response,
                          feature-flagged and unit-tested, degrading to a
                          canned stream so e2e stays deterministic. Wrote the
                          technical evaluation of three candidate LLM features,
                          including natural
                          language&nbsp;&rarr;&nbsp;search-filter mapping.`,
            `Mentor and code reviewer for up to five engineers at a time,
                          and present front-end topics internally &mdash; Claude
                          Code, React patterns, functional JavaScript &mdash; to
                          groups of up to 15 engineers.`,
            // The scale evidence. Screen only: a commit count is not an
            // achievement, and the printed page is worth more spent on what
            // was owned and delivered. Anyone who wants the measure of
            // relative contribution across forty engineers can find it here.
            {
              exceptPrint: true,
              html: `Contributed across <strong>16 Next.js applications and
                          57 shared packages serving 3,300+ enterprise
                          clients</strong> &mdash; one of the monorepo's most
                          active contributors, with 2,757 of its ~25,000
                          commits, second of ~40 engineers.`,
            },
          ],
        },
        {
          role: "Mentor",
          product: "Kottans",
          productUrl: "https://kottans.org",
          productEmoji: "😺",
          // The stack here was the 2019 curriculum — Redux, Saga, reselect,
          // react-router — which dated the entry rather than the mentoring.
          // Stated now as what is actually taught, and it matches the stack the
          // rest of this CV claims.
          summary: "diversity in tech, and modern React practice",
          stack: [
            "typescript",
            "react",
            "nextjs",
            "tailwindcss",
            "vitest",
            "playwright",
            "storybook",
          ],
          bullets: [],
        },
      ],
      other: {
        summary:
          "I also do some other things 🎊 from time to time &#x1f389;",
        bullets: [
          `As a member of the IT community\n                              <strong\n                                ><a\n                                  href="https://kottans.org/"\n                                  rel="external"\n                                  target="_blank"\n                                  >kottans</a\n                                ></strong\n                              >, attend lectures and seminars`,
          "I'm good at kitchen talks 🎙 about pretty much\n                              anything 🖼",
          "I can play 🏓 ping-pong with you so that we become\n                              a better team",
        ],
      },
    },

    // The "Back then" timeline. `kind` says which shape renders: most are
    // jobs, the tail is a handful of one-off milestones.
    //
    // Job periods carry the year only. The months were what made the ordinary
    // spaces between one job and the next read as gaps needing an explanation;
    // the milestones below keep their full dates, since they are dates rather
    // than spans.
    past: [
      {
        kind: "job",
        period: "2021 &ndash; 2022",
        role: "Front-End Developer",
        employer: {
          name: "Wix",
          url: "https://www.wix.com/",
          logo: {
            src: "assets/images/wix.png",
            alt: "Wix",
            height: 20,
            width: 20,
          },
        },
        // The source put a space between the logo and </a> in some entries
        // and not others. It renders, so step 1 reproduces it.
        spaceAfterLogo: true,
        // The bullets below state what the work was, not only what it was
        // written in. The stack stays named — a reader filtering on keywords
        // needs it — but a list of technologies is not a description of a job.
        bullets: [
          "Built features for the <strong>Wix Editor</strong> platform in React, Redux and TypeScript, covered by end-to-end tests",
        ],
      },
      {
        kind: "job",
        period: "2021",
        role: "Front-End Developer",
        employer: {
          name: "GlobalLogic",
          url: "https://www.globallogic.com/ua/",
          logo: {
            src: "assets/images/globallogic.png",
            alt: "globallogic",
            height: 20,
            width: 20,
          },
        },
        spaceAfterLogo: true,
        bullets: [
          "Built a video-streaming platform front end in React, Redux Saga and TypeScript, held at <strong>100% unit-test coverage</strong>",
        ],
      },
      {
        kind: "job",
        period: "2019 &ndash; 2021",
        role: "Front-End Developer",
        employer: {
          name: "PDFFiller",
          url: "https://pdffiller.com.ua/",
          logo: {
            src: "assets/images/pdffiller.png",
            alt: "pdffiller",
            height: 20,
            width: 28,
          },
        },
        spaceAfterLogo: true,
        bullets: [
          `Migrated a CoffeeScript\n                        <span class="emoji">☕</span> front end to React over two\n                        years, against REST APIs &mdash; the longest engagement\n                        before Altrata`,
          "React, Redux, React Hooks, REST",
        ],
      },
      {
        kind: "job",
        period: "2019",
        role: "Front-End Developer",
        employer: {
          name: "LiveStories",
          url: "https://www.livestories.com/statistics/us-data-reports",
          logo: {
            src: "assets/images/livestories.png",
            alt: "livestories",
            height: 20,
            width: 20,
          },
        },
        bullets: [
          "Replaced a Python-rendered front end with a server-side-rendered\n                        <strong>Next.js</strong> and TypeScript application, tested\n                        with Jest and React Testing Library",
          {
            exceptPrint: true,
            html: "React, Redux, Next.js, TypeScript, server-side rendering",
          },
        ],
      },
      {
        kind: "job",
        period: "2018 &ndash; 2019",
        role: "Front-End Developer",
        employer: {
          name: "AgriChain",
          url: "https://jobs.dou.ua/companies/agri-chain/",
          logo: {
            src: "assets/images/agrichain.png",
            alt: "agrichain",
            height: 20,
            width: 39,
          },
        },
        bullets: [
          `Built, tested and deployed web applications\n                        <span class="emoji">🌽</span> end to end &mdash; ASP.NET,\n                        SQL, Leaflet and vanilla JavaScript`,
        ],
      },
      {
        kind: "job",
        period: "2018",
        role: "Web developer",
        employer: {
          name: "Softcom",
          url: "https://www.softcom.ua/",
          logo: {
            src: "assets/images/softcom.png",
            alt: "softcom",
            height: 20,
            width: 31,
          },
        },
        bullets: [
          "Built internal applications supporting a manufacturing\n                        process in PHP, MySQL, JavaScript, HTML and CSS",
          {
            exceptPrint: true,
            personal: true,
            html: `CMS Joomla, WordPress, Bitrix
                        <span class="pig"
                          >🐷<audio preload="auto">
                            <source
                              src="assets/sounds/all-folks.mp3"
                              type="audio/mpeg"
                            /></audio
                        ></span>
                        and OpenCart`,
          },
        ],
      },
      {
        kind: "sysadmin",
        period: "2004 &ndash; 2017",
        role: "System administrator",
        companies: [
          {
            name: "Smart Solutions",
            url: "https://smart-hr.com.ua/",
            logo: { src: "assets/images/smartsolutions.svg", width: 45 },
          },
          {
            name: "ATB Market",
            url: "https://www.atbmarket.com/",
            logo: { src: "assets/images/atb.svg", width: 45 },
          },
        ],
        // Thirteen years of IT administration should not compete for space
        // with the React work. The site keeps the bullets, one click away;
        // `summary` is the one line the printed CV and the ATS document state.
        summary:
          "Network, server and IT infrastructure administration &mdash; DHCP, DNS, proxying, ACLs, peripherals and video surveillance &mdash; for public-sector and retail organisations.",
        bullets: [
          `managed computers network\n                        <span class="emoji">👨‍💻</span> and servers\n                        <span class="emoji">💻</span> (DHCP, DNS, proxy,\n                        ACLs)`,
          `managed peripheral\n                        <span class="emoji">🖨️</span> devices and\n                        equipments <span class="emoji">☎️</span>`,
          `managed video surveillance\n                        <span class="emoji">🎥</span>`,
        ],
      },
      { kind: "graduation", period: "20<sup>th</sup> June 2004" },
      {
        kind: "school",
        period: "25<sup>th</sup> May 1998",
        city: {
          name: "Kyiv 🌇",
          url: "https://www.google.com/maps/place/%D0%9A%D0%B8%D1%97%D0%B2,+02000/@50.401699,30.2525101,10z/data=!3m1!4b1!4m5!3m4!1s0x40d4cf4ee15a4505:0x764931d2170146fe!8m2!3d50.4501!4d30.5234",
        },
      },
      { kind: "spacer" },
      { kind: "gallery-trigger", lightbox: "childhood" },
      {
        kind: "born",
        period: "27<sup>th</sup> May 1981",
        place: {
          name: "Zavodske 🏰, Ukraine",
          url: "https://www.google.com/maps/place/%D0%97%D0%B0%D0%B2%D0%BE%D0%B4%D1%81%D1%8C%D0%BA%D0%B5,+%D0%9F%D0%BE%D0%BB%D1%82%D0%B0%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C/@50.3990378,33.3858092,13z/data=!4m5!3m4!1s0x40d61906a0fc3c7b:0x6ae54c48cc3d856!8m2!3d50.4024665!4d33.3847498",
        },
      },
    ],
  },

  // The two other entries here were `rel="alternate"` links to /uk-ua and
  // /ru-ru, routes that have never existed in this repository — hidden with
  // inline styles, and absolute, so they also pointed above the site on Pages.
  // What is left is a statement, not a switcher.
  languages: [{ code: "en", flag: "&#x1f1fa;&#x1f1f8;", name: "ENGLISH" }],

  // Each section is an ordered list of items. `glued: true` means no
  // whitespace before the item — the source ran some tags together and spaced
  // others, and that spacing renders.
  tagSections: [
    // Four printed sections rather than one flat run of chips: a UK recruiter
    // scans for the group that matches the role, and "REDUX / THUNK / SAGA"
    // sitting next to "TYPESCRIPT" told them nothing about which is current.
    {
      title: "Core",
      items: [
        { tag: "TYPESCRIPT" },
        { tag: "REACT" },
        { tag: "Next.js (App Router, RSC)", className: "nowrap tag" },
        { tag: "HTML5/CSS3" },
        { tag: "Tailwind CSS", className: "nowrap tag" },
      ],
    },
    // The vocabulary job adverts screen on — "frontend architecture", "design
    // systems", "state management" — existed in this CV only inside the Altrata
    // prose. A reader scanning the skills blocks, and any keyword matcher
    // weighted towards them, missed all of it. Accessibility and performance
    // are not repeated here: Quality already names them specifically, as
    // WCAG 2.1 AA and Core Web Vitals.
    {
      title: "Architecture",
      items: [
        { tag: "Frontend architecture", className: "nowrap tag" },
        { tag: "Design systems", className: "nowrap tag" },
        { tag: "Component libraries", className: "nowrap tag" },
        { tag: "State management", className: "nowrap tag" },
        { tag: "Monorepo" },
        { tag: "Code review", className: "nowrap tag" },
        { tag: "Mentoring" },
      ],
    },
    {
      title: "Data &amp; state",
      items: [
        { tag: "TanStack Query", className: "nowrap tag" },
        { tag: "React Hook Form", className: "nowrap tag" },
        { tag: "Zod" },
        { tag: "nuqs" },
        { tag: "GraphQL" },
        { tag: "REST" },
        { color: "deeppink", label: "DEEPPINK" },
      ],
    },
    {
      title: "Quality",
      items: [
        { tag: "Vitest" },
        { tag: "Playwright" },
        { tag: "Testing Library", className: "nowrap tag" },
        { tag: "MSW" },
        { tag: "Storybook" },
        { tag: "Chromatic" },
        { tag: "WCAG 2.1 AA", className: "nowrap tag" },
        { tag: "Cache Components (PPR)", className: "nowrap tag" },
        { tag: "Core Web Vitals", className: "nowrap tag" },
      ],
    },
    {
      title: "Platform &amp; AI",
      items: [
        { tag: "Turborepo" },
        { tag: "Node.js" },
        { tag: "pnpm" },
        { tag: "AWS (CDK, Cognito)", className: "nowrap tag" },
        { tag: "Vercel" },
        { tag: "CI/CD" },
        { tag: "LaunchDarkly" },
        { tag: "Git" },
        { tag: "Claude Code", className: "nowrap tag" },
        { tag: "GitHub Copilot", className: "nowrap tag" },
        { tag: "Cursor" },
        { tag: "Vercel AI SDK", className: "nowrap tag" },
      ],
    },
    {
      title: "Character",
      exceptPrint: true,
      personal: true,
      items: [
        { tag: "EXPLORER" },
        { tag: "STRAIGHTFORWARD" },
        {
          link: {
            href: "https://www.16personalities.com/entp-personality",
            text: "DEBATER",
          },
        },
        { tag: "⏱ DEVOTED PEDANTIC" },
        { color: "aqua", label: "AQUA" },
        { tag: "AGNOSTIC" },
        { tag: "RELEVANT" },
        { tag: "EMPATHETIC" },
        { tag: "STORYTELLER" },
        { tag: "CONFIDENT" },
        { tag: "CONSISTENT" },
        { tag: "CHALLENGING" },
        { color: "tomato", label: "TOMATO" },
      ],
    },
    {
      title: "Likes&#x1f603;",
      exceptPrint: true,
      personal: true,
      items: [
        { tag: "HUMOUR 🤗" },
        { tag: "DOGS 🐕" },
        { tag: "MOVIES 🎞️" },
        { tag: "DYNAMO KIEV ⚽", className: "nowrap tag" },
        { tag: "MUSIC 🎼", className: "tag nowrap" },
        { tag: "SELF-EDUCATION 🔬" },
        { tag: "SPORT ⛷ 🤼 🏋 🚴 🏹" },
        { color: "midnightblue", label: "MIDNIGHT BLUE" },
      ],
    },
    {
      title: "Dislikes&#x1f61e;",
      exceptPrint: true,
      personal: true,
      items: [
        { badHabits: true },
        { tag: "ASS-KISSERS 💩" },
        { tag: "INCOMPETENCE", glued: true },
        { tag: "ARROGANCE 🤬", glued: true },
        { color: "chartreuse", label: "CHARTREUSE" },
      ],
    },
    {
      title: "Wants🙏",
      exceptPrint: true,
      personal: true,
      items: [
        { tag: "TO BE FIT AND HEALTHY" },
        { tag: "TO FIND PERFECT JOB", glued: true },
        { tag: "TO BECOME A SUPER PROFESSIONAL", glued: true },
        { tag: "TO READ MORE", glued: true },
        { tag: "TO LISTEN AND LEARN", glued: true },
        { color: "royalblue", label: "ROYALBLUE", glued: true },
      ],
    },
  ],

  // The seven colour buttons live inside tagSections and the graduation
  // milestone; scripts.js wires one listener per id. Listed here so the
  // renderer and the runtime agree on the set.
  colors: [
    "red",
    "deeppink",
    "aqua",
    "tomato",
    "midnightblue",
    "chartreuse",
    "royalblue",
  ],

  // The gamified beginner sites (SoloLearn, Enki, Codecombat, Codechef,
  // Skillotron) were dropped: at this level they read as a junior profile.
  learningPlatforms: [
    { name: "Front-End Front", url: "https://frontendfront.com/" },
    { name: "CodeWars", url: "https://www.codewars.com" },
    { name: "egghead.io", url: "https://egghead.io/" },
    { name: "Udemy", url: "https://www.udemy.com" },
    {
      name: "Codecademy",
      url: "https://www.codecademy.com/learn/introduction-to-javascript",
    },
    { name: "Exercism", url: "https://exercism.io/" },
    { name: "Codingame", url: "https://www.codingame.com/" },
    { name: "Hackerrank", url: "https://www.hackerrank.com/" },
    { name: "Leetcode", url: "https://leetcode.com/" },
  ],

  // Newest first. The six workshops taken during the Altrata years carry the
  // year only: the Total TypeScript date is the invoice, the AI Coding one is
  // when the material was worked through, the rest are approximate.
  education: [
    {
      kind: "course",
      dates: "2026",
      title: "AI Coding Crash Course",
      school: {
        name: "AI Hero",
        url: "https://www.aihero.dev/workshops/ai-coding-crash-course",
      },
    },
    {
      kind: "course",
      dates: "2026",
      title: "AI SDK v6 Crash Course",
      school: {
        name: "AI Hero",
        url: "https://www.aihero.dev/workshops/ai-sdk-v6-crash-course",
      },
    },
    {
      kind: "course",
      dates: "2025",
      title: "Epic React",
      school: { name: "Kent C. Dodds", url: "https://www.epicreact.dev/" },
    },
    {
      kind: "course",
      dates: "2024",
      title: "Epic Web Dev",
      school: { name: "Kent C. Dodds", url: "https://www.epicweb.dev/" },
    },
    {
      kind: "course",
      dates: "2023",
      title: "CSS for JavaScript Developers",
      school: { name: "Josh W. Comeau", url: "https://css-for-js.dev/" },
    },
    {
      kind: "course",
      dates: "2023",
      title: "Total TypeScript",
      school: { name: "Matt Pocock", url: "https://www.totaltypescript.com/" },
    },
    {
      exceptPrint: true,
      kind: "course",
      dates: "1<sup>st</sup> May 2019 &ndash; 31<sup>st</sup> August 2019",
      title: "PDFfiller js, react school",
      school: { name: "PDFfiller", url: "https://pdffiller.com.ua/" },
    },
    {
      exceptPrint: true,
      kind: "course",
      dates: "1<sup>st</sup> September 2018 &ndash; 31<sup>st</sup> May 2019",
      title: "Kottans front-end",
      titleEmoji: "&#128640;",
      school: {
        name: "Kottans",
        emoji: "😺",
        url: "https://dou.ua/calendar/23973/",
      },
    },
    {
      exceptPrint: true,
      kind: "course",
      dates: "18<sup>th</sup> December 2018 &ndash; 28<sup>th</sup> February 2019",
      title: "React for front-end Dev.",
      school: {
        key: "webAcademy",
        name: "Web Academy",
        url: "https://web-academy.com.ua/study/online-live/kurs-react",
      },
    },
    {
      exceptPrint: true,
      kind: "course",
      dates: "1<sup>st</sup> September 2018 &ndash; 26<sup>th</sup> November 2018",
      title: "Javascript + React Advanced",
      school: {
        name: "EasyCode",
        url: "https://www.easycode.school/courses/course-javascript-react-advanced",
      },
      diploma: { ref: "diploma-EasyCode", spaced: true },
    },
    {
      kind: "course",
      hidden: true,
      dates: "1<sup>st</sup> July 2018 &ndash; 4<sup>th</sup> August 2018",
      title: "Front-end",
      school: {
        key: "webAcademy",
        name: "Web Academy",
        url: "https://web-academy.com.ua/study/web/html-css-javascript",
      },
      diploma: { ref: "diploma-WebAcademy" },
    },
    {
      kind: "course",
      hidden: true,
      dates: "1<sup>st</sup> September 2017 &ndash; 31<sup>st</sup> January 2018",
      title: "Front-end",
      school: { name: "GoIt", url: "https://goit.ua" },
    },
    {
      kind: "certificate",
      dates: "25<sup>th</sup> May 2010",
      title: "Cambridge ESOL Level 1 Certificate",
      diploma: { ref: "diploma-english" },
    },
    {
      kind: "degree",
      dates: "1<sup>st</sup> September 1998 &ndash; 1<sup>st</sup> July 2004",
      title: "Master's degree ",
      field: "electronics",
      diploma: { ref: "diploma-kpi" },
      school: {
        key: "kpi",
        name: "Igor Sikorsky Kyiv Polytechnic Institute",
        url: "https://kpi.ua/en",
      },
    },
  ],

  reports: [
    // No href and no logo: an internal talk has neither a public recording
    // nor a logo to hang on it, so the renderer treats both as optional.
    {
      title: "Working with Claude Code",
      note: "internal, ~15 engineers, Altrata, July 2026",
    },
    {
      title: "Epic React",
      note: "internal, Altrata, 2025",
    },
    {
      title: "Functional-Light JavaScript",
      note: "internal, Altrata, 2024",
    },
    {
      href: "https://youtu.be/Ja13H4j5iuY",
      title: "React Patterns",
      logo: { src: "assets/images/react.png", height: 17, width: 20 },
    },
    {
      href: "https://youtu.be/pw-I9SNLhcA",
      title: "Events, state, hooks implementation",
      logo: { src: "assets/images/hooks.png", height: 18, width: 20 },
    },
  ],

  // Photo galleries. Each one is a <dialog> with a trigger elsewhere on the
  // page; the images sit in <noscript> and are spliced in by scripts.js.
  lightboxes: [
    {
      id: "childhood",
      trigger: "resume",
      openTitle: "Show childhood photos",
      closeTitle: "Hide childhood photos",
      photos: [
        { src: "./assets/photos/1.jpg", alt: "Me as a baby" },
        { src: "./assets/photos/2.jpg", alt: "Me like girl" },
        { src: "./assets/photos/3.jpg", alt: "Me having bath" },
        { src: "./assets/photos/4.jpg", alt: "Me watching on milk" },
        { src: "./assets/photos/5.jpg", alt: "Me pilot" },
        { src: "./assets/photos/6.jpg", alt: "Me with a dove" },
        { src: "./assets/photos/7.jpg", alt: "Me oversee micro-world" },
        { src: "./assets/photos/8.jpg", alt: "Me in underwear" },
        { src: "./assets/photos/9.jpg", alt: "Me biting my nails" },
        { src: "./assets/photos/10.jpg", alt: "Me a sailor" },
        { src: "./assets/photos/11.jpg", alt: "Me in a shirt" },
        { src: "./assets/photos/12.jpg", alt: "Me with a dog" },
        { src: "./assets/photos/13.jpg", alt: "Me in a party" },
        { src: "./assets/photos/14.jpg", alt: "Me in color" },
      ],
    },
    {
      id: "diploma-kpi",
      trigger: "diploma-university",
      openTitle: "Show university diplomas",
      closeTitle: "Hide university diplomas",
      photos: [
        {
          src: "./assets/photos/diploma-university.jpg",
          alt: "University diplomas",
        },
      ],
    },
    {
      id: "diploma-english",
      trigger: "diploma-eng",
      openTitle: "Show english diplomas",
      closeTitle: "Hide english diplomas",
      photos: [
        { src: "./assets/photos/en.jpg", alt: "English diploma" },
        { src: "./assets/photos/en2.jpg", alt: "English diploma" },
        { src: "./assets/photos/en3.jpg", alt: "English diploma" },
        { src: "./assets/photos/en4.jpg", alt: "English diploma" },
        { src: "./assets/photos/en5.jpg", alt: "English diploma" },
      ],
    },
    {
      id: "diploma-EasyCode",
      trigger: "diploma-EC",
      openTitle: "Show EasyCode diploma",
      closeTitle: "Hide EasyCode diplomas",
      photos: [
        {
          src: "assets/photos/diploma-EasyCode.jpg",
          alt: "EasyCode diploma",
        },
      ],
    },
    {
      id: "diploma-WebAcademy",
      trigger: "diploma-WA",
      openTitle: "Show WebAcademy diploma",
      closeTitle: "Hide WebAcademy diplomas",
      photos: [
        {
          src: "assets/photos/diploma-WebAcademy.jpg",
          alt: "WebAcademy diploma",
        },
      ],
    },
  ],

  sounds: {
    logo: "assets/sounds/likeabos.mp3",
    pig: "assets/sounds/all-folks.mp3",
    meh: "assets/sounds/meh.mp3",
  },

  avatar: "./assets/photos/avatar.svg",

  links,
};
