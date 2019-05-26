import {GF} from "./GF"

export function keyToUInt128(b){
    return [
        (b[3]<<24) | (b[2]<<16) | (b[1]<<8) | b[0],
        (b[7]<<24) | (b[6]<<16) | (b[5]<<8) | b[4],
        (b[11]<<24) | (b[10]<<16) | (b[9]<<8) | b[8],
        (b[15]<<24) | (b[14]<<16) | (b[13]<<8) | b[12]
    ];
}

export function UInt128ToKey(d){
    return new Uint8Array([
        d[0] & 255, (d[0]>>>8)&255, (d[0]>>>16)&255, (d[0]>>>24)&255,
        d[1] & 255, (d[1]>>>8)&255, (d[1]>>>16)&255, (d[1]>>>24)&255,
        d[2] & 255, (d[2]>>>8)&255, (d[2]>>>16)&255, (d[2]>>>24)&255,
        d[3] & 255, (d[3]>>>8)&255, (d[3]>>>16)&255, (d[3]>>>24)&255
    ]);
}

function evaluate(poly, x0){
    var ans = new GF(0, 0, 0, 0);
    for(var i = poly.length - 1; i >= 0; --i){
        ans = ans.multiply(x0).add(poly[i]);
    }
    return ans;
}

export function encryptKey(k, n, key){
    var poly = Array(k);
    key = keyToUInt128(key);
    poly[0] = new GF(key[3], key[2], key[1], key[0]);
    var b = new Uint32Array(4);
    for(var i = 1; i < k; ++i){
        window.crypto.getRandomValues(b);
        poly[i] = new GF(b[3], b[2], b[1], b[0]);
    }
    var evals = Array(n);
    for(var i = 1; i <= n; ++i){
        evals[i - 1] = [new GF(0, 0, 0, i), evaluate(poly, new GF(0, 0, 0, i))];
    }
    return evals;
}

export function decryptKey(points){
    var n = points.length;
    var ans = new GF(0, 0, 0, 0);
    for(var i = 0; i < n; ++i){
        var num = points[i][1];
        var den = new GF(0, 0, 0, 1);
        for(var j = 0; j < n; ++j){
            if(j == i) continue;
            num = num.multiply(points[j][0]);
            if(points[i][0].equals(points[j][0])) return UInt128ToKey([0, 0, 0, 0]);
            den = den.multiply(points[i][0].subtract(points[j][0]));
        }
        ans = ans.add(num.divide(den));
    }
    return UInt128ToKey(ans.data);
}