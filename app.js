
function formSubmit(e) {
    const XHR = new XMLHttpRequest(),
        id = document.getElementById('hookId').value,
        body = document.getElementById('hookBody').value,
        response = document.getElementById('hookResponse');

    e.preventDefault();


    XHR.open( 'POST',id ,true);
    XHR.setRequestHeader( 'Content-Type', 'application/json' );
    XHR.withCredentials = true;
    XHR.send( body );
}

document.getElementById('testForm').addEventListener('submit', formSubmit);
