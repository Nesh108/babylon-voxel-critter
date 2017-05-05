let scene;
let voxel_converter;
let voxel;
let mesher;

function Critter(opts) {
  if (!(this instanceof Critter)) return new Critter(opts || {});
  scene = opts.scene;

  voxel_converter = require('voxel-critter').Convert();
  voxel = require('voxel');
  mesher = require('./mesher.js');
} 

module.exports = Critter;

Critter.prototype.create_mesh_from_image = function(path, scale, onComplete) {
  voxel_converter.readImage(path, function(err, hash) {
    if(err === null) {
      return this.create_mesh_from_hash(hash, scale, onComplete);
    } else {
      console.error("import_from_image: " + err);
    }
    return null;
  }.bind(this));
};

Critter.prototype.create_mesh_from_hash = function(hash, scale, onComplete) {
  // Convert hash into voxels
  let converted = voxel_converter.toVoxels(hash);
  let bounds = converted.bounds;
  let voxels = converted.voxels;
  let colors = converted.colors;

  // Parse the voxels for the mesher
  bounds[0] = bounds[0].map(function(b) { return b - 1; });
  bounds[1] = bounds[1].map(function(b) { return b + 1; });
  voxels = voxel.generate(bounds[0], bounds[1], function(x, y, z) {
      if(voxels[[x, y, z].join('|')] !== undefined) {
          return voxels[[x, y, z].join('|')] + 1;
      }
      return 0;
  });
  let result = mesher( voxels.voxels, voxels.dims);

  let positions = [];
  let indices = [];
  let normals = [];
  let colorlist = [];

  for (let i = 0; i < result.vertices.length; ++i) {
      let q = result.vertices[i];
      positions.push(q[0], q[1], q[2]);
  }

  for (let i = 0; i < result.faces.length; ++i) {
      let q = result.faces[i];
      let col = colors[q[3] - 1] || colors[0];
      indices.push(q[0], q[1], q[2]);
      colorlist.push(col[0], col[1], col[2], 1);
      colorlist.push(col[0], col[1], col[2], 1);
  }

  BABYLON.VertexData.ComputeNormals(positions, indices, normals);
  let vertexData = new BABYLON.VertexData();

  // Stuff its buffers with your stuff
  vertexData.positions = positions;
  vertexData.indices = indices;
  vertexData.normals = normals;
  vertexData.colors = colorlist;

  // Prepare mesh
  let imported_mesh = new BABYLON.Mesh("imported_mesh", scene);
  vertexData.applyToMesh(imported_mesh, true);
  let imported_mesh_mat = new BABYLON.StandardMaterial('imported_mesh_mat', scene);
  imported_mesh_mat.backFaceCulling = false;
  imported_mesh.bakeCurrentTransformIntoVertices();
  imported_mesh.material = imported_mesh_mat;

  // Scale and flip X axis to match the builder
  imported_mesh.scaling.x = -scale;
  imported_mesh.scaling.y = scale;
  imported_mesh.scaling.z = scale;

  onComplete(imported_mesh);     
};