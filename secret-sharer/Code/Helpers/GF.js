function shiftLeft(a, cnt){
    var q = cnt >>> 5;
    var r = cnt & 31;
    for(var i = a.length - 1; i >= 0; --i){
        a[i] = i >= q ? a[i - q] : 0;
    }
    if (r == 0) return;
    for(var i = a.length - 1; i >= 0; --i){
        a[i] <<= r;
        if(i != 0) a[i] |= (a[i - 1] >>> (32 - r));
    }
}

function shiftRight(a, cnt){
    var q = cnt >>> 5;
    var r = cnt & 31;
    for(var i = 0; i < a.length; ++i){
        a[i] = i + q < a.length ? a[i + q] : 0;
    }
    if (r == 0) return;
    for(var i = 0; i < a.length; ++i){
        a[i] >>>= r;
        if(i != a.length - 1) a[i] |= (a[i + 1] << (32 - r));
    }
}

function testBit(a, pos){
    return (a[pos >>> 5] & (1 << (pos & 31))) != 0;
}

function negBit(a, pos){
    a[pos >>> 5] ^= (1 << (pos & 31));
}

function deg(a){
    for(var i = (a.length << 5) - 1; i >= 0; --i){
        if(testBit(a, i)) return i;
    }
    return -1;
}

function longDivision(a, b){
    var deg_r = deg(a);
    var deg_b = deg(b);
    if(deg_r < deg_b) return [[0, 0, 0, 0, 0], [a[0], a[1], a[2], a[3], a[4]]];
    var d = deg_r - deg_b;
    var q = [0, 0, 0, 0, 0];
    var r = [a[0], a[1], a[2], a[3], a[4]];
    var B = [b[0], b[1], b[2], b[3], b[4]];
    shiftLeft(B, d);
    while((d = deg_r - deg_b) >= 0){
        if(testBit(r, deg_r)){
            negBit(q, d);
            for(var i = 0; i < 5; ++i) r[i] ^= B[i];
        }
        shiftRight(B, 1);
        --deg_r;
    }
    return [q, r];
}

export function GF(d, c, b, a){
    this.data = [a, b, c, d, 0];

    this.equals = function(rhs){
        return this.data[0] == rhs.data[0] && this.data[1] == rhs.data[1] && this.data[2] == rhs.data[2] && this.data[3] == rhs.data[3];
    }

    this.add = function(rhs){
        return new GF(this.data[3] ^ rhs.data[3], this.data[2] ^ rhs.data[2], this.data[1] ^ rhs.data[1], this.data[0] ^ rhs.data[0]);
    }

    this.subtract = function(rhs){
        return new GF(this.data[3] ^ rhs.data[3], this.data[2] ^ rhs.data[2], this.data[1] ^ rhs.data[1], this.data[0] ^ rhs.data[0]);
    }

    this.multiply = function(rhs){
        var a = [this.data[0], this.data[1], this.data[2], this.data[3]];
        var b = [rhs.data[0], rhs.data[1], rhs.data[2], rhs.data[3]];
        var res = [0, 0, 0, 0];
        while(!(b[3] == 0 && b[2] == 0 && b[1] == 0 && b[0] == 0)){
            if((b[0] & 1) != 0){
                res[3] ^= a[3];
                res[2] ^= a[2];
                res[1] ^= a[1];
                res[0] ^= a[0];
            }
            var overflow = (a[3] >>> 31) == 1;
            shiftLeft(a, 1);
            if(overflow){
                a[2] ^= (1 << 13);
                a[1] ^= (1 << 3);
                a[0] ^= ((1 << 11) | (1 << 0));
            }
            shiftRight(b, 1);
        }
        return new GF(res[3], res[2], res[1], res[0]);
    }

    this.divide = function(rhs){
        var r0 = new GF(0, (1 << 13), (1 << 3), (1 << 11) | (1 << 0));
        r0.data[4] = (1 << 0);
        var r1 = rhs;
        var s0 = new GF(0, 0, 0, 0);
        var s1 = new GF(0, 0, 0, 1);
        var zero = new GF(0, 0, 0, 0);
        while(!r1.equals(zero)){
            var tmp = longDivision(r0.data, r1.data);
            var q = new GF(tmp[0][3], tmp[0][2], tmp[0][1], tmp[0][0]);
            var ri = new GF(tmp[1][3], tmp[1][2], tmp[1][1], tmp[1][0]);
            r0 = r1;
            r1 = ri;
            var si = s0.subtract(s1.multiply(q));
            s0 = s1;
            s1 = si;
        }
        return this.multiply(s0);
    }
}