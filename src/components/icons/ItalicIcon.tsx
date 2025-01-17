import { IconProps } from "./types";

const ItalicIcon = ({
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
      d="M10 4C10 3.44772 10.4477 3 11 3H18C18.5523 3 19 3.44772 19 4C19 4.55228 18.5523 5 18 5H15.6769L11.4558 19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H7C6.44772 21 6 20.5523 6 20C6 19.4477 6.44772 19 7 19H9.32308L13.5442 5H11C10.4477 5 10 4.55228 10 4Z"
      fill={fill}
    />
  </svg>
);

export default ItalicIcon;
