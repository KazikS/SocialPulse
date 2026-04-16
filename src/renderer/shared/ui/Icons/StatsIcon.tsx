import { SVGProps } from "react";

export const StatsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="3,20 8,13 13,16 21,4" />
      <polyline points="16,4 21,4 21,9" />
    </svg>
  );
};
