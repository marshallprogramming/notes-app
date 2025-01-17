import { IconProps } from "./types";

const PlusIcon = ({
  height = "1em",
  fill = "currentColor",
  focusable = "false",
  ...props
}: IconProps) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path fill={fill} d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
  </svg>
);

export default PlusIcon;
