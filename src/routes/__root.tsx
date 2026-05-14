import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/enterprise/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex h-full items-center justify-center p-10">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-semibold text-foreground">404</h1>
        <h2 className="mt-3 text-base font-medium">Page not found</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-5">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:opacity-90"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex h-full items-center justify-center p-10">
      <div className="max-w-md text-center">
        <h1 className="text-base font-semibold">This page didn't load</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">{error.message}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-[13px] font-medium hover:bg-surface-hover"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BPML Governance Platform" },
      {
        name: "description",
        content: "Govern SAP Solution Manager BPML, capability templates, project rollout scope, and deployment coverage.",
      },
      { property: "og:title", content: "BPML Governance Platform" },
      { property: "og:description", content: "Process Compass manages SAP BPML, templates, project scope, and deployment coverage." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "BPML Governance Platform" },
      { name: "description", content: "Process Compass manages SAP BPML, templates, project scope, and deployment coverage." },
      { name: "twitter:description", content: "Process Compass manages SAP BPML, templates, project scope, and deployment coverage." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0064ef24-c7a6-4200-a215-b18ae56e5a80/id-preview-4e903605--82bc9dd3-9b3a-4c1f-bf7f-7fd9c301d03d.lovable.app-1778790528298.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0064ef24-c7a6-4200-a215-b18ae56e5a80/id-preview-4e903605--82bc9dd3-9b3a-4c1f-bf7f-7fd9c301d03d.lovable.app-1778790528298.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}
