var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "name": "Hook TOMOUSDT",
  "secret": "uyccbu6wly8",
  "side": "buy",
  "symbol": "{{TOMOUSDT}}",
  "open": {
    "amountType": "balance",
    "amount": "60",
    "leverage": "2"
  } 
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://hook.finandy.com/PggoHJobbil5v5O6qFUK", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
