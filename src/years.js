export default function years(element) {
  const refYear = element.dataset.refYear;
  if (!refYear) {
    return;
  }
  const diff = new Date(Date.now() - new Date(refYear));
  element.innerText = Math.floor(diff.getUTCFullYear() - 1970);
}
