import {
  User,
  Course,
  SubjectPerformance,
  AdaptiveRecommendation,
  RoadmapStep,
  ImprovementMetric,
  Quiz,
  QuizAttempt,
  AppNotification,
  ActivityLog,
  TeamMember
} from '../models/lms.models';

export const INITIAL_USER: User = {
  id: 'usr_demo_101',
  name: 'Demo Student',
  email: 'student@lms.com',
  role: 'student',
  department: 'Computer Science & Engineering',
  studentId: '2022-CSE-042',
  joinedDate: '2025-08-15',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Final year B.Tech Computer Science student specializing in Web Architectures and Intelligent Systems.'
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_ang_201',
    title: 'Modern Angular & Enterprise Architecture',
    shortDescription: 'Master standalone components, reactive signals, routing, and clean design patterns in modern Angular.',
    fullDescription: 'Comprehensive guide to modern Angular development. From state management with RxJS and signals to reactive forms, route guards, and component lifecycle best practices.',
    instructor: {
      name: 'Dr. Sarah Mitchell',
      title: 'Principal Frontend Architect & Google Developer Expert',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    category: 'Web Development',
    difficulty: 'Intermediate',
    durationHours: 14,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    enrolled: true,
    enrolledDate: '2026-01-10',
    progressPercentage: 40,
    subjectTag: 'Angular',
    objectives: [
      'Understand Angular Standalone Components and bootstrap pipelines',
      'Leverage Angular Signals and RxJS interoperability',
      'Build secure route guards and scalable routing hierarchies',
      'Implement reactive forms with custom validation'
    ],
    learningOutcomes: [
      'Architect modular enterprise-grade single-page applications',
      'Design clean separation between business logic and UI components',
      'Debug and optimize change detection cycles'
    ],
    chapters: [
      {
        id: 'ch_ang_1',
        title: 'Core Fundamentals & Architecture',
        lessons: [
          {
            id: 'les_ang_101',
            title: 'Angular Project Setup & Standalone Structure',
            durationMinutes: 20,
            completed: true,
            type: 'reading',
            summary: 'Examines the modern Angular directory structure without NgModules, explaining main.ts and app.config.ts.',
            content: `### Modern Angular Standalone Architecture

In modern Angular versions, standalone components are the first-class architectural primitive. 

#### Key Principles:
1. **Simplified Dependency Tree**: By removing boilerplate \`NgModule\` declarations, components, directives, and pipes declare their dependencies explicitly via the \`imports\` array.
2. **Lean App Configuration**: The traditional \`AppModule\` is replaced by \`ApplicationConfig\` passed into \`bootstrapApplication(AppComponent, appConfig)\`.
3. **Tree-Shakable Providers**: Services can be injected using \`providedIn: 'root'\` or configured inside specific route providers for localized dependency scoping.

\`\`\`typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <button (click)="increment()">Count: {{ count() }}</button>
  \`
})
export class CounterComponent {
  count = signal(0);
  increment() { this.count.update(n => n + 1); }
}
\`\`\``,
            keyTakeaways: [
              'Standalone components declare dependencies directly in @Component decorator',
              'bootstrapApplication streamlines app startup',
              'Signals provide fine-grained reactivity'
            ]
          },
          {
            id: 'les_ang_102',
            title: 'Component Lifecycle and Data Binding',
            durationMinutes: 25,
            completed: true,
            type: 'reading',
            summary: 'Deep dive into ngOnInit, ngOnChanges, and modern signal-based inputs/outputs.',
            content: `### Component Lifecycle & Reactive State

Understanding the lifecycle of an Angular component is vital for building bug-free interactive UIs.

#### Lifecycle Hooks:
- **ngOnInit**: Called once after inputs are bound. Ideal for initial data fetching and RxJS subscription setup.
- **ngOnChanges**: Triggered when \`@Input()\` properties change.
- **ngOnDestroy**: Cleanup hook to prevent memory leaks by unsubscribing from long-lived Observables and clearing timers.

\`\`\`typescript
@Component({ ... })
export class ProfileCard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.userService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.renderUser(user));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
\`\`\``,
            keyTakeaways: [
              'Always unsubscribe from RxJS observables in ngOnDestroy',
              'Use async pipe in templates where possible to automate cleanup',
              'Use signals for synchronous local UI state'
            ]
          }
        ]
      },
      {
        id: 'ch_ang_2',
        title: 'State Management & Services',
        lessons: [
          {
            id: 'les_ang_201',
            title: 'Dependency Injection & Centralized State Services',
            durationMinutes: 30,
            completed: false,
            type: 'reading',
            summary: 'Learn how to manage state across components using BehaviorSubjects and signals inside injectable services.',
            content: `### Centralized Angular Services

Services in Angular are singleton objects that decouple business state from visual presentation components.

#### Why Centralized Services?
- **Single Source of Truth**: State lives in one predictable location.
- **Testability**: Services can be easily mocked in unit tests.
- **Cross-Component Synchronization**: When one component triggers an action (e.g. marking a lesson complete), all listening components react automatically.`,
            keyTakeaways: [
              'Provide services at root for global singletons',
              'Expose state as Readonly Observables or Signals to prevent external mutation',
              'Keep components thin and dumb; keep services smart'
            ]
          },
          {
            id: 'les_ang_202',
            title: 'Angular Routing & Route Protection Guards',
            durationMinutes: 35,
            completed: false,
            type: 'reading',
            summary: 'Building multi-tier routes, lazy loading, and functional CanActivate guards.',
            content: `### Functional Route Guards in Angular

Modern Angular uses functional guards (\`CanActivateFn\`) instead of class-based guards for streamlined route evaluation.

\`\`\`typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/login');
};
\`\`\``,
            keyTakeaways: [
              'Functional guards use inject() to access services',
              'Return UrlTree to cleanly redirect unauthenticated users',
              'Guards can resolve async observables or promises'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs_js_202',
    title: 'Advanced JavaScript & Asynchronous Programming',
    shortDescription: 'Deep dive into closures, prototypal inheritance, Event Loop, Promises, and ESNext standards.',
    fullDescription: 'Gain a rigorous understanding of the V8 JavaScript engine, event loop phases, microtasks vs macrotasks, memory management, and modern functional programming paradigms.',
    instructor: {
      name: 'Alex Rivera',
      title: 'Senior Software Engineer & Tech Author',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    category: 'Programming',
    difficulty: 'Advanced',
    durationHours: 12,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
    enrolled: true,
    enrolledDate: '2026-01-05',
    progressPercentage: 85,
    subjectTag: 'JavaScript',
    objectives: [
      'Master the JavaScript Event Loop and concurrency model',
      'Implement custom Promises and async iterators',
      'Understand lexical scope, closures, and garbage collection',
      'Optimize browser DOM rendering performance'
    ],
    learningOutcomes: [
      'Write highly optimized, non-blocking asynchronous JavaScript code',
      'Avoid memory leaks and diagnose memory profiles',
      'Leverage advanced ES6+ features with confidence'
    ],
    chapters: [
      {
        id: 'ch_js_1',
        title: 'Asynchronous Fundamentals',
        lessons: [
          {
            id: 'les_js_101',
            title: 'The Event Loop & Task Queues',
            durationMinutes: 30,
            completed: true,
            type: 'reading',
            summary: 'How call stacks, microtasks, and macrotasks operate in JavaScript runtimes.',
            content: `### JavaScript Concurrency & The Event Loop

JavaScript is single-threaded, yet handles asynchronous operations gracefully via its runtime event loop.

#### Microtasks vs Macrotasks:
- **Microtasks**: \`Promise.then\`, \`queueMicrotask\`, \`MutationObserver\`. Executed immediately after the current call stack clears before rendering.
- **Macrotasks**: \`setTimeout\`, \`setInterval\`, UI events. Dispatched in subsequent loop iterations.`,
            keyTakeaways: [
              'Microtasks always drain completely before the next macrotask runs',
              'Heavy synchronous loops starve the UI thread',
              'Web Workers allow true background CPU parallelization'
            ]
          },
          {
            id: 'les_js_102',
            title: 'Promises, Async/Await & Error Pipelines',
            durationMinutes: 25,
            completed: true,
            type: 'reading',
            summary: 'Handling complex asynchronous chains with try/catch and Promise combinators.',
            content: `### Modern Promise Combinators

ES2020+ introduced powerful combinators:
- \`Promise.all()\`: Fails fast if any promise rejects.
- \`Promise.allSettled()\`: Waits for all promises regardless of outcome.
- \`Promise.race()\`: Returns the first settled promise.
- \`Promise.any()\`: Returns the first fulfilled promise.`,
            keyTakeaways: [
              'Use Promise.allSettled for independent batch tasks',
              'Always handle rejection to avoid unhandledRejection events',
              'async/await is syntactic sugar over Promises'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs_db_203',
    title: 'Relational Databases & SQL Query Optimization',
    shortDescription: 'Master relational schema design, normalization, complex joins, indexing strategies, and ACID transactions.',
    fullDescription: 'Everything required for scalable database architectures: from third normal form (3NF) to B-tree indexes, execution plan analysis, and distributed transaction semantics.',
    instructor: {
      name: 'Prof. David Chen',
      title: 'Database Systems Researcher & Consultant',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    category: 'Database Management',
    difficulty: 'Intermediate',
    durationHours: 16,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    enrolled: true,
    enrolledDate: '2026-01-20',
    progressPercentage: 65,
    subjectTag: 'Database Management',
    objectives: [
      'Design normalized database schemas up to BCNF',
      'Optimize slow SQL queries using EXPLAIN execution plans',
      'Implement transactions adhering to strict ACID guarantees',
      'Configure B-Tree and Hash indexes for high-throughput reads'
    ],
    learningOutcomes: [
      'Eliminate database deadlocks and concurrency anomalies',
      'Write multi-table aggregate queries with window functions',
      'Tune enterprise database workloads for maximum IOPS efficiency'
    ],
    chapters: [
      {
        id: 'ch_db_1',
        title: 'Schema Normalization & Integrity',
        lessons: [
          {
            id: 'les_db_101',
            title: 'Database Normalization: 1NF to BCNF',
            durationMinutes: 35,
            completed: true,
            type: 'reading',
            summary: 'Step-by-step techniques for eliminating redundancy and update anomalies.',
            content: `### Normalization Principles

Normalization organizes database attributes to minimize redundancy and eliminate insertion, update, and deletion anomalies.

- **1NF**: Atomic values; no repeating groups.
- **2NF**: In 1NF and all non-key attributes are fully functionally dependent on the primary key.
- **3NF**: In 2NF and no transitive functional dependencies exist.`,
            keyTakeaways: [
              '3NF eliminates transitive dependencies',
              'Denormalization should only be applied after measuring read performance bottlenecks',
              'Foreign keys guarantee referential integrity at the engine level'
            ]
          },
          {
            id: 'les_db_102',
            title: 'Indexes and Query Execution Plans',
            durationMinutes: 40,
            completed: false,
            type: 'reading',
            summary: 'Understanding B-Tree structures, index scans vs table scans, and composite keys.',
            content: `### Understanding Database Indexes

Indexes are auxiliary data structures (typically B+ Trees) that allow the engine to locate records without scanning the entire table.

#### Best Practices:
- Index columns used frequently in WHERE clauses and JOIN conditions.
- Beware of over-indexing: each write (INSERT/UPDATE/DELETE) incurs index maintenance overhead.`,
            keyTakeaways: [
              'Use EXPLAIN to inspect whether queries use index seeks or sequential scans',
              'Order matters in composite indexes (Leftmost prefix rule)',
              'Regularly vacuum and analyze tables to keep statistics accurate'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs_py_204',
    title: 'Python for Data Engineering & Scientific Computing',
    shortDescription: 'Hands-on Python: object-oriented patterns, generators, NumPy arrays, Pandas dataframes, and clean code.',
    fullDescription: 'Comprehensive Python program designed for engineering students. Learn memory models, decorators, list comprehensions, data processing pipelines, and REST API integration.',
    instructor: {
      name: 'Dr. Priya Sharma',
      title: 'Data Science Lead & AI Researcher',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    category: 'Data Science',
    difficulty: 'Beginner',
    durationHours: 18,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    enrolled: false,
    progressPercentage: 0,
    subjectTag: 'Python',
    objectives: [
      'Write clean, idiomatic Python using PEP8 guidelines',
      'Create custom decorators, context managers, and generators',
      'Manipulate tabular datasets using Pandas',
      'Perform matrix computations with NumPy'
    ],
    learningOutcomes: [
      'Develop robust automation scripts and data wrangling workflows',
      'Deploy Python microservices and understand Python memory management'
    ],
    chapters: [
      {
        id: 'ch_py_1',
        title: 'Python Idioms and Metaprogramming',
        lessons: [
          {
            id: 'les_py_101',
            title: 'Iterators, Generators, and Memory Optimization',
            durationMinutes: 30,
            completed: false,
            type: 'reading',
            summary: 'Stream massive datasets lazily using Python generators and yield statements.',
            content: `### Python Generators and Lazy Evaluation

Generators provide a convenient way to implement iterators. Instead of computing an entire collection in memory, values are yielded lazily on demand.

\`\`\`python
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b
\`\`\``,
            keyTakeaways: [
              'Generators save substantial RAM when processing massive streams',
              'Generator expressions use parentheses: (x for x in data)',
              'Use itertools for high-performance combinatorial iteration'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs_dsa_205',
    title: 'Data Structures & Algorithmic Problem Solving',
    shortDescription: 'Conquer trees, graphs, dynamic programming, and complexity analysis for competitive coding and technical interviews.',
    fullDescription: 'Master foundational computer science algorithms. Covers asymptotic analysis (Big-O), balanced binary trees, Dijkstra/BFS/DFS graph algorithms, and DP memoization patterns.',
    instructor: {
      name: 'Prof. Marcus Vance',
      title: 'ACM ICPC Coach & Systems Professor',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
    },
    category: 'Computer Science Fundamentals',
    difficulty: 'Advanced',
    durationHours: 22,
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc141e6c3be?w=600&auto=format&fit=crop&q=80',
    enrolled: true,
    enrolledDate: '2026-01-18',
    progressPercentage: 50,
    subjectTag: 'Data Structures',
    objectives: [
      'Calculate time and space complexity with Big-O notation',
      'Implement self-balancing trees (AVL & Red-Black)',
      'Solve graph traversal and shortest path problems',
      'Master dynamic programming top-down and bottom-up approaches'
    ],
    learningOutcomes: [
      'Confidently pass top-tier technical coding interviews',
      'Design time-optimal algorithms for real-world software bottlenecks'
    ],
    chapters: [
      {
        id: 'ch_dsa_1',
        title: 'Trees & Graph Traversal',
        lessons: [
          {
            id: 'les_dsa_101',
            title: 'Graph Representation: Adjacency List & BFS/DFS',
            durationMinutes: 45,
            completed: true,
            type: 'reading',
            summary: 'Implementing Breadth-First and Depth-First searches with topological sorting.',
            content: `### Graph Search Algorithms

Graphs model networks, dependencies, and connections. 

- **BFS (Queue-based)**: Guarantees shortest path in unweighted graphs.
- **DFS (Stack/Recursion)**: Ideal for cycle detection, topological sorting, and connected components.`,
            keyTakeaways: [
              'BFS uses FIFO queue; DFS uses LIFO stack or recursive call stack',
              'Time complexity: O(V + E) with adjacency lists',
              'Maintain a visited set to avoid infinite cycles'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs_web_206',
    title: 'Responsive Web Design: Modern HTML5 & CSS3',
    shortDescription: 'Build pixel-perfect, accessible, and responsive layouts using Flexbox, CSS Grid, and custom properties.',
    fullDescription: 'Complete guide to the presentation tier of the web. Semantic HTML5 tags, CSS Grid architectures, responsive typography, WCAG accessibility, and fluid fluid layouts.',
    instructor: {
      name: 'Elena Rostova',
      title: 'UX/UI Lead & Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    category: 'Web Development',
    difficulty: 'Beginner',
    durationHours: 10,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    enrolled: false,
    progressPercentage: 0,
    subjectTag: 'HTML and CSS',
    objectives: [
      'Write semantic HTML5 documents conforming to WCAG 2.1 standards',
      'Master two-dimensional layouts with CSS Grid',
      'Utilize CSS Flexbox for alignment and dynamic distribution',
      'Implement fluid typography using clamp() and CSS Custom Properties'
    ],
    learningOutcomes: [
      'Create responsive web experiences that adapt seamlessly across devices',
      'Design accessible interactive web components'
    ],
    chapters: [
      {
        id: 'ch_web_1',
        title: 'Modern Layout Engines',
        lessons: [
          {
            id: 'les_web_101',
            title: 'CSS Grid vs Flexbox: When and How to Combine',
            durationMinutes: 25,
            completed: false,
            type: 'reading',
            summary: 'Architecting high-level page layouts with Grid while organizing inner components with Flexbox.',
            content: `### Grid vs Flexbox

- **CSS Grid** is two-dimensional (rows and columns simultaneously). Perfect for major page shells.
- **Flexbox** is one-dimensional (row OR column). Ideal for navigation bars, card rows, and button groups.`,
            keyTakeaways: [
              'Use grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) for responsive cards',
              'Flexbox handles linear content flow and vertical centering with ease',
              'Combine both for resilient responsive UI architectures'
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_SUBJECT_PERFORMANCES: SubjectPerformance[] = [
  {
    subject: 'JavaScript',
    score: 88,
    attemptsCount: 4,
    lastAttemptDate: '2026-02-14',
    strengthCategory: 'Strong',
    topicsToReview: ['Event Loop Microtasks', 'Async Generators']
  },
  {
    subject: 'HTML and CSS',
    score: 78,
    attemptsCount: 3,
    lastAttemptDate: '2026-02-10',
    strengthCategory: 'Average',
    topicsToReview: ['CSS Grid Subgrid', 'Accessibility ARIA Roles']
  },
  {
    subject: 'Database Management',
    score: 68,
    attemptsCount: 3,
    lastAttemptDate: '2026-02-12',
    strengthCategory: 'Average',
    topicsToReview: ['B-Tree Index Scans', 'ACID Isolation Levels']
  },
  {
    subject: 'Data Structures',
    score: 72,
    attemptsCount: 2,
    lastAttemptDate: '2026-02-08',
    strengthCategory: 'Average',
    topicsToReview: ['AVL Rotations', 'Topological Sorting']
  },
  {
    subject: 'Python',
    score: 45,
    attemptsCount: 2,
    lastAttemptDate: '2026-02-01',
    strengthCategory: 'Average',
    topicsToReview: ['List Comprehensions', 'Generators & Yield']
  },
  {
    subject: 'Angular',
    score: 35,
    attemptsCount: 4,
    lastAttemptDate: '2026-02-15',
    strengthCategory: 'Weak',
    topicsToReview: ['Standalone Components', 'Signals vs RxJS', 'Route Guards']
  }
];

export const INITIAL_ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 'rdm_1',
    level: 'Beginner',
    title: 'Modern JavaScript & DOM Fundamentals',
    subject: 'JavaScript',
    description: 'Lexical scope, higher-order functions, event handlers, and ES6 essentials.',
    status: 'completed',
    estimatedHours: 12,
    order: 1
  },
  {
    id: 'rdm_2',
    level: 'Beginner',
    title: 'Relational Database Schema Design & SQL Basics',
    subject: 'Database Management',
    description: 'Entity relationship diagrams, primary/foreign keys, and 1NF to 3NF normalization.',
    status: 'completed',
    estimatedHours: 10,
    order: 2
  },
  {
    id: 'rdm_3',
    level: 'Intermediate',
    title: 'Angular Components, Signals & Route Guards',
    subject: 'Angular',
    description: 'Component lifecycle, two-way signals, service injection, and CanActivate security.',
    status: 'current',
    estimatedHours: 16,
    order: 3
  },
  {
    id: 'rdm_4',
    level: 'Intermediate',
    title: 'Python Scripting & Data Wrangling with Pandas',
    subject: 'Python',
    description: 'Iterators, functional mapping, tabular manipulation, and clean exception handling.',
    status: 'upcoming',
    estimatedHours: 14,
    order: 4
  },
  {
    id: 'rdm_5',
    level: 'Advanced',
    title: 'Graph Algorithms & Dynamic Programming Optimization',
    subject: 'Data Structures',
    description: 'Dijkstra shortest path, minimum spanning trees, memoization matrices, and Big-O profiling.',
    status: 'upcoming',
    estimatedHours: 20,
    order: 5
  },
  {
    id: 'rdm_6',
    level: 'Advanced',
    title: 'Enterprise Architecture & Cloud Database Sharding',
    subject: 'Database Management',
    description: 'Distributed transactions, multi-region replication, and query execution plan tuning.',
    status: 'upcoming',
    estimatedHours: 18,
    order: 6
  }
];

export const INITIAL_IMPROVEMENT_METRICS: ImprovementMetric[] = [
  {
    subject: 'Angular',
    previousScore: 28,
    latestScore: 35,
    improvementPercentage: 25.0,
    trend: 'up',
    consistencyDays: 4,
    recommendationsResolved: 2
  },
  {
    subject: 'JavaScript',
    previousScore: 78,
    latestScore: 88,
    improvementPercentage: 12.8,
    trend: 'up',
    consistencyDays: 14,
    recommendationsResolved: 5
  },
  {
    subject: 'Database Management',
    previousScore: 65,
    latestScore: 68,
    improvementPercentage: 4.6,
    trend: 'up',
    consistencyDays: 7,
    recommendationsResolved: 3
  },
  {
    subject: 'HTML and CSS',
    previousScore: 80,
    latestScore: 78,
    improvementPercentage: -2.5,
    trend: 'down',
    consistencyDays: 5,
    recommendationsResolved: 4
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'qz_ang_01',
    subject: 'Angular',
    title: 'Angular Standalone & Core Architecture Quiz',
    description: 'Test your understanding of standalone components, dependency injection, signals, and routing.',
    difficulty: 'Beginner',
    timeLimitMinutes: 10,
    passPercentage: 60,
    questions: [
      {
        id: 'q_ang_1',
        questionText: 'What property in the @Component decorator designates a component as standalone in modern Angular?',
        options: [
          'standalone: true',
          'module: false',
          'isolated: true',
          'pure: true'
        ],
        correctOptionIndex: 0,
        explanation: 'In Angular, setting "standalone: true" allows the component to directly manage its dependencies in the "imports" array without requiring an NgModule declaration.'
      },
      {
        id: 'q_ang_2',
        questionText: 'Which function is used to initialize an Angular application using a standalone root component?',
        options: [
          'platformBrowserDynamic().bootstrapModule()',
          'bootstrapApplication()',
          'initAngularRoot()',
          'createRootApplication()'
        ],
        correctOptionIndex: 1,
        explanation: 'bootstrapApplication(RootComponent, config) is the standard modern API used in main.ts to launch an application.'
      },
      {
        id: 'q_ang_3',
        questionText: 'What is the primary benefit of Angular Signals compared to traditional ChangeDetectionStrategy.Default?',
        options: [
          'It replaces HTML templates with JSX',
          'It enables fine-grained reactivity, notifying Angular precisely which parts of the DOM need updating',
          'It makes all network requests synchronous',
          'It automatically writes CSS rules for templates'
        ],
        correctOptionIndex: 1,
        explanation: 'Signals track reactive dependencies and notify the framework exactly when and where a value changed, optimizing DOM updates.'
      },
      {
        id: 'q_ang_4',
        questionText: 'Where are application-level route configurations typically declared in modern standalone Angular projects?',
        options: [
          'In the index.html head script',
          'In app.routes.ts provided via provideRouter(routes) in app.config.ts',
          'Inside each individual HTML file',
          'In package.json under the "routes" key'
        ],
        correctOptionIndex: 1,
        explanation: 'Routes are exported as a Routes array in app.routes.ts and registered in appConfig using provideRouter(routes).'
      },
      {
        id: 'q_ang_5',
        questionText: 'Which interface or functional type is used in modern Angular to protect a route from unauthorized access?',
        options: [
          'CanActivateFn / CanActivate',
          'HttpInterceptor',
          'RouteFilter',
          'AuthGuardComponent'
        ],
        correctOptionIndex: 0,
        explanation: 'CanActivateFn is a functional guard that inspects auth state and returns true, false, or a UrlTree redirect.'
      }
    ]
  },
  {
    id: 'qz_js_01',
    subject: 'JavaScript',
    title: 'Advanced JavaScript & Async Mechanics Quiz',
    description: 'Assess your knowledge on closures, the event loop, microtask queues, and ESNext methods.',
    difficulty: 'Intermediate',
    timeLimitMinutes: 10,
    passPercentage: 60,
    questions: [
      {
        id: 'q_js_1',
        questionText: 'Which queue in the JavaScript runtime has higher execution priority: the microtask queue or the macrotask queue?',
        options: [
          'Macrotask queue',
          'Microtask queue',
          'Both have identical round-robin priority',
          'Whichever task was registered first by timestamp'
        ],
        correctOptionIndex: 1,
        explanation: 'The event loop completely drains all microtasks (e.g. Promise.then, queueMicrotask) before picking up the next macrotask (e.g. setTimeout).'
      },
      {
        id: 'q_js_2',
        questionText: 'What is the output of `typeof null` in standard JavaScript?',
        options: [
          '"null"',
          '"undefined"',
          '"object"',
          '"boolean"'
        ],
        correctOptionIndex: 2,
        explanation: 'In JavaScript, typeof null returns "object", which is a historical bug in the language implementation preserved for backward compatibility.'
      },
      {
        id: 'q_js_3',
        questionText: 'What is a JavaScript closure?',
        options: [
          'A method to terminate the browser process',
          'A function combined with its lexical environment, allowing it to access outer variables even after the outer function has returned',
          'A syntax error caused by missing curly braces',
          'An encrypted string format for JSON objects'
        ],
        correctOptionIndex: 1,
        explanation: 'A closure is created whenever a function is created, retaining access to its enclosing lexical scope.'
      },
      {
        id: 'q_js_4',
        questionText: 'Which Promise method waits for all promises to settle (either fulfill or reject) before returning their statuses?',
        options: [
          'Promise.all()',
          'Promise.race()',
          'Promise.allSettled()',
          'Promise.any()'
        ],
        correctOptionIndex: 2,
        explanation: 'Promise.allSettled() returns an array describing the outcome (fulfilled or rejected) of each input promise without failing early.'
      },
      {
        id: 'q_js_5',
        questionText: 'What happens when you declare a variable with `const` in JavaScript?',
        options: [
          'The variable cannot be reassigned to a new memory address, though mutated object properties remain mutable',
          'The entire object and all its nested properties become deeply frozen automatically',
          'The variable is hoisted and initialized to undefined',
          'The variable is stored exclusively in LocalStorage'
        ],
        correctOptionIndex: 0,
        explanation: 'const creates an immutable binding (reassignment throws a TypeError), but the value it references can still be mutated if it is an object or array.'
      }
    ]
  },
  {
    id: 'qz_db_01',
    subject: 'Database Management',
    title: 'Relational DBMS & SQL Optimization Quiz',
    description: 'Evaluate your understanding of normalization, indexing, transactions, and SQL queries.',
    difficulty: 'Intermediate',
    timeLimitMinutes: 10,
    passPercentage: 60,
    questions: [
      {
        id: 'q_db_1',
        questionText: 'A relation is in Third Normal Form (3NF) if it is in 2NF and what condition is satisfied?',
        options: [
          'Every attribute is indexed',
          'No non-prime attribute is transitively dependent on the primary key',
          'It has no foreign keys',
          'All columns contain string datatypes'
        ],
        correctOptionIndex: 1,
        explanation: '3NF requires that no transitive functional dependency exists between non-prime attributes and any candidate key.'
      },
      {
        id: 'q_db_2',
        questionText: 'What does the ACID acronym stand for in database transaction management?',
        options: [
          'Accuracy, Consistency, Indexing, Durability',
          'Atomicity, Consistency, Isolation, Durability',
          'Asynchronous, Concurrency, Integrity, Distribution',
          'Access, Control, Identity, Data'
        ],
        correctOptionIndex: 1,
        explanation: 'ACID guarantees Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrency control), and Durability (persistence after commit).'
      },
      {
        id: 'q_db_3',
        questionText: 'Which index structure is the default and most widely utilized in relational engines like PostgreSQL and MySQL InnoDB?',
        options: [
          'Bitmap Index',
          'B-Tree / B+ Tree Index',
          'R-Tree Index',
          'Inverted Index'
        ],
        correctOptionIndex: 1,
        explanation: 'B+ Tree structures keep data sorted and allow search, sequential access, insertions, and deletions in logarithmic time (O(log N)).'
      },
      {
        id: 'q_db_4',
        questionText: 'Which SQL command displays the detailed query execution plan chosen by the database query optimizer?',
        options: [
          'ANALYZE PLAN',
          'EXPLAIN',
          'OPTIMIZE SHOW',
          'TRACE QUERY'
        ],
        correctOptionIndex: 1,
        explanation: 'EXPLAIN (or EXPLAIN ANALYZE) shows the execution steps, index scans, cost estimates, and actual rows processed.'
      },
      {
        id: 'q_db_5',
        questionText: 'What is the purpose of the FOREIGN KEY constraint in relational schemas?',
        options: [
          'To encrypt user credentials',
          'To enforce referential integrity between two related tables',
          'To boost write speeds for bulk inserts',
          'To convert tables to NoSQL collections'
        ],
        correctOptionIndex: 1,
        explanation: 'Foreign keys ensure that relationships between tables remain consistent, preventing orphan records.'
      }
    ]
  },
  {
    id: 'qz_py_01',
    subject: 'Python',
    title: 'Python Fundamentals & Data Structures Quiz',
    description: 'Test your understanding of Python syntax, collections, generators, and idioms.',
    difficulty: 'Beginner',
    timeLimitMinutes: 10,
    passPercentage: 60,
    questions: [
      {
        id: 'q_py_1',
        questionText: 'Which keyword turns a standard Python function into a generator?',
        options: [
          'return',
          'yield',
          'generate',
          'stream'
        ],
        correctOptionIndex: 1,
        explanation: 'The "yield" keyword pauses function execution, saves state, and produces a value lazily to the caller.'
      },
      {
        id: 'q_py_2',
        questionText: 'Which of the following data structures in Python is immutable?',
        options: [
          'List',
          'Dictionary',
          'Tuple',
          'Set'
        ],
        correctOptionIndex: 2,
        explanation: 'Tuples are immutable sequences; once created, elements cannot be modified, added, or removed.'
      },
      {
        id: 'q_py_3',
        questionText: 'What is the time complexity of looking up a key in a standard Python dictionary on average?',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n log n)'
        ],
        correctOptionIndex: 0,
        explanation: 'Python dictionaries are implemented using hash tables, offering average O(1) time complexity for key lookups.'
      },
      {
        id: 'q_py_4',
        questionText: 'What is the correct syntax for a list comprehension generating squares of even numbers from 0 to 9?',
        options: [
          '[x**2 for x in range(10) if x % 2 == 0]',
          '[for x in range(10) if x % 2 == 0: x**2]',
          '[x**2 if x % 2 == 0 in range(10)]',
          'list(x**2 where x % 2 == 0)'
        ],
        correctOptionIndex: 0,
        explanation: 'The standard list comprehension syntax is [expression for item in iterable if condition].'
      },
      {
        id: 'q_py_5',
        questionText: 'What does the `__init__` method represent in a Python class?',
        options: [
          'The class destructor',
          'The constructor method invoked automatically when a new instance is created',
          'A private method that can never be called',
          'A module import directive'
        ],
        correctOptionIndex: 1,
        explanation: '__init__ is the initializer (constructor) method in Python, called to configure attributes on newly instantiated objects.'
      }
    ]
  },
  {
    id: 'qz_web_01',
    subject: 'HTML and CSS',
    title: 'HTML5 Semantics & Responsive CSS Quiz',
    description: 'Check your mastery of modern layout techniques, flexbox, CSS Grid, and responsive patterns.',
    difficulty: 'Beginner',
    timeLimitMinutes: 10,
    passPercentage: 60,
    questions: [
      {
        id: 'q_web_1',
        questionText: 'Which CSS display property values create a two-dimensional grid layout?',
        options: [
          'display: flex',
          'display: grid',
          'display: inline-block',
          'display: table-cell'
        ],
        correctOptionIndex: 1,
        explanation: 'display: grid defines a container that formats child items across both horizontal rows and vertical columns.'
      },
      {
        id: 'q_web_2',
        questionText: 'What is the primary difference between HTML semantic elements (like <main>, <nav>, <article>) and <div> tags?',
        options: [
          'Semantic tags are faster to download',
          'Semantic tags convey structural meaning to search engines, screen readers, and accessibility tools',
          '<div> tags are deprecated in HTML5',
          'Semantic elements cannot be styled with CSS'
        ],
        correctOptionIndex: 1,
        explanation: 'Semantic elements provide meaningful metadata for accessibility, screen readers (WCAG), and search indexing.'
      },
      {
        id: 'q_web_3',
        questionText: 'In CSS Flexbox, which property aligns items along the cross axis?',
        options: [
          'justify-content',
          'align-items',
          'flex-direction',
          'flex-wrap'
        ],
        correctOptionIndex: 1,
        explanation: 'justify-content aligns items along the main axis, while align-items aligns them along the cross axis.'
      },
      {
        id: 'q_web_4',
        questionText: 'What CSS function allows dynamic responsive typography clamped between a minimum, preferred, and maximum value?',
        options: [
          'minmax()',
          'calc()',
          'clamp()',
          'fit()'
        ],
        correctOptionIndex: 2,
        explanation: 'clamp(MIN, VAL, MAX) clamps a value between lower and upper bounds, e.g., font-size: clamp(1rem, 2.5vw, 2rem).'
      },
      {
        id: 'q_web_5',
        questionText: 'What is the box-sizing property value that includes padding and border within an element\'s total width and height?',
        options: [
          'content-box',
          'border-box',
          'padding-box',
          'margin-box'
        ],
        correctOptionIndex: 1,
        explanation: 'box-sizing: border-box prevents elements from overflowing unexpectedly when padding or borders are applied.'
      }
    ]
  }
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att_01',
    quizId: 'qz_ang_01',
    quizTitle: 'Angular Standalone & Core Architecture Quiz',
    subject: 'Angular',
    date: '2026-02-15 14:30',
    totalQuestions: 5,
    correctAnswersCount: 2,
    scorePercentage: 40,
    passed: false,
    selectedAnswers: { 0: 0, 1: 1, 2: 2, 3: 0, 4: 2 }
  },
  {
    id: 'att_02',
    quizId: 'qz_js_01',
    quizTitle: 'Advanced JavaScript & Async Mechanics Quiz',
    subject: 'JavaScript',
    date: '2026-02-14 11:15',
    totalQuestions: 5,
    correctAnswersCount: 5,
    scorePercentage: 100,
    passed: true,
    selectedAnswers: { 0: 1, 1: 2, 2: 1, 3: 2, 4: 0 }
  },
  {
    id: 'att_03',
    quizId: 'qz_db_01',
    quizTitle: 'Relational DBMS & SQL Optimization Quiz',
    subject: 'Database Management',
    date: '2026-02-12 16:45',
    totalQuestions: 5,
    correctAnswersCount: 3,
    scorePercentage: 60,
    passed: true,
    selectedAnswers: { 0: 1, 1: 1, 2: 1, 3: 0, 4: 2 }
  },
  {
    id: 'att_04',
    quizId: 'qz_web_01',
    subject: 'HTML and CSS',
    quizTitle: 'HTML5 Semantics & Responsive CSS Quiz',
    date: '2026-02-10 09:20',
    totalQuestions: 5,
    correctAnswersCount: 4,
    scorePercentage: 80,
    passed: true,
    selectedAnswers: { 0: 1, 1: 1, 2: 1, 3: 2, 4: 0 }
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Adaptive Learning Alert: Angular Practice Recommended',
    message: 'Your recent Angular assessment score was 35%. A remedial learning path has been curated for you.',
    timestamp: '10 minutes ago',
    read: false,
    type: 'recommendation',
    link: '/adaptive-learning'
  },
  {
    id: 'notif_2',
    title: 'Quiz Completed: Advanced JavaScript',
    message: 'Congratulations! You scored 100% in the Advanced JavaScript & Async Mechanics assessment.',
    timestamp: 'Yesterday',
    read: false,
    type: 'quiz',
    link: '/assessments'
  },
  {
    id: 'notif_3',
    title: 'New Course Available',
    message: 'Dr. Priya Sharma published "Python for Data Engineering & Scientific Computing". Check the catalog!',
    timestamp: '2 days ago',
    read: true,
    type: 'course',
    link: '/courses'
  },
  {
    id: 'notif_4',
    title: 'Learning Goal Achieved',
    message: 'You have maintained a 7-day study streak in Database Management & Systems.',
    timestamp: '3 days ago',
    read: true,
    type: 'achievement',
    link: '/dashboard'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    title: 'Completed Lesson: Component Lifecycle and Data Binding',
    description: 'Modern Angular & Enterprise Architecture',
    timestamp: '2 hours ago',
    type: 'lesson'
  },
  {
    id: 'act_2',
    title: 'Attempted Quiz: Angular Standalone & Core Architecture',
    description: 'Scored 40% - Rule-based recommendation engine triggered',
    timestamp: 'Yesterday',
    type: 'quiz'
  },
  {
    id: 'act_3',
    title: 'Completed Lesson: The Event Loop & Task Queues',
    description: 'Advanced JavaScript & Asynchronous Programming',
    timestamp: '2 days ago',
    type: 'lesson'
  },
  {
    id: 'act_4',
    title: 'Enrolled in Course',
    description: 'Relational Databases & SQL Query Optimization',
    timestamp: '1 week ago',
    type: 'enrollment'
  }
];

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'Gaurav Bodkhe',
    module: 'Authentication, User Management, App Layout & Student Dashboard',
    summary: 'Sign in, registration, route guards, profile editing, toast system, and student dashboard analytics'
  },
  {
    id: 'm2',
    name: 'Shantanu Gadhave',
    module: 'Course & Learning Management, Theming',
    summary: 'Six-course catalog, filters, course detail syllabus, learning player, and light/dark theme'
  },
  {
    id: 'm3',
    name: 'Samarth Tanpure',
    module: 'Adaptive Dashboard UI',
    summary: 'Adaptive Dashboard page layout: competency cards and the viva simulator panel'
  },
  {
    id: 'm4',
    name: 'Pranav Pagar',
    module: 'Quiz Runner',
    summary: 'Quiz runner screen: question display, timer, and result summary'
  },
  {
    id: 'm5',
    name: 'Pranav Pagire',
    module: 'Notification Dropdown & Demo Reset',
    summary: 'Notification dropdown with unread badge, and the Reset Demo Data button'
  }
];
