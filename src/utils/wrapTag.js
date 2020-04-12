export default function wrapTag(tag) {
  return (html) => `<${tag}>${html}</${tag}>`;
}
