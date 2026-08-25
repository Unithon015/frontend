interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  paddingX?: string;
}

export default function PageLayout({ children, className, paddingX = 'px-40' }: PageLayoutProps) {
  return (
    <main
      className={`mx-auto flex w-full max-w-screen-2xl flex-1 flex-col ${paddingX} py-10 ${className ?? ''}`}
    >
      {children}
    </main>
  );
}
