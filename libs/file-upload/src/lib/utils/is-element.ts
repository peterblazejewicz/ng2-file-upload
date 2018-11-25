export const isElement: (node: any) => boolean = node => {
  return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
};
