"use strict";

// The CV data module: every fact about the person, stated once.
//
// Read by build/render.js, which owns the shapes. Values are trusted HTML —
// the renderer does not escape them, so entities (&ndash;, &#x1f389;) are
// written here exactly as they should reach the page.
//
// Date ranges are stored as markup strings rather than parsed dates: the
// ordinals are part of the typography, and a stored string keeps the diff
// readable when a date changes. Where the source spelled an ordinal wrong
// ("31th"), the spelling is preserved — step 1 reproduces the document as it
// is, warts included.

// URL per technology, referenced by key from project stacks. Some point at
// mirrors that now redirect (ReactTraining/react-router, reactjs/redux,
// mzabriskie/axios); they still name the right technology, so they stand.
const links = {
  react: { text: "react", url: "https://github.com/facebook/react" },
  reactHooks: {
    text: "react hooks",
    url: "https://reactjs.org/docs/hooks-intro.html",
  },
  reselect: { text: "reselect", url: "https://github.com/reduxjs/reselect" },
  reactRouter: {
    text: "react-router",
    url: "https://github.com/ReactTraining/react-router",
  },
  reactRedux: {
    text: "react-redux",
    url: "https://github.com/reactjs/react-redux",
  },
  reduxPersist: {
    text: "redux-persist",
    url: "https://github.com/rt2zz/redux-persist",
  },
  nextjs: { text: "Next.js", url: "https://nextjs.org/" },
  redux: { text: "redux", url: "https://github.com/reactjs/redux" },
  reduxSaga: { text: "redux-saga", url: "https://redux-saga.js.org/" },
  // Same technology as reduxSaga, different URL. The hand-written markup had
  // both; step 2 collapses them.
  reduxSagaRepo: {
    text: "redux-saga",
    url: "https://github.com/redux-saga/redux-saga",
  },
  styledComponents: {
    text: "styled components",
    url: "https://github.com/styled-components/styled-components",
  },
  typescript: { text: "typescript", url: "https://www.typescriptlang.org/" },
  graphql: { text: "graphql", url: "https://graphql.org/" },
  jest: { text: "jest", url: "https://jestjs.io/" },
  tailwindcss: { text: "tailwindcss", url: "https://tailwindcss.com/" },
  axios: { text: "axios", url: "https://github.com/mzabriskie/axios" },
  angular: { text: "angular", url: "https://github.com/angular/angular" },
  reduxThunk: {
    text: "redux-thunk",
    url: "https://github.com/gaearon/redux-thunk",
  },
  reduxActions: {
    text: "redux-actions",
    url: "https://github.com/redux-utilities/redux-actions",
  },
  reduxDuck: {
    text: "redux-duck",
    url: "https://github.com/PlatziDev/redux-duck",
  },
  socketio: { text: "socket.io", url: "https://github.com/socketio/socket.io" },
};

const phones = {
  ua: { tel: "+380675070150", display: "+38 067 5070150", flag: "🇺🇦" },
  uk: { tel: "+447445569501", display: "+44 7445 569501", flag: "🇬🇧" },
  // The leading space is real: it is inside the <span> and inside the CSS
  // hover reveal, so it renders.
  pl: { tel: "+48786674206", display: " +48 78 66 74206", flag: "🇵🇱" },
};

module.exports = {
  identity: {
    name: "Vitalii Ovcharenko",
    site: "https://vitaminvp.github.io/homepage/",
    siteLabel: "https://vitaminvp.github.io/",
  },

  meta: {
    title: "Vitalii Ovcharenko &mdash; Résumé",
    description: "My very own personal website.",
    subject: "This is just a résumé.",
    ogDescription:
      "&mdash; Hello! I’m a skilled frontend developer with more than 5 years of experience in application development. I strive to craft precise, responsive, fast, easy-to-use environments with both strong purpose and great looks.",
    themeColor: "white",
    tileColor: "#ffffff",
    // The source declared theme-color twice, with different values. Kept for
    // step 1; step 2 drops it.
    duplicateThemeColor: "#ffffff",
    borderColor: "midnightblue",
  },

  // Consumed by runtime JS through data attributes on <body>, not by the
  // renderer: scripts.js counts from these.
  dates: {
    experienceStart: "2018-02-01",
    kyivRelocation: "1998-08-01",
  },

  // One list of icon sizes, feeding <head>, manifest.json and
  // browserconfig.xml. Step 1 keeps the root-relative paths the hand-written
  // manifests used; step 2 points them at assets/icons/ where the files are.
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
      relMe: { type: "text/html" },
    },
    {
      icon: "mail",
      href: "mailto:vitamin@ukr.net",
      className: "mail slide",
      text: "vitamin@ukr.net",
      // The <head> spelled this address with a trailing underscore. Kept for
      // step 1; step 2 makes both come from this one value.
      relMe: { href: "mailto:vitamin_@ukr.net" },
    },
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
      icon: "skype",
      href: "skype:vitaminvp",
      className: "skype slide",
      text: "vitaminvp",
      wrapper: "div",
      relMe: {},
    },
    {
      icon: "phone",
      phone: "ua",
      className: "phone slide",
      wrapper: "div",
      flagWrapper: "div",
      textClass: "slide-text ua",
      exceptPrint: true,
      relMe: {},
    },
    {
      icon: "phone",
      phone: "uk",
      className: "phone slide",
      textClass: "slide-text uk",
      flagExceptPrint: true,
      relMe: {},
    },
    {
      icon: "phone",
      phone: "pl",
      className: "phone slide",
      textClass: "slide-text pl",
      exceptPrint: true,
    },
    { icon: "website", kind: "website", className: "website print-only" },
  ],

  intro: {
    // The visible span is replaced at runtime by the flip clock counting from
    // dates.experienceStart. Its text only shows with JS off.
    fallbackExperience: "more than 3 years ",
    footnote: {
      href: "https://css-tricks.com/the-great-divide/",
      text: "The Great Divide",
    },
  },

  experience: {
    recent: {
      period: "01<sup>st</sup> December 2022 – present",
      role: "Front-End Developer",
      employer: { name: "Euromoney", url: "https://www.euromoneyplc.com/" },
      introLetter: { href: "./", text: "don't have one yet " },
      projects: [
        {
          role: "Front-End Developer",
          product: "Euromoney",
          logo: {
            src: "assets/images/euromoney.png",
            alt: "Euromoney",
            height: 16,
            width: 30,
          },
          summary:
            "React, Next.js, React Hooks, TypeScript, tailwindcss, unit/e2e testing",
          stack: [
            "react",
            "reactHooks",
            "reselect",
            "reactRouter",
            "reactRedux",
            "reduxPersist",
            "nextjs",
            "redux",
            "reduxSaga",
            "styledComponents",
            "typescript",
            "graphql",
            "jest",
            "tailwindcss",
          ],
          bullets: ["AWS, CI/CD, Chromatic, Storybook"],
        },
        {
          role: "Mentor",
          product: "Kottans",
          productUrl: "https://kottans.org",
          productEmoji: "😺",
          summary: "diversity and new frontend trends",
          stack: [
            "axios",
            "react",
            "angular",
            "reactRedux",
            "reactRouter",
            "redux",
            "reduxSagaRepo",
            "reduxThunk",
            "reselect",
            "reduxActions",
            "reduxDuck",
            "socketio",
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
    past: [
      {
        kind: "job",
        period: "November 2021 &ndash; January 2022",
        role: "Front-End Developer",
        employer: {
          name: "Wix",
          // Labelled Wix, pointing at GlobalLogic — and the entry below has
          // the mirror-image mistake. Kept for step 1, swapped back in step 2.
          url: "https://www.globallogic.com/ua/",
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
        bullets: [
          "React, Redux, React Hooks, TypeScript, e2e testing",
          "Wix Editor platform",
        ],
      },
      {
        kind: "job",
        period: "February 2021 &ndash; October 2021",
        role: "Front-End Developer",
        employer: {
          name: "GlobalLogic",
          url: "https://www.wix.com/",
          logo: {
            src: "assets/images/globallogic.png",
            alt: "globallogic",
            height: 20,
            width: 20,
          },
        },
        spaceAfterLogo: true,
        bullets: [
          "React, Redux, React Hooks, Redux Saga, TypeScript",
          "develop video streaming platform",
          "100% unit tests coverage",
        ],
      },
      {
        kind: "job",
        period: "November 2019 &ndash; January 2021",
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
          `React, Redux, React Hooks, REST, Coffee Script\n                        <span class="except-print">☕</span>`,
          "rewriting code from coffee script to React",
        ],
      },
      {
        kind: "job",
        period: "March 2019 &ndash; August 2019",
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
          "React, Redux, Next.JS, TypeScript, CSS(next-css),\n                        server-side rendering, Jest, Enzyme, react testing\n                        library",
          "rewriting code from Python to TS (Next.JS)",
          "writing tests Jest, React-test-library",
        ],
      },
      {
        kind: "job",
        period: "November 2018 &ndash; February 2019",
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
          `built, tested, and deployed to Web applications\n                        <span class="except-print">🌽</span> written with\n                        ASP.Net, SQL, Leaflet and Vanilla JS`,
        ],
      },
      {
        kind: "job",
        period: "February 2018 &ndash; October 2018",
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
          "built simple apps to assist in manufacturing process\n                        using HTML, CSS, JavaScript, PHP, mySQL",
          `CMS Joomla, WordPress, Bitrix\n                        <span class="pig except-print"\n                          >🐷<audio preload="auto">\n                            <source\n                              src="assets/sounds/all-folks.mp3"\n                              type="audio/mpeg"\n                            /></audio\n                        ></span>\n                        and OpenCart`,
        ],
      },
      {
        kind: "sysadmin",
        period: "February 2004 &ndash; December 2017",
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
        bullets: [
          `managed computers network\n                        <span class="except-print">👨‍💻</span> and servers\n                        <span class="except-print">💻</span> (DHCP, DNS, proxy,\n                        ACLs)`,
          `managed peripheral\n                        <span class="except-print">🖨️</span> devices and\n                        equipments <span class="except-print">☎️</span>`,
          `managed video surveillance\n                        <span class="except-print">🎥</span>`,
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
      { kind: "gallery-trigger" },
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

  languages: [
    {
      code: "uk",
      href: "/uk-ua",
      flag: "&#x1f1fa;&#x1f1e6;",
      name: "УКРАЇНСЬКА",
      hidden: true,
    },
    {
      code: "ru",
      href: "/ru-ru",
      flag: "&#x1f1f7;&#x1f1fa;",
      name: "РУССКИЙ",
      hidden: true,
    },
    { code: "en", flag: "&#x1f1fa;&#x1f1f8;", name: "ENGLISH", current: true },
  ],

  // Each section is an ordered list of items. `glued: true` means no
  // whitespace before the item — the source ran some tags together and spaced
  // others, and that spacing renders.
  tagSections: [
    {
      title: "Skills",
      items: [
        { tag: "REACT" },
        { tag: "HOOKS" },
        { tag: "SSR" },
        { tag: "REDUX" },
        { tag: "THUNK" },
        { tag: "GraphQL" },
        { tag: "MobX" },
        { tag: "SAGA" },
        { tag: "TYPESCRIPT" },
        { tag: "UNIT/E2E TESTING" },
        { tag: "Jest/Enzyme/Puppeteer" },
        { tag: "HTML5/CSS3" },
        { tag: "Webpack/Gulp/Grunt" },
        { tag: "Docker" },
        { tag: "NodeJS" },
        { tag: "Git" },
        { tag: "AWS" },
        { tag: "CI/CD" },
        { tag: "🎐 SASS", className: "tag except-print" },
        { color: "deeppink", label: "DEEPPINK", exceptPrint: true },
      ],
    },
    {
      title: "Character",
      exceptPrint: true,
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

  learningPlatforms: [
    { name: "Front-End Front", url: "https://frontendfront.com/" },
    { name: "CodeWars", url: "https://www.codewars.com" },
    { name: "egghead.io", url: "https://egghead.io/" },
    { name: "Udemy", url: "https://www.udemy.com" },
    { name: "SoloLearn", url: "https://www.sololearn.com/" },
    { name: "Enki", url: "https://www.enki.com/" },
    {
      name: "Codecademy",
      url: "https://www.codecademy.com/learn/introduction-to-javascript",
    },
    { name: "Exercism", url: "https://exercism.io/" },
    { name: "Codingame", url: "https://www.codingame.com/" },
    { name: "Codecombat", url: "https://codecombat.com/" },
    { name: "Codechef", url: "https://www.codechef.com/" },
    { name: "Hackerrank", url: "https://www.hackerrank.com/" },
    { name: "Skillotron", url: "https://skillotron.com/" },
    { name: "Leetcode", url: "https://leetcode.com/" },
  ],

  education: [
    {
      kind: "course",
      dates: "1<sup>st</sup> May 2019 &ndash; 31<sup>th</sup> August 2019",
      title: "PDFfiller js, react school",
      school: { name: "PDFfiller", url: "https://pdffiller.com.ua/" },
    },
    {
      kind: "course",
      dates: "1<sup>st</sup> September 2018 &ndash; 31<sup>th</sup> May 2019",
      title: "Kottans front-end",
      titleEmoji: "&#128640;",
      school: {
        name: "Kottans",
        emoji: "😺",
        url: "https://dou.ua/calendar/23973/",
      },
    },
    {
      kind: "course",
      dates: "18<sup>th</sup> December 2018 &ndash; 30<sup>th</sup> February 2019",
      title: "React for front-end Dev.",
      school: {
        name: "webAcademy",
        url: "https://web-academy.com.ua/study/online-live/kurs-react",
      },
    },
    {
      kind: "course",
      dates: "1<sup>st</sup> September 2018 &ndash; 26<sup>th</sup> November 2018",
      title: "Javascript + React Advanced",
      school: {
        name: "EasyCode",
        url: "https://www.easycode.school/courses/course-javascript-react-advanced",
      },
      diploma: {
        id: "diploma-EC",
        dialog: "diploma-EasyCode",
        title: "Show EasyCode diploma",
        spaced: true,
      },
    },
    {
      kind: "course",
      hidden: true,
      dates: "1<sup>st</sup> July 2018 &ndash; 4<sup>th</sup> August 2018",
      title: "Front-end",
      school: {
        name: "webAcademy",
        url: "https://web-academy.com.ua/study/web/html-css-javascript",
      },
      diploma: {
        id: "diploma-WA",
        dialog: "diploma-WebAcademy",
        title: "Show WebAcademy diploma",
      },
    },
    {
      kind: "course",
      hidden: true,
      dates: "1<sup>st</sup> September 2017 &ndash; 31<sup>th</sup> January 2018",
      title: "Front-end",
      school: { name: "GoIt", url: "https://goit.ua" },
    },
    {
      kind: "certificate",
      dates: "25<sup>th</sup> May 2010",
      title: "Cambridge ESOL Level 1 Certificate",
      diploma: {
        id: "diploma-eng",
        dialog: "diploma-english",
        title: "Show english diplomas",
      },
    },
    {
      kind: "degree",
      dates: "1<sup>st</sup> September 1998 &ndash; 1<sup>st</sup> July 2004",
      title: "Master's degree ",
      field: "electronics",
      diploma: {
        id: "diploma-university",
        dialog: "diploma-kpi",
        title: "Show university diplomas",
      },
      school: { name: "kpi", url: "https://kpi.ua/en" },
    },
  ],

  reports: [
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
      close: { href: "#resume", title: "Hide childhood photos" },
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
      close: { href: "#diploma-university", title: "Hide university diplomas" },
      closeWrapped: true,
      photos: [
        {
          src: "./assets/photos/diploma-university.jpg",
          alt: "University diplomas",
          wrapped: true,
        },
      ],
    },
    {
      id: "diploma-english",
      close: { href: "#diploma-eng", title: "Hide english diplomas" },
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
      close: { href: "#diploma-EC", title: "Hide EasyCode diplomas" },
      photos: [
        {
          src: "assets/photos/diploma-EasyCode.jpg",
          alt: "EasyCode diploma",
          wrapped: true,
        },
      ],
    },
    {
      id: "diploma-WebAcademy",
      close: { href: "#diploma-WA", title: "Hide WebAcademy diplomas" },
      photos: [
        {
          src: "assets/photos/diploma-WebAcademy.jpg",
          alt: "WebAcademy diploma",
          wrapped: true,
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
