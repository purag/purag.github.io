get = (url, cb) ->
  req = new XMLHttpRequest()
  req.addEventListener 'load', ->
    cb JSON.parse req.response
  req.open 'GET', url, true
  req.send()

get '//api.stackexchange.com/2.2/users/814761?site=stackoverflow', (res) ->
  reputation = res.items[0].reputation
  roundedDown = (Math.floor reputation / 100) * 100
  document.querySelector '.so-reputation'
    .textContent = roundedDown.toLocaleString()
