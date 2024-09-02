const THREE = require('three');

const { commonUpdate, areAllChangesResolve } = require('../helpers/Fn');
const { createTrajectoryLine, createWelllabel, getWellhead } = require('./WellUtils');

/**
 * Loader strategy to handle WellGroup object
 * @method WellGroup
 * @memberof K3D.Providers.ThreeJS.Objects
 * @param {Object} config all configurations params from JSON
 * @return {Object} 3D object ready to render
 */
module.exports = {
    create(config, K3D) {

        const labels = config.labels;
        const trajectories = config.trajectories;

        // check if labels and trajectories are arrays with the same length
        if (labels.length !== trajectories.length) {
            throw new Error('labels and trajectories should have the same length');
        }

        const object = new THREE.Group();

        const lineObjects = [];
        for (let i = 0; i < trajectories.length; i++) {
            const traj = new Float32Array(trajectories[i]);
            lineObjects.push(createTrajectoryLine(
                traj, config.color, config.width, config.model_matrix, K3D
            ));
        }

        Promise.all(lineObjects).then((lines) => {
            lines.forEach((line) => {
                object.add(line);
            });
        });

        const modelMatrix = new THREE.Matrix4();
        if (config.model_matrix) {
            modelMatrix.set.apply(modelMatrix, config.model_matrix.data);
            object.applyMatrix4(modelMatrix);
        }
        object.updateMatrixWorld();

        const textObjects = [];
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            const wellhead = getWellhead(trajectories[i]);
            textObjects.push(createWelllabel(label, wellhead, K3D));
        }

        return Promise.all(textObjects).then((texts) => {
            texts.forEach((text) => {
                object.add(text);
            });

            // when visibliity is toggled, toggle label visibility
            object.onRemove = function () {
                texts.forEach((text) => {
                    text.onRemove();
                });
            };

            return object;
        });
    },

    update(config, changes, obj, K3D) {
        const resolvedChanges = {};

        commonUpdate(config, changes, resolvedChanges, obj, K3D);

        if (areAllChangesResolve(changes, resolvedChanges)) {
            return Promise.resolve({ json: config, obj });
        }
        return false;
    },
};
