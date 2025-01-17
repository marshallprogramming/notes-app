import { IconProps } from "./types";

const HighlighterIcon = ({
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
      d="M15.2929 2.29289C15.6834 1.90237 16.3166 1.90237 16.7071 2.29289L21.7071 7.29289C22.0976 7.68342 22.0976 8.31658 21.7071 8.70711L11.7071 18.7071C11.5196 18.8946 11.2652 19 11 19H6C5.44772 19 5 18.5523 5 18V13C5 12.7348 5.10536 12.4804 5.29289 12.2929L15.2929 2.29289ZM15.7071 4.41421L7 13.1213V17H10.8787L19.5858 8.29289L15.7071 4.41421Z"
      fill={fill}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 20C3 19.4477 3.44772 19 4 19H20C20.5523 19 21 19.4477 21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20Z"
      fill={fill}
    />
  </svg>
);

export default HighlighterIcon;
