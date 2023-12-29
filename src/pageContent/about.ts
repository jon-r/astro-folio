import type {PageSection} from "../types/content.ts";
import {toList, toParagraph, toSubtitle} from "./helpers.ts";

export const aboutContent = [
  {
    title: "Skills",
    content: [
      {
        copy: [toParagraph(`
<strong>Full Stack Development -</strong>
JavaScript (TypeScript, ES2022), Frontend (React, Vue, CSS, HTML), Backend (Node, Express, NestJS, Mongo, SQL)`
), toParagraph(`
<strong>DevOps & Infrastructure -</strong>
AWS (Lambdas, Serverless, Containers, CDK), Server-side Rendering (Next, Isomorphic React),
Compilers (Webpack, esbuild, SWC), Micro-services (Module Federation, Event Driven Architecture), REST APIs`
        ),toParagraph(`
<strong>CI/CD -</strong> 
Jenkins, Git (MonoRepos, Pipelines), TDD (Jest, PACT, Testing Library)`),toParagraph(`
<strong>Other -</strong> 
Agile, Jira, Code Reviews, Mentorship, Technical Leadership`)]
      }

    ]
  },
  {
    title: "Employment",
    content: [
      {
        title: "GlobalLogic",
        copy: [
          toParagraph('TODO'),
          toSubtitle(`
<strong>2023-Present -</strong> 
Senior Consultant (Javascript Tech Lead)`),
          toParagraph('TODO'),
          toList(['TODO 1', "todo 2"]),
          ]
      },
      {
        title: "Sharp Gaming (Betfred) – Enterprise Betting & Gaming Platform",
        copy: [
          toParagraph(`I have been at Sharp Gaming for over five years, working on a large-scale project to modernise the Betfred Website. Major 
roles for me have included leading the full stack development of a fully in-house CMS (MERN Stack), lead frontend on the 
games team (3rd party integrations with major providers such as Playtech, NetEnt, IGT), as well as mentoring several junior 
& mid developers across other teams. I was also part of the company’s upcoming Centre of Excellence team, working 
closely with architects on how to make the most of AWS Managed services.`),

          toSubtitle(`<strong>2021-2023 -</strong> 
  Lead Developer (Full Stack TypeScript)`),
          toParagraph(`Leading frontend development across several teams. Defining and implementing best practices for an enterprise level 
codebase (scalability, testing, performance, CI/CD). Research, design, and documentation in use of future technologies 
(AWS services, micro-frontends, progressive enhancement). Mentoring/supporting members across multiple projects.`),
          toList([
            `Setup of NodeJs microservice API within AWS – Lambda, CDK, ApiGateway, S3`,
            `Setup of CI/CD services for microfrontends - Jenkins, Pact testing, Docker, webpack module federation`
          ]),

          toSubtitle(`<strong>2019-2021 -</strong> 
  Senior Developer (Full Stack TypeScript)`),
          toParagraph(`Working as a senior member of a cross-discipline team to produce a service stack suitable for multiple gaming 
requirements (Slots, Live casino, Jackpots, Bingo). Full stack development to support complex gambling integrations with 
bespoke content management, 3rd party APIs, UKGC compliance, Responsible Gambling, KYC.`),
          toList([
            `Custom CMS focused around games content – MongoDb, Express, React, Node (MERN stack).`,
            `React frontend games integrations.`
          ]),

          toSubtitle(`<strong>2017-2019 -</strong> 
  Web Developer (React)`),
          toParagraph(`Part of the greenfield team setting up the foundations for a new cross-product platform (Gaming, Sportsbook, Account 
Management, Payments). Supporting senior team members in implementing future-proof React architecture.`),
          toList([
            `Server-Side React app (custom Express based SSR app).`,
            `WebSocket for real-time event odds, and Node/Sql data driven sportsbook`
          ])
        ],
        }

    ]
  }
] satisfies PageSection[];
