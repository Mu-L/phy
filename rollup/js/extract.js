
var lzma = function(){ "use strict";
var pp, n0 = 0x10000000000000000, n1 = 4294967295, n2 = 2147483647, n3 = 2147483648, n4 = 16777216;
function r(e,r){pp({action:nr,cbn:r,result:e})}function o(e){var r=[];return r[e-1]=void 0,r}function n(e,r){return i(e[0]+r[0],e[1]+r[1])}
function t(e,r){var o,n;return e[0]==r[0]&&e[1]==r[1]?0:(o=0>e[1],n=0>r[1],o&&!n?-1:!o&&n?1:d(e,r)[1]<0?-1:1)}
function i(e,r){var o,n;for(r%=n0,e%=n0,o=r%ir,n=Math.floor(e/ir)*ir,r=r-o+n,e=e-n+o;0>e;)e+=ir,r-=ir;for(;e>n1;)e-=ir,r+=ir;for(r%=n0;r>0x7fffffff00000000;)r-=n0;for(;-n0>r;)r+=n0;return[e,r]}
function u(e){return e>=0?[e,0]:[e+ir,-ir]}function s(e){return e[0]>=n3?~~Math.max(Math.min(e[0]-ir,n2),-n3):~~Math.max(Math.min(e[0],n2),-n3)}function d(e,r){return i(e[0]-r[0],e[1]-r[1])}
function c(e,r){return e.ab=r,e.cb=0,e.O=r.length,e}function m(e){return e.cb>=e.O?-1:255&e.ab[e.cb++]}function a(e){return e.ab=o(32),e.O=0,e}function _(e){var r=e.ab;return r.length=e.O,r}
function f(e,r,o,n){p(r,o,e.ab,e.O,n),e.O+=n}function p(e,r,o,n,t){for(var i=0;t>i;++i)o[n+i]=e[r+i]}
function D(e,r,o){var n,t,i,s,d="",c=[];for(t=0;5>t;++t){if(i=m(r),-1==i)throw Error("truncated input");c[t]=i<<24>>24}if(n=N({}),!z(n,c))throw Error("corrupted input");
for(t=0;64>t;t+=8){if(i=m(r),-1==i)throw Error("truncated input");i=i.toString(16),1==i.length&&(i="0"+i),d=i+""+d}/^0+$|^f+$/i.test(d)?e.N=ur:(s=parseInt(d,16),e.N=s>n1?ur:u(s)),e.Q=B(n,r,o,e.N)}
function l(e,r){return e.S=a({}),D(e,c({},r),e.S),e}function g(e,r,o){var n=e.D-r-1;for(0>n&&(n+=e.c);0!=o;--o)n>=e.c&&(n=0),e.x[e.D++]=e.x[n++],e.D>=e.c&&w(e)}
function v(e,r){(null==e.x||e.c!=r)&&(e.x=o(r)),e.c=r,e.D=0,e.w=0}function w(e){var r=e.D-e.w;r&&(f(e.V,e.x,e.w,r),e.D>=e.c&&(e.D=0),e.w=e.D)}
function R(e,r){var o=e.D-r-1;return 0>o&&(o+=e.c),e.x[o]}function h(e,r){e.x[e.D++]=r,e.D>=e.c&&w(e)}function P(e){w(e),e.V=null}function C(e){return e-=2,4>e?e:3}
function S(e){return 4>e?0:10>e?e-3:e-6}function M(e,r){return e.h=r,e.bb=null,e.X=1,e}function L(e){if(!e.X)throw Error("bad state");if(e.bb)throw Error("No encoding");return y(e),e.X}
function y(e){var r=I(e.h);if(-1==r)throw Error("corrupted input");e.$=ur,e.Z=e.h.d,(r||t(e.h.U,sr)>=0&&t(e.h.d,e.h.U)>=0)&&(w(e.h.b),P(e.h.b),e.h.a.K=null,e.X=0)}
function B(e,r,o,n){return e.a.K=r,P(e.b),e.b.V=o,b(e),e.f=0,e.l=0,e.T=0,e.R=0,e._=0,e.U=n,e.d=sr,e.I=0,M({},e)}
function I(e){ var r,o,i,d,c,m;if(m=s(e.d)&e.P,Q(e.a,e.q,(e.f<<4)+m)){if(Q(e.a,e.E,e.f))i=0,
Q(e.a,e.s,e.f)?(Q(e.a,e.u,e.f)?(Q(e.a,e.r,e.f)?(o=e._,e._=e.R):o=e.R,e.R=e.T):o=e.T,e.T=e.l,e.l=o):Q(e.a,e.n,(e.f<<4)+m)||(e.f=7>e.f?9:11,i=1),
i||(i=x(e.o,e.a,m)+2,e.f=7>e.f?8:11);else if(e._=e.R,e.R=e.T,e.T=e.l,i=2+x(e.C,e.a,m),e.f=7>e.f?7:10,c=q(e.j[C(i)],e.a),c>=4){if(d=(c>>1)-1,e.l=(2|1&c)<<d,14>c)e.l+=J(e.J,e.l-c-1,e.a,d);
else if(e.l+=U(e.a,d-4)<<4,e.l+=F(e.t,e.a),0>e.l)return-1==e.l?1:-1}else e.l=c;if(t(u(e.l),e.d)>=0||e.l>=e.m)return-1;
g(e.b,e.l,i),e.d=n(e.d,u(i)),e.I=R(e.b,0)}else r=Z(e.k,s(e.d),e.I),e.I=7>e.f?T(r,e.a):$(r,e.a,R(e.b,e.l)),h(e.b,e.I),e.f=S(e.f),e.d=n(e.d,dr);return 0}
function N(e){e.b={},e.a={},e.q=o(192),e.E=o(12),e.s=o(12),e.u=o(12),e.r=o(12),e.n=o(192),e.j=o(4),e.J=o(114),e.t=K({},4),e.C=G({}),e.o=G({}),e.k={};for(var r=0;4>r;++r)e.j[r]=K({},6);return e}
function b(e){e.b.w=0,e.b.D=0,X(e.q),X(e.n),X(e.E),X(e.s),X(e.u),X(e.r),X(e.J),H(e.k);for(var r=0;4>r;++r)X(e.j[r].B);A(e.C),A(e.o),X(e.t.B),V(e.a)}
function z(e,r){var o,n,t,i,u,s,d;if(5>r.length)return 0;for(d=255&r[0],t=d%9,s=~~(d/9),i=s%5,u=~~(s/5),o=0,n=0;4>n;++n)o+=(255&r[1+n])<<8*n;return o>99999999||!W(e,t,i,u)?0:O(e,o)}
function O(e,r){return 0>r?0:(e.z!=r&&(e.z=r,e.m=Math.max(e.z,1),v(e.b,Math.max(e.m,4096))),1)}
function W(e,r,o,n){if(r>8||o>4||n>4)return 0;E(e.k,o,r);var t=1<<n;return k(e.C,t),k(e.o,t),e.P=t-1,1}function k(e,r){for(;r>e.e;++e.e)e.G[e.e]=K({},3),e.H[e.e]=K({},3)}
function x(e,r,o){if(!Q(r,e.M,0))return q(e.G[o],r);var n=8;return n+=Q(r,e.M,1)?8+q(e.L,r):q(e.H[o],r)}function G(e){return e.M=o(2),e.G=o(16),e.H=o(16),e.L=K({},8),e.e=0,e}
function A(e){X(e.M);for(var r=0;e.e>r;++r)X(e.G[r].B),X(e.H[r].B);X(e.L.B)}
function E(e,r,n){var t,i;if(null==e.F||e.g!=n||e.y!=r)for(e.y=r,e.Y=(1<<r)-1,e.g=n,i=1<<e.g+e.y,e.F=o(i),t=0;i>t;++t)e.F[t]=j({})}
function Z(e,r,o){return e.F[((r&e.Y)<<e.g)+((255&o)>>>8-e.g)]}function H(e){var r,o;for(o=1<<e.g+e.y,r=0;o>r;++r)X(e.F[r].v)}
function T(e,r){var o=1;do o=o<<1|Q(r,e.v,o);while(256>o);return o<<24>>24}
function $(e,r,o){var n,t,i=1;do if(t=o>>7&1,o<<=1,n=Q(r,e.v,(1+t<<8)+i),i=i<<1|n,t!=n){for(;256>i;)i=i<<1|Q(r,e.v,i);break}while(256>i);return i<<24>>24}
function j(e){return e.v=o(768),e}function K(e,r){return e.A=r,e.B=o(1<<r),e}function q(e,r){var o,n=1;for(o=e.A;0!=o;--o)n=(n<<1)+Q(r,e.B,n);return n-(1<<e.A)}
function F(e,r){var o,n,t=1,i=0;for(n=0;e.A>n;++n)o=Q(r,e.B,t),t<<=1,t+=o,i|=o<<n;return i}function J(e,r,o,n){var t,i,u=1,s=0;for(i=0;n>i;++i)t=Q(o,e,r+u),u<<=1,u+=t,s|=t<<i;return s}
function Q(e,r,o){var n,t=r[o];return n=(e.i>>>11)*t,(-n3^n)>(-n3^e.p)?(e.i=n,r[o]=t+(2048-t>>>5)<<16>>16,-n4&e.i||(e.p=e.p<<8|m(e.K),e.i<<=8),0):(e.i-=n,e.p-=n,r[o]=t-(t>>>5)<<16>>16,
-n4&e.i||(e.p=e.p<<8|m(e.K),e.i<<=8),1)}
function U(e,r){var o,n,t=0;for(o=r;0!=o;--o)e.i>>>=1,n=e.p-e.i>>>31,e.p-=e.i&n-1,t=t<<1|1-n,-n4&e.i||(e.p=e.p<<8|m(e.K),e.i<<=8);return t}
function V(e){e.p=0,e.i=-1;for(var r=0;5>r;++r)e.p=e.p<<8|m(e.K)}function X(e){for(var r=e.length-1;r>=0;--r)e[r]=1024}
function Y(e){ for(var r,o,n,t=0,i=0,u=e.length,s=[],d=[];u>t;++t,++i){
if(r=255&e[t],128&r)if(192==(224&r)){if(t+1>=u)return e;if(o=255&e[++t],128!=(192&o))return e;d[i]=(31&r)<<6|63&o}else{if(224!=(240&r))return e;if(t+2>=u)return e;
if(o=255&e[++t],128!=(192&o))return e;if(n=255&e[++t],128!=(192&n))return e;d[i]=(15&r)<<12|(63&o)<<6|63&n}else{if(!r)return e;
d[i]=r}16383==i&&(s.push(String.fromCharCode.apply(String,d)),i=-1)}return i>0&&(d.length=i,s.push(String.fromCharCode.apply(String,d))),s.join("")}
function er(e){return e[1]+e[0]}
function rr(e,o,n){function t(){try{for(var e,r=0,u=(new Date).getTime();L(c.d.Q);)if(++r%1e3==0&&(new Date).getTime()-u>200)return s&&(i=er(c.d.Q.h.d)/d,n(i)),tr(t,0),0;
n(1),e=Y(_(c.d.S)),tr(o.bind(null,e),0)}catch(m){o(null,m)}} var i,u,s,d,c={},m=void 0===o&&void 0===n;
if("function"!=typeof o&&(u=o,o=n=0),n=n||function(e){return void 0!==u?r(s?e:-1,u):void 0},
o=o||function(e,r){return void 0!==u?pp({action:or,cbn:u,result:e,error:r}):void 0},m){for(c.d=l({},e);L(c.d.Q););return Y(_(c.d.S))}
try{c.d=l({},e),d=er(c.d.N),s=d>-1,n(0)}catch(a){return o(null,a)}tr(t,0)}
var or=2,nr=3,tr="function"==typeof setImmediate?setImmediate:setTimeout,ir=4294967296,ur=[n1,-ir],sr=[0,0],dr=[1,0];
return {decompress:rr}
}();

var extractor = ( function () {

    'use strict';

    var URL = window.URL || window.webkitURL;

    var callback, time;
    var results = {};
    var tmp = {};
    var urls = null;
    var types = null;

    extractor = {

        parse: function ( str ) {

        },

        load: function ( Urls, Callback, Types ) {

            callback = Callback || function(){};

            urls = Urls !== undefined ? Urls : [];
            types = Types !== undefined ? Types : [];

            if( typeof urls === 'string' || urls instanceof String ) urls = [urls];

            if( urls.length !== types.length ){
                for( var i = types.length; i < urls.length; i++ ){
                    types[i] = 0;
                }
            }

            if( urls.length ){ 

                time = new Date().getTime();
                this.loadOne();

            }

        },

        loadOne: function () {

            var self = this;

            var url = urls[0];
            var type = types[0];
            var name = url.substring( url.lastIndexOf('/')+1, url.lastIndexOf('.') );

            var xhr = new XMLHttpRequest(); 
            xhr.responseType = "arraybuffer";
            //xhr.responseType = "text";
            xhr.open('GET', url, true);

            xhr.onreadystatechange = function () {

                if ( xhr.readyState === 2 ) {
                } else if ( xhr.readyState === 3 ) { //  progress
                } else if ( xhr.readyState === 4 ) {
                    if ( xhr.status === 200 || xhr.status === 0 ) self.decompact( xhr.response, name, type );
                    else console.error( "Couldn't load ["+ name + "] [" + xhr.status + "]" );
                }

            }

            xhr.send( null );

        },

        decompact: function ( r, name, type ){

            var self = this;
            //if ( typeof r === 'string' || r instanceof String ) r = self.convert_formated_hex_to_bytes( r );
            //console.log(r)
            lzma.decompress( new Uint8Array( r ), function on_complete( r ) { self.add( r, name, type ); }); 

        },

        convert_formated_hex_to_bytes: function ( hex_str ) {

            var count = 0, hex_arr, hex_data = [], hex_len, i;
            
            if (hex_str.trim() === "") return [];
            
            /// Check for invalid hex characters.
            if (/[^0-9a-fA-F\s]/.test(hex_str)) return false;
            
            hex_arr = hex_str.split(/([0-9a-fA-F]+)/g);
            hex_len = hex_arr.length;
            
            for (i = 0; i < hex_len; ++i) {

                if (hex_arr[i].trim() === "") continue;
                hex_data[count++] = parseInt(hex_arr[i], 16);

            }
            
            return hex_data;

        },

        get: function ( name ){

            if( tmp[name] ) setTimeout( function(){ this.revoke(name); }.bind(this), 100);
            return results[name];

        },

        revoke: function ( name ){

            // clear garbage if blob
            if( !tmp[name] ) return
            URL.revokeObjectURL( tmp[name] );
            delete tmp[name]

        },

        add: function( r, name, type ){

            switch(type){
                case 0:// for javascript root code
                    var n = document.createElement("script");
                    n.type = "text/javascript";
                    //n.async = true;
                    n.charset = "utf-8";
                    n.text = r;
                    document.getElementsByTagName('head')[0].appendChild(n);
                break;
                case 1:// for worker injection
                    tmp[name] =  new Blob([ r ], { type: 'application/javascript' })
                    results[name] = URL.createObjectURL( tmp[name] );
                break;
                case 2:// only text 
                    results[name] = r;
                break;
            }
            
            this.next();

        },

        getTime: function () {

            return time;
            
        },

        next: function () {

            urls.shift();
            types.shift();

            if( urls.length === 0 ){

                time = this.format_time( new Date().getTime() - time );

                callback( results );

            } else {

                this.loadOne();

            }

        },

        format_time: function ( t ) {

            if (t > 1000)  return (t / 1000) + " sec";
            return t + " ms";

        },

    }

    return extractor;

})();