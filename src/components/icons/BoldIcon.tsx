import { IconProps } from "./types";

const BoldIcon = ({
  height = "1em",
  fill = "currentColor",
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    focusable="false"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4C6 3.44772 6.44772 3 7 3H13C15.7614 3 18 5.23858 18 8C18 9.38062 17.4275 10.6307 16.5 11.5C17.9997 12.3955 19 14.0622 19 16C19 19.3137 16.3137 22 13 22H7C6.44772 22 6 21.5523 6 21V4ZM13 11C14.6569 11 16 9.65685 16 8C16 6.34315 14.6569 5 13 5H8V11H13ZM8 13V20H13C15.2091 20 17 18.2091 17 16C17 13.7909 15.2091 12 13 12H8V13Z"
      fill={fill}
    />
  </svg>
);

export default BoldIcon;
