const THREE = require('three');

const Line = require('./Line');
const Text = require('./Text');

function createTrajectoryLine(vertices, color, width, model_matrix, K3D) {
    return Line.create({
        vertices: {
            data: vertices,
        },
        color: color,
        width: width,
        opacity: 1.0,
        shader: 'simple',
        model_matrix: model_matrix,
    }, K3D);
}

function createWelllabel(text, pos, K3D) {
    // escape underscores
    text = text.replace('_', '\_');
    text = "\\mathsf{\\text{" + text + "}}"

    const textConfig = {
        text,
        position: [pos.x, pos.y, pos.z],
        referencePoint: 'cb',
        size: 0.75,
        is_html: false,
        label_box: false,
        on_top: true,
    };

    return Text.create(textConfig, K3D);
}

function getWellhead(traj) {
    // find point with highest z in trajectory
    let wellhead = new THREE.Vector3();
    let index = 0;
    let z = -Infinity;
    for (let i = 0; i < traj.length; i += 3) {
        if (traj[i + 2] > z) {
            z = traj[i + 2];
            index = i;
        }
    }

    const offset = 2.0;
    wellhead.set(traj[index], traj[index + 1], traj[index + 2] + offset);
    return wellhead;
}

module.exports = {
    createTrajectoryLine,
    createWelllabel,
    getWellhead,
};