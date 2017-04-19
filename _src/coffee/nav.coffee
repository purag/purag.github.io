# A section in the page hierarchy with its associated navigation element
class section
  constructor: (@navElem) ->
    @selector = @navElem.getAttribute "href"
    @elem = document.querySelector @selector
    rect = @elem.getBoundingClientRect()
    @bounds =
      top: window.scrollY + rect.top
      bottom: window.scrollY + rect.bottom

  shouldBeActive: ->
    window.scrollY + window.innerHeight / 2 >= @bounds.top &&
      window.scrollY + window.innerHeight / 2 < @bounds.bottom

  activate: ->
    section.active?.deactivate()
    @navElem.classList.add "active"
    section.active = @

  deactivate: ->
    @navElem.classList.remove "active"

sections = Array.from document.querySelectorAll ".sub a"
  .map (elem) -> new section elem
sections[0].activate()

window.addEventListener "scroll", -> for s in sections
  s.activate() if s.shouldBeActive()
