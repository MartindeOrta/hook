//cargamos los datos del html
inputKey=document.querySelector('#apikey')
inputSecret=document.querySelector('#apisecret')
boton=document.querySelector('button')

//como es una funcion asincrona nesecitamos una variable externa que nos ayude a saber en que estado esta 
// respuesta.estado=0 todabia no cargo respuesta 
//respuesta.estado=1 api rechasada
//respuesta.estado=2 api aceptada
//respuesta.saldoTotal=saldo total
// respuesta.saldodisponible=saldo disponible
let respuesta={estado:0,saldoTotal:0,saldodisponible:0};
//esta es la funcion que consulta la cuenta los parametros son dos string apikey y apisecret
async function  consultar (apikey,apisecret) {

    let keys ={'akey' : apikey,'skey' : apisecret}
    try{
        const res_time= await fetch('https://fapi.binance.com/fapi/v1/time')   
        const  time =  await res_time.json()
        let tiempoconsulta ="&timestamp=" + time.serverTime ;
        let signature = JHash.hex_hmac_sha256(keys['skey'], tiempoconsulta); 
        var consultapoint = 'https://fapi.binance.com/fapi/v2/account?' + "&timestamp=" + time.serverTime + '&signature=' + signature;  
        let url = consultapoint
        let cuerpo = {"method": 'GET',  "headers":{'X-MBX-APIKEY': keys['akey'] } }
        const res_saldo= await fetch(url,cuerpo)  
        console.log(res_saldo.status)  
        const saldo = await res_saldo.json()
        saldoTotal=parseFloat( saldo["totalMarginBalance"]).toFixed(2)
        saldoDisponible=parseFloat(saldo["availableBalance"]).toFixed(2)
        if(res_saldo.status===200){
            respuesta.estado=2
            respuesta.saldoTotal=saldoTotal
            respuesta.saldodisponible=saldoDisponible
        }else{
            respuesta.estado=1
            respuesta.saldoTotal=0
            respuesta.saldodisponible=0
        }
        
    }catch{
        respuesta[0]=1
    }
    //en esta seccion se pone lo que sigue despues de que consultamos la api dependiendo de la respuesta que obtengamos es lo que vamos a hacer...........................
    alert(`estado de respuesta=${respuesta.estado} 
    saldo total= ${respuesta.saldoTotal} saldo dispunible = ${ respuesta.saldodisponible}`)
}


//le agregamos el evento click al boton entonces cada vez que precionamos click sabremos los datos que necesitamos 
boton.addEventListener("click",()=>consultar(inputKey.value,inputSecret.value))

//reducimos el tamaño del jHash lo mas que se pudo 
class JHash {
	'use strict';
	static hexcase = 0;  // hex output format. 0 - lowercase; 1 - uppercase
	static b64pad  = ""; // base-64 pad character. "=" for strict RFC complianc
	static hex_hmac_sha256(k, d)    { return this.rstr2hex(this.rstr_hmac_sha256(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); }
	static rstr2hex(input) {
		try { this.hexcase } catch(e) { this.hexcase=0; }
		var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var output  = "";
		var x;
		for (var i = 0; i < input.length; i++) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F)
			       +  hex_tab.charAt( x        & 0x0F);
		}
		return output;
	}
	static rstr_hmac_sha256(key, data) {
		var bkey = this.rstr2binb(key);
		if (bkey.length > 16) {
			bkey = this.binb_sha256(bkey, key.length * 8);
		}
		var ipad = Array(16), opad = Array(16);
		for (var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		var hash = this.binb_sha256(ipad.concat(this.rstr2binb(data)), 512 + data.length * 8);
		return this.binb2rstr(this.binb_sha256(opad.concat(hash), 512 + 256));
	}
	static rstr2binb(input) {
		var output = Array(input.length >> 2);
		for (var i = 0; i < output.length; i++) {
			output[i] = 0;
		}
		for (var i = 0; i < input.length * 8; i += 8) {
			output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
		}
		return output;
	}
	static binb_sha256(m, l) {
		var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h;
		var i, j, T1, T2;
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
		for (i = 0; i < m.length; i += 16) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
			for (j = 0; j < 64; j++) {
				if (j < 16) {
					W[j] = m[j + i];
				} else {
					W[j] = this.safe_add(this.safe_add(this.safe_add(this.sha256_Gamma1256(W[j - 2]), W[j - 7]), this.sha256_Gamma0256(W[j - 15])), W[j - 16]);
				}
				T1 = this.safe_add(this.safe_add(this.safe_add(this.safe_add(h, this.sha256_Sigma1256(e)), this.sha256_Ch(e, f, g)), this.sha256_K[j]), W[j]);
				T2 = this.safe_add(this.sha256_Sigma0256(a), this.sha256_Maj(a, b, c));
				h = g;
				g = f;
				f = e;
				e = this.safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = this.safe_add(T1, T2);
			}

			HASH[0] = this.safe_add(a, HASH[0]);
			HASH[1] = this.safe_add(b, HASH[1]);
			HASH[2] = this.safe_add(c, HASH[2]);
			HASH[3] = this.safe_add(d, HASH[3]);
			HASH[4] = this.safe_add(e, HASH[4]);
			HASH[5] = this.safe_add(f, HASH[5]);
			HASH[6] = this.safe_add(g, HASH[6]);
			HASH[7] = this.safe_add(h, HASH[7]);
		}
		return HASH;
	}
	static binb2rstr(input) {
		var output = "";
		for (var i = 0; i < input.length * 32; i += 8) {
			output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
		}
		return output;
	}
	static safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	static sha256_Gamma1256(x) { return (this.sha256_S(x, 17) ^ this.sha256_S(x, 19) ^ this.sha256_R(x, 10)); }
	static sha256_Gamma0256(x) { return (this.sha256_S(x, 7) ^ this.sha256_S(x, 18) ^ this.sha256_R(x, 3)); }
	static sha256_Sigma1256(x) { return (this.sha256_S(x, 6) ^ this.sha256_S(x, 11) ^ this.sha256_S(x, 25)); }
	static sha256_Ch(x, y, z)  { return ((x & y) ^ ((~x) & z)); }
	static sha256_R(X, n)      { return ( X >>> n ); }
	static sha256_K = new Array(1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998);
	static sha256_Sigma0256(x) { return (this.sha256_S(x, 2) ^ this.sha256_S(x, 13) ^ this.sha256_S(x, 22)); }
	static sha256_Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	static sha256_S(X, n)      { return ( X >>> n ) | (X << (32 - n)); }
	static str2rstr_utf8(input) {
		var output = "";
		var i = -1;
		var x, y;

		while (++i < input.length) {
			// Decode utf-16 surrogate pairs
			x = input.charCodeAt(i);
			y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
			if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
				x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
				i++;
			}

			// Encode output as utf-8
			if (x <= 0x7F) {
				output += String.fromCharCode(x);
			} else if (x <= 0x7FF) {
				output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
				                              0x80 | ( x         & 0x3F));
			} else if (x <= 0xFFFF) {
				output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
				                              0x80 | ((x >>> 6 ) & 0x3F),
				                              0x80 | ( x         & 0x3F));
			} else if (x <= 0x1FFFFF) {
				output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
				                              0x80 | ((x >>> 12) & 0x3F),
				                              0x80 | ((x >>> 6 ) & 0x3F),
				                              0x80 | ( x         & 0x3F));
			}
		}
		return output;
	}
}
