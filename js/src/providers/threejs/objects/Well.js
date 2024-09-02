const THREE = require('three');

const { commonUpdate, areAllChangesResolve } = require('../helpers/Fn');
const { createTrajectoryLine, createWelllabel, getWellhead } = require('./WellUtils');

/**
 * Loader strategy to handle Well object
 * @method Well
 * @memberof K3D.Providers.ThreeJS.Objects
 * @param {Object} config all configurations params from JSON
 * @return {Object} 3D object ready to render
 */
module.exports = {
    create(config, K3D) {

        const object = new THREE.Group();

        const trajectory = createTrajectoryLine(
            config.vertices.data,
            config.color,
            config.width,
            config.model_matrix,
            K3D
        );

        Promise.resolve(trajectory).then((traj) => {
            object.add(traj);
        });

        const modelMatrix = new THREE.Matrix4();
        if (config.model_matrix) {
            modelMatrix.set.apply(modelMatrix, config.model_matrix.data);
            object.applyMatrix4(modelMatrix);
        }
        object.updateMatrixWorld();


        // add well label
        let wellhead = getWellhead(config.vertices.data);
        const lableObject = createWelllabel(config.label, wellhead, K3D);

        return Promise.resolve(lableObject).then((label) => {
            object.add(label);

            // when visibliity is toggled, toggle label visibility
            object.onRemove = function () {
                label.onRemove();
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

