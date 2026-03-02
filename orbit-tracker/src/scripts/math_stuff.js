import * as THREE from 'three';

export function conicPolarFormula(e, p, theta) {
    return p / (1 + e * Math.cos(theta));
}

export function conicCartesianFormula(e, p, theta) {
    const r = conicPolarFormula(e, p, theta);
    return new THREE.Vector3(
        r * Math.cos(theta),
        r * Math.sin(theta),
        0
    );
}