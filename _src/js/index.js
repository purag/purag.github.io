function get (url, cb) {
  const req = new XMLHttpRequest();
  req.addEventListener('load', function () {
    cb(JSON.parse(req.response));
  });
  req.open('GET', url, true);
  req.send();
}

get('//api.stackexchange.com/2.2/users/814761?site=stackoverflow', (res) => {
  const reputation = res.items[0].reputation;
  const roundedDown = Math.floor(reputation / 100) * 100
  document.querySelector('.so-reputation').textContent =
    roundedDown.toLocaleString();
});
