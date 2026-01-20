export const ListIcon = ({ isActive }: { isActive: boolean }) => {
  const color = isActive ? "#1A73E8" : "#5F6368";

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="2" y1="4" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="8" x2="12" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="12" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
