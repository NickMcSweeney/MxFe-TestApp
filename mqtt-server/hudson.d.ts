// declare SVG-filetypes as valid import
declare module "*.svg" {
  const content: any;
  export default content;
}
// declare KSY-filetypes (kaitai struct definition) as valid import
declare module "*.ksy" {
  const content: any;
  export default content;
}
