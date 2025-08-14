export function Table({ children }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  );
}
export function THead({ children }) {
  return <thead className="text-left text-muted-foreground border-b border-border">{children}</thead>;
}
export function TBody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}
export function TR({ children }) {
  return <tr className="h-11 align-middle">{children}</tr>;
}
export function TH({ children }) {
  return <th className="px-3 py-2 font-medium">{children}</th>;
}
export function TD({ children }) {
  return <td className="px-3 py-2">{children}</td>;
}