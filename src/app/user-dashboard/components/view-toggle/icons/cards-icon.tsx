export const CardsIcon = ({ isActive }: { isActive: boolean }) => {
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
      <rect x="2" y="2" width="5" height="5" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="9" y="2" width="5" height="5" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="2" y="9" width="5" height="5" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="9" y="9" width="5" height="5" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
};
