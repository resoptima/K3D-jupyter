import k3d
import numpy as np
import pytest
from .plot_compare import *
from k3d.helpers import download
import vtk
from vtk.util import numpy_support


def test_volume():
    prepare()

    filename = download('https://vedo.embl.es/examples/data/embryo.slc')
    reader = vtk.vtkSLCReader()
    reader.SetFileName(filename)
    reader.Update()
    vti = reader.GetOutput()

    x, y, z = vti.GetDimensions()
    volume_data = numpy_support.vtk_to_numpy(
        vti.GetPointData().GetArray(0)
    ).reshape(-1, y, x).astype(np.float32)

    volume = k3d.volume(volume_data, samples=128)

    pytest.plot += volume

    compare('volume')


def test_volume_opacity_function():
    prepare()

    filename = download('https://vedo.embl.es/examples/data/embryo.slc')
    reader = vtk.vtkSLCReader()
    reader.SetFileName(filename)
    reader.Update()
    vti = reader.GetOutput()

    x, y, z = vti.GetDimensions()
    volume_data = numpy_support.vtk_to_numpy(
        vti.GetPointData().GetArray(0)
    ).reshape(-1, y, x).astype(np.float32)

    volume = k3d.volume(volume_data, opacity_function=[0, 0.0, 0.2, 0.5, 1, 1.0], samples=128)

    pytest.plot += volume

    compare('volume_opacity_function')


def test_volume_alpha_coef():
    prepare()

    filename = download('https://vedo.embl.es/examples/data/embryo.slc')
    reader = vtk.vtkSLCReader()
    reader.SetFileName(filename)
    reader.Update()
    vti = reader.GetOutput()

    x, y, z = vti.GetDimensions()
    volume_data = numpy_support.vtk_to_numpy(
        vti.GetPointData().GetArray(0)
    ).reshape(-1, y, x).astype(np.float32)

    volume = k3d.volume(volume_data, alpha_coef=200, samples=128)

    pytest.plot += volume

    compare('volume_alpha_coef')