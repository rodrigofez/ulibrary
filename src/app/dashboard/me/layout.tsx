import Navigation from "../components/Navigation";

const routes = [
  {
    name: "Books",
    path: "/dashboard/me",
  },
  {
    name: "Borrowed books",
    path: "/dashboard/me/borrowed",
  },
];

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Include shared UI here e.g. a header or sidebar */}
      <Navigation routes={routes} />
      {children}
    </>
  );
}
