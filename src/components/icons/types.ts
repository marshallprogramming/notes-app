export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "children"> {
  height?: string | number;
  fill?: string;
}
