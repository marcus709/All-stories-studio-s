import { Timeline } from "@/components/ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      id: "2024",
      title: "2024",
      content: (
        <div>
          <div className="prose prose-sm dark:prose-invert">
            <p>
              This year we're focused on making shadcn/ui more stable and
              maintainable.
            </p>
            <ul>
              <li>Improved component architecture</li>
              <li>Better TypeScript support</li>
              <li>More components</li>
              <li>Better documentation</li>
              <li>
                New features
                <ul>
                  <li>Theming support</li>
                  <li>Component playground</li>
                  <li>CLI improvements</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "early-2023",
      title: "Early 2023",
      content: (
        <div>
          <div className="prose prose-sm dark:prose-invert">
            <p>
              In early 2023, I started working on shadcn/ui. The goal was to create
              a collection of reusable components that can be copied and pasted
              into your apps.
            </p>
            <h4>Key features:</h4>
            <ul>
              <li>Built with React Server Components in mind.</li>
              <li>
                Style with Tailwind CSS.
                <ul>
                  <li>Configurable on the utility level.</li>
                  <li>
                    Use with any color scheme: slate, zinc, stone, gray, neutral.
                  </li>
                </ul>
              </li>
              <li>
                Copy and paste into your apps.
                <ul>
                  <li>Get started with one component.</li>
                  <li>No unnecessary dependencies.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "changelog",
      title: "Changelog",
      content: (
        <div>
          <div className="prose prose-sm dark:prose-invert">
            <p>
              The first commit was made on March 8, 2023. The library was released
              with support for Next.js and is now used by thousands of developers.
            </p>
            <h4>The first components:</h4>
            <ul>
              <li>Button</li>
              <li>Input</li>
              <li>Dialog</li>
              <li>Card</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return <Timeline data={data} />;
}