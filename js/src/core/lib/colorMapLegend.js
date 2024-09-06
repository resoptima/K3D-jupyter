const mathHelper = require('./helpers/math');
const colorMapHelper = require('./helpers/colorMap');
const _ = require('../../lodash');

function getColorLegend(K3D, object) {
    let line;
    let text;
    let tick;
    const marginX = 2;
    const marginY = 10;
    const rectWidth = 10;
    const rectHeight = 100;
    let majorScale;
    const range = [];
    const intervals = [];
    let intervalOffset;
    let intervalCount = 0;
    const strokeWidth = 0.5;
    let i;

    if (!K3D.lastColorMap) {
        K3D.lastColorMap = {
            objectId: null,
            colorRange: [null, null],
            colorMap: null
        };
    }

    if (typeof (object) !== 'object') {
        return;
    }

    range[0] = Math.min(object.color_range[0], object.color_range[1]);
    range[1] = Math.max(object.color_range[0], object.color_range[1]);

    // avoid regenerating colormap
    if (K3D.lastColorMap.objectId === object.id &&
        K3D.lastColorMap.colorRange[0] == range[0] &&
        K3D.lastColorMap.colorRange[1] == range[1] &&
        _.isEqual(K3D.lastColorMap.colorMap, object.color_map.data)) {
        return;
    }


    if (K3D.colorMapNode) {
        K3D.getWorld().targetDOMNode.removeChild(K3D.colorMapNode);
        K3D.colorMapNode = null;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgNS = svg.namespaceURI;
    const rect = document.createElementNS(svgNS, 'rect');

    svg.setAttribute('class', 'colorMapLegend');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = [
        'position: absolute',
        'top: 5px',
        'left: 5px',
        'width: 30vh',
        'height: 30vh',
        'max-width: 300px',
        'max-height: 300px',
        'min-width: 150px',
        'min-height: 150px',
        'z-index: 16777271',
        'pointer-events: none',
        'font-family: Arial',
    ].join(';');

    // Add title text
    const title = document.createElementNS(svgNS, 'text');
    title.setAttribute('x', '0');
    title.setAttribute('y', '5');
    title.setAttribute('font-size', '0.3em');
    title.setAttribute('fill', 'black');
    title.innerHTML = K3D.parameters.colorbarTitle;
    svg.appendChild(title);
    
    colorMapHelper.createSVGGradient(svg, `colormap${object.id}`, object.color_map.data);

    rect.setAttribute('stroke-width', strokeWidth.toString(10));
    rect.setAttribute('stroke-linecap', 'square');
    rect.setAttribute('stroke', 'black');
    rect.setAttribute('fill', `url(#colormap${object.id})`);
    rect.setAttribute('width', rectWidth.toString(10));
    rect.setAttribute('height', (rectHeight - marginY - 2).toString(10));
    rect.setAttribute('x', marginX.toString(10));
    rect.setAttribute('y', marginY.toString(10));

    svg.appendChild(rect);


    const colorRange = range[1] - range[0];
    majorScale = mathHelper.pow10ceil(Math.abs(colorRange)) / 10.0;

    while (intervalCount < 4) {
        intervalOffset = mathHelper.fmod(range[0], majorScale);
        intervalOffset = (intervalOffset > 0 ? majorScale - intervalOffset : 0);
        intervalCount = Math.floor((Math.abs(colorRange) - intervalOffset + majorScale * 0.001) / majorScale);

        if (intervalCount < 4) {
            majorScale /= 2.0;
        }
    }

    for (i = 0; i <= intervalCount; i++) {
        intervals.push(range[0] + intervalOffset + i * majorScale);
    }

    intervals.forEach((v) => {
        line = document.createElementNS(svgNS, 'line');
        text = document.createElementNS(svgNS, 'text');

        const y = marginY + (rectHeight - marginY - 2) * (1.0 - (v - range[0]) / colorRange);

        if (K3D.parameters.colorbarScientific) {
            tick = v.toPrecision(4);
        } else {
            tick = v.toFixed((majorScale.toString(10).split('.')[1] || '').length);
        }

        line.setAttribute('x1', (marginX + rectWidth - 2).toString(10));
        line.setAttribute('y1', y.toString(10));
        line.setAttribute('x2', (marginX + rectWidth + 1).toString(10));
        line.setAttribute('y2', y.toString(10));
        line.setAttribute('stroke-width', strokeWidth.toString(10));
        line.setAttribute('stroke', 'black');
        svg.appendChild(line);

        text.setAttribute('x', (marginX + rectWidth + 2).toString(10));
        text.setAttribute('y', y.toString(10));
        text.setAttribute('alignment-baseline', 'middle');
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('font-size', '0.25em');
        text.setAttribute('fill', 'rgb(68, 68, 68)');
        text.innerHTML = tick;
        svg.appendChild(text);
    });

    K3D.getWorld().targetDOMNode.appendChild(svg);

    K3D.colorMapNode = svg;

    K3D.lastColorMap = {
        objectId: object.id,
        colorRange: range,
        colorMap: object.color_map.data
    };
}

module.exports = {
    getColorLegend,
};
