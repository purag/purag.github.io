// A section in the page hierarchy with its associated navigation element
class NavSection {
  constructor (navElem) {
    this.navElem = navElem;
    const section = document.querySelector(navElem.getAttribute('href'));
    const rect = section.getBoundingClientRect();
    this.bounds = {
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
    };
  }

  shouldBeActive () {
    return window.scrollY >= this.bounds.top &&
      window.scrollY <= this.bounds.bottom;
  }

  activate () {
    if (NavSection.active) NavSection.active.deactivate();
    this.navElem.classList.add('active');
    NavSection.active = this;
  }

  deactivate () {
    this.navElem.classList.remove('active');
    NavSection.active = null;
  }
}

const navSections = Array.from(document.querySelectorAll('.sub a'))
  .map((elem) => new NavSection(elem));
navSections[0].activate();

window.addEventListener('scroll', () => {
  for (let s of navSections)
    if (s.shouldBeActive()) s.activate();
});
