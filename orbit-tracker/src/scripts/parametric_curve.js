import * as THREE from 'three';

export class ParametricCurve3D {

    constructor(func, tStart, tEnd, segments = 200, material = null) {

        this.func = func;
        this.tStart = tStart;
        this.tEnd = tEnd;
        this.segments = segments;

        // Estado interno de rotação absoluta
        this._rotX = 0;
        this._rotY = 0;
        this._rotZ = 0;

        this.geometry = new THREE.BufferGeometry();

        this.material = material ?? new THREE.LineBasicMaterial({
            color: 0xff0000
        });

        this.createCurve();
    }

    createCurve() {

        const positions = [];

        for (let i = 0; i <= this.segments; i++) {

            const t = this.tStart + (i / this.segments) * (this.tEnd - this.tStart);

            const point = this.func(t);

            positions.push(point.x, point.y, point.z);
        }

        this.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );

        this.line = new THREE.Line(this.geometry, this.material);
    }

    // ===============================
    // MATERIAL
    // ===============================

    setMaterial(material) {
        this.material = material;
        this.line.material = material;
    }

    getObject() {
        return this.line;
    }

    // ===============================
    // ROTAÇÃO INCREMENTAL
    // ===============================

    rotateX(angle) {
        this.line.rotateOnWorldAxis(
            new THREE.Vector3(1, 0, 0),
            angle
        );
    }

    rotateY(angle) {
        this.line.rotateOnWorldAxis(
            new THREE.Vector3(0, 1, 0),
            angle
        );
    }

    rotateZ(angle) {
        this.line.rotateOnWorldAxis(
            new THREE.Vector3(0, 0, 1),
            angle
        );
    }

    rotateXDeg(degrees) {
        this.rotateX(THREE.MathUtils.degToRad(degrees));
    }

    rotateYDeg(degrees) {
        this.rotateY(THREE.MathUtils.degToRad(degrees));
    }

    rotateZDeg(degrees) {
        this.rotateZ(THREE.MathUtils.degToRad(degrees));
    }

    // ===============================
    // ROTAÇÃO ABSOLUTA (Radianos)
    // ===============================

    updateRotation() {
        const euler = new THREE.Euler(
            this._rotX,
            this._rotY,
            this._rotZ,
            'XYZ'
        );

        this.line.quaternion.setFromEuler(euler);
    }

    setRotationX(angle) {
        this._rotX = angle;
        this.updateRotation();
    }

    setRotationY(angle) {
        this._rotY = angle;
        this.updateRotation();
    }

    setRotationZ(angle) {
        this._rotZ = angle;
        this.updateRotation();
    }

    // ===============================
    // ROTAÇÃO ABSOLUTA (Graus)
    // ===============================

    setRotationXDeg(degrees) {
        this._rotX = THREE.MathUtils.degToRad(degrees);
        this.updateRotation();
    }

    setRotationYDeg(degrees) {
        this._rotY = THREE.MathUtils.degToRad(degrees);
        this.updateRotation();
    }

    setRotationZDeg(degrees) {
        this._rotZ = THREE.MathUtils.degToRad(degrees);
        this.updateRotation();
    }
}