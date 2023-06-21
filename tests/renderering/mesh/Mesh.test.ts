import { Mesh } from '../../../src/rendering/mesh/shared/Mesh';
import { MeshGeometry } from '../../../src/rendering/mesh/shared/MeshGeometry';
import { Container } from '../../../src/rendering/scene/Container';
import { getRenderer } from '../../utils/getRenderer';
import { getTexture } from '../../utils/getTexture';

function getMesh()
{
    const size = 10;

    const quadGeometry = new MeshGeometry({
        positions: new Float32Array([-size, -size, size, -size, size, size, -size, size]),
        uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        indices: new Uint32Array([0, 1, 2, 0, 2, 3]), // triangle 1);
    });

    const mesh = new Mesh({
        texture: getTexture(),
        geometry: quadGeometry
    });

    return mesh;
}

describe('Mesh', () =>
{
    it('should not throw when destroyed', () =>
    {
        const mesh = getMesh();

        expect(() => mesh.destroy()).not.toThrow();
    });

    it('should clean up correctly on the pipe when destroyed', async () =>
    {
        const renderer = await getRenderer();

        const container = new Container();

        const mesh = getMesh();

        container.addChild(mesh);

        renderer.render(container);

        const gpuMesh = renderer.renderPipes.mesh['gpuBatchableMeshHash'][mesh.uid];

        mesh.destroy();

        expect(mesh.geometry).toBeNull();
        expect(mesh.texture).toBeNull();
        expect(mesh.view.owner).toBeNull();

        expect(renderer.renderPipes.mesh['renderableHash'][mesh.uid]).toBeNull();
        expect(renderer.renderPipes.mesh['gpuBatchableMeshHash'][mesh.uid]).toBeNull();

        expect(gpuMesh.renderable).toBeNull();
    });
});