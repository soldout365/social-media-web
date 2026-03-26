export const toggleOverflowHidden = (element) => {
  const el = document.querySelector(element);
  if (el) {
    el.classList.toggle("toHidden");
  }
};
