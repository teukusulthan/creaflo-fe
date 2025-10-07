export function NavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-colors cursor-pointer hover:text-foreground "
    >
      {children}
    </button>
  );
}
