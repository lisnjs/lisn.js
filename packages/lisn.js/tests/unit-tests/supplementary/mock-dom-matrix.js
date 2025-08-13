class DOMMatrixReadOnly {
  constructor(init) {
    this._m11 = 1;
    this._m12 = 0;
    this._m13 = 0;
    this._m14 = 0;
    this._m21 = 0;
    this._m22 = 1;
    this._m23 = 0;
    this._m24 = 0;
    this._m31 = 0;
    this._m32 = 0;
    this._m33 = 1;
    this._m34 = 0;
    this._m41 = 0;
    this._m42 = 0;
    this._m43 = 0;
    this._m44 = 1;

    if (init instanceof DOMMatrixReadOnly) {
      Object.assign(this, init);
    } else if (
      init instanceof Object &&
      typeof init[Symbol.iterator] === "function" &&
      init.length === 16
    ) {
      [
        this._m11,
        this._m12,
        this._m13,
        this._m14,
        this._m21,
        this._m22,
        this._m23,
        this._m24,
        this._m31,
        this._m32,
        this._m33,
        this._m34,
        this._m41,
        this._m42,
        this._m43,
        this._m44,
      ] = init;
    }
  }

  get m11() {
    return this._m11;
  }

  get m12() {
    return this._m12;
  }

  get m13() {
    return this._m13;
  }

  get m14() {
    return this._m14;
  }

  get m21() {
    return this._m21;
  }

  get m22() {
    return this._m22;
  }

  get m23() {
    return this._m23;
  }

  get m24() {
    return this._m24;
  }

  get m31() {
    return this._m31;
  }

  get m32() {
    return this._m32;
  }

  get m33() {
    return this._m33;
  }

  get m34() {
    return this._m34;
  }

  get m41() {
    return this._m41;
  }

  get m42() {
    return this._m42;
  }

  get m43() {
    return this._m43;
  }

  get m44() {
    return this._m44;
  }

  get a() {
    return this._m11;
  }

  get b() {
    return this._m12;
  }

  get c() {
    return this._m21;
  }

  get d() {
    return this._m22;
  }

  get e() {
    return this._m41;
  }

  get f() {
    return this._m42;
  }

  get is2D() {
    return (
      this._m13 === 0 &&
      this._m14 === 0 &&
      this._m23 === 0 &&
      this._m24 === 0 &&
      this._m31 === 0 &&
      this._m32 === 0 &&
      this._m33 === 1 &&
      this._m34 === 0 &&
      this._m43 === 0 &&
      this._m44 === 1
    );
  }

  get isIdentity() {
    return (
      this._m11 === 1 &&
      this._m12 === 0 &&
      this._m13 === 0 &&
      this._m14 === 0 &&
      this._m21 === 0 &&
      this._m22 === 1 &&
      this._m23 === 0 &&
      this._m24 === 0 &&
      this._m31 === 0 &&
      this._m32 === 0 &&
      this._m33 === 1 &&
      this._m34 === 0 &&
      this._m41 === 0 &&
      this._m42 === 0 &&
      this._m43 === 0 &&
      this._m44 === 1
    );
  }

  inverse() {
    const m = this.toFloat32Array();
    const inv = new Float32Array(16);

    inv[0] =
      m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10];
    inv[4] =
      -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10];
    inv[8] =
      m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9];
    inv[12] =
      -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9];

    inv[1] =
      -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10];
    inv[5] =
      m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10];
    inv[9] =
      -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9];
    inv[13] =
      m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9];

    inv[2] =
      m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6];
    inv[6] =
      -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6];
    inv[10] =
      m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5];
    inv[14] =
      -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5];

    inv[3] =
      -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6];
    inv[7] =
      m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6];
    inv[11] =
      -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5];
    inv[15] =
      m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5];

    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

    if (det === 0) {
      for (let i = 0; i < 16; i++) {
        inv[i] = NaN;
      }
    } else {
      det = 1.0 / det;
      for (let i = 0; i < 16; i++) {
        inv[i] *= det;
      }
    }

    return new this.constructor(Array.from(inv));
  }

  rotateAxisAngle(x, y, z, angle) {
    const rad = (angle * Math.PI) / 180;
    const len = Math.hypot(x, y, z);
    if (len === 0) return this;
    x /= len;
    y /= len;
    z /= len;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const t = 1 - c;
    const rot = new this.constructor([
      x * x * t + c,
      y * x * t + z * s,
      z * x * t - y * s,
      0,
      x * y * t - z * s,
      y * y * t + c,
      z * y * t + x * s,
      0,
      x * z * t + y * s,
      y * z * t - x * s,
      z * z * t + c,
      0,
      0,
      0,
      0,
      1,
    ]);

    return this.multiply(rot);
  }

  scale(
    scaleX,
    scaleY = scaleX,
    scaleZ = 1,
    originX = 0,
    originY = 0,
    originZ = 0,
  ) {
    // Translate to origin, scale, then translate back
    const translateToOrigin = new this.constructor([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      -originX,
      -originY,
      -originZ,
      1,
    ]);

    const scale = new this.constructor([
      scaleX,
      0,
      0,
      0,
      0,
      scaleY,
      0,
      0,
      0,
      0,
      scaleZ,
      0,
      0,
      0,
      0,
      1,
    ]);

    const translateBack = new this.constructor([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      originX,
      originY,
      originZ,
      1,
    ]);

    return this.multiply(translateBack)
      .multiply(scale)
      .multiply(translateToOrigin);
  }

  scale3d(scale, originX = 0, originY = 0, originZ = 0) {
    return this.scale(scale, scale, scale, originX, originY, originZ);
  }

  skewX(angle) {
    const t = Math.tan((angle * Math.PI) / 180);
    const skew = new this.constructor([
      1,
      0,
      0,
      0,
      t,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ]);
    return this.multiply(skew);
  }

  skewY(angle) {
    const t = Math.tan((angle * Math.PI) / 180);
    const skew = new this.constructor([
      1,
      t,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ]);
    return this.multiply(skew);
  }

  translate(tx, ty = 0, tz = 0) {
    const trans = new this.constructor([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      tx,
      ty,
      tz,
      1,
    ]);
    return this.multiply(trans);
  }

  toString() {
    return `matrix3d([${[
      this._m11,
      this._m12,
      this._m13,
      this._m14,
      this._m21,
      this._m22,
      this._m23,
      this._m24,
      this._m31,
      this._m32,
      this._m33,
      this._m34,
      this._m41,
      this._m42,
      this._m43,
      this._m44,
    ].join(", ")}])`;
  }

  toFloat32Array() {
    return new Float32Array([
      this._m11,
      this._m12,
      this._m13,
      this._m14,
      this._m21,
      this._m22,
      this._m23,
      this._m24,
      this._m31,
      this._m32,
      this._m33,
      this._m34,
      this._m41,
      this._m42,
      this._m43,
      this._m44,
    ]);
  }

  multiply(other) {
    const a = this.toFloat32Array();
    const b = other.toFloat32Array();
    const r = new Float32Array(16);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
          // note: b is on the left, a on the right
          sum += b[row * 4 + i] * a[i * 4 + col];
        }
        r[row * 4 + col] = sum;
      }
    }

    return new this.constructor(Array.from(r));
  }
}

class DOMMatrix extends DOMMatrixReadOnly {
  constructor(init) {
    super(init);
  }

  get m11() {
    return this._m11;
  }

  get m12() {
    return this._m12;
  }

  get m13() {
    return this._m13;
  }

  get m14() {
    return this._m14;
  }

  get m21() {
    return this._m21;
  }

  get m22() {
    return this._m22;
  }

  get m23() {
    return this._m23;
  }

  get m24() {
    return this._m24;
  }

  get m31() {
    return this._m31;
  }

  get m32() {
    return this._m32;
  }

  get m33() {
    return this._m33;
  }

  get m34() {
    return this._m34;
  }

  get m41() {
    return this._m41;
  }

  get m42() {
    return this._m42;
  }

  get m43() {
    return this._m43;
  }

  get m44() {
    return this._m44;
  }

  get a() {
    return this._m11;
  }

  get b() {
    return this._m12;
  }

  get c() {
    return this._m21;
  }

  get d() {
    return this._m22;
  }

  get e() {
    return this._m41;
  }

  get f() {
    return this._m42;
  }

  set m11(v) {
    this._m11 = v;
  }

  set m12(v) {
    this._m12 = v;
  }

  set m13(v) {
    this._m13 = v;
  }

  set m14(v) {
    this._m14 = v;
  }

  set m21(v) {
    this._m21 = v;
  }

  set m22(v) {
    this._m22 = v;
  }

  set m23(v) {
    this._m23 = v;
  }

  set m24(v) {
    this._m24 = v;
  }

  set m31(v) {
    this._m31 = v;
  }

  set m32(v) {
    this._m32 = v;
  }

  set m33(v) {
    this._m33 = v;
  }

  set m34(v) {
    this._m34 = v;
  }

  set m41(v) {
    this._m41 = v;
  }

  set m42(v) {
    this._m42 = v;
  }

  set m43(v) {
    this._m43 = v;
  }

  set m44(v) {
    this._m44 = v;
  }

  set a(v) {
    this._m11 = v;
  }

  set b(v) {
    this._m12 = v;
  }

  set c(v) {
    this._m21 = v;
  }

  set d(v) {
    this._m22 = v;
  }

  set e(v) {
    this._m41 = v;
  }

  set f(v) {
    this._m42 = v;
  }

  invertSelf() {
    const res = this.inverse();
    Object.assign(this, res);
    return this;
  }

  rotateAxisAngleSelf(x, y, z, angle) {
    const res = this.rotateAxisAngle(x, y, z, angle);
    Object.assign(this, res);
    return this;
  }

  scaleSelf(
    scaleX,
    scaleY = scaleX,
    scaleZ = 1,
    originX = 0,
    originY = 0,
    originZ = 0,
  ) {
    const res = this.scale(scaleX, scaleY, scaleZ, originX, originY, originZ);
    Object.assign(this, res);
    return this;
  }

  scale3dSelf(scale, originX = 0, originY = 0, originZ = 0) {
    const res = this.scale3d(scale, originX, originY, originZ);
    Object.assign(this, res);
    return this;
  }

  skewXSelf(angle) {
    const res = this.skewX(angle);
    Object.assign(this, res);
    return this;
  }

  skewYSelf(angle) {
    const res = this.skewY(angle);
    Object.assign(this, res);
    return this;
  }

  translateSelf(tx, ty = 0, tz = 0) {
    const res = this.translate(tx, ty, tz);
    Object.assign(this, res);
    return this;
  }

  multiplySelf(other) {
    const res = this.multiply(other);
    Object.assign(this, res);
    return this;
  }

  setMatrixValue(transformList) {
    const res = new this.constructor(transformList);
    Object.assign(this, res);
    return this;
  }
}

window.DOMMatrixReadOnly = DOMMatrixReadOnly;
window.DOMMatrix = DOMMatrix;
