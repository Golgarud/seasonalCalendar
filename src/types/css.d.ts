// Allow side-effect and CSS-module imports (used by the web build) to typecheck.
declare module '*.css';
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
