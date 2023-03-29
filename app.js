
string=`{"name": "Hook TOMOUSDT", "secret": "uyccbu6wly8","side": "buy", "symbol": "{{TOMOUSDT}}","open": {"amountType": "balance", "amount": "60","leverage": "2"}}`
jsondatos={
    "name": "Hook TOMOUSDT",
    "secret": "uyccbu6wly8",
    "side": "buy",
    "symbol": "{{TOMOUSDT}}",
    "open": {
      "amountType": "balance",
      "amount": "60",
      "leverage": "2"
    }
  }


entrar=document.getElementById('entrar')
url = document.getElementById('hookId').value;
data  = document.getElementById('hookBody').value
// jsondato=JSON.parse(data)
console.log(data)
entrar.addEventListener('click', function(){
    console.log(data)
    url = "https://hook.finandy.com/PggoHJobbil5v5O6qFUK";
    console.log(url)
    data  = jsondatos


    jsondatos={
        "name": "Hook TOMOUSDT",
        "secret": "uyccbu6wly8",
        "side": "buy",
        "symbol": "{{TOMOUSDT}}",
        "open": {
          "amountType": "balance",
          "amount": "60",
          "leverage": "2"
        }
      }




fetch(url, {
    method: 'POST', // or 'PUT'
    body: jsondatos, // data can be `string` or {object}!
    mode: 'cors',
    headers:{
      'Content-Type': 'application/json'
    }
  })
.then(dato => function(){datos.json()})
.then(datos=> console.log(datos))
.catch(e => function(){console.log(e)})
}
  )
