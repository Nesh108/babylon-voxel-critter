/* globals BABYLON */
'use strict';

let noaEngine = require('noa-engine')

let opts = {}

// create engine
let noa = noaEngine(opts)

let scene = noa.rendering.getScene()  // Babylon's "Scene" object

let CritterCreator = require('../')({
  	// Pass it a copy of the Babylon scene
	scene: scene,
});

// Create from image
let goodRabbitScale = 0.2;
let goodRabbitRotation = new BABYLON.Vector3(0, Math.PI, 0);
let goodRabbitMesh;
let goodRabbitEid;

CritterCreator.create_mesh_from_image('./rabbit.png', goodRabbitScale, function(mesh){
	// Tell Noa to create an instance of the mesh
	goodRabbitMesh = mesh;
	mesh.rotation = goodRabbitRotation;
	// Usage: entities.add( pos, w, h, mesh, meshOffset, doPhysics, shadow
	goodRabbitEid = noa.entities.add([-1, 1.8, 7], 1, 0.5, goodRabbitMesh, [0,0,0], false, false);
});

////////////////////////////////////

// Create from hash
let evilRabbitHash = "C/2ecc713498db34495ee67e22ecf0f1000000de8787ff0000:A/bfhkSfdihfShaefShahfShahhYfYfYfSfSfSfYhYhYhahjSdechjYhYhYhadfQUhchfYhYhSfYdQYhYhaefQYhYhYhYhSjcchQYhYhYhYhSfSfWehSfUhShecheQYhYhYhYhachYhYhafhYhahfShXdfhShcihYaVhfYmfbihhQYhYhYhaddQShahfYhYhYhShYfYfYfafhQUhchfYhYhYhShechdUhUhcheUhUhcheUhUhcheUhUhcheUhUhWehUhUhcfeUhUhcfeUhUhcfeUhUhcfeUhUhehehUhUhcheUhUhcheUhUhcheUhUhWehUhUhcfeUhUhcfeUhUhcfeUhUhcfeUiWffUhWheQYhYhYhYhachQYiYhYhShYfYfYfYfShYhYhYhYhadeakiQSfSfSfUfShShShUfSfSfSfUfShShShUfSfSfSfcakQShShWfeQShShWeeQUhWfhUhShUfWjhQUfUfUfWfdQShShShWkhQUfUfUfchjQYhYhYhYhUfYfYdYhUfYhYhcifQYfYfYfYeQcffQYhYlYfcdhckjUfUfeejeYhYcYhcfhYhcfhYhcifYhcfhYhcfhYhYcYhfjaijacfShcjeYfYfUfYifblfeUfcfhUhcpeUhYhUhebeh";
let evilRabbitScale = 0.2;
let evilRabbitRotation = new BABYLON.Vector3(0, Math.PI/2, 0);
let evilRabbitMesh;
let evilRabbitEid;

CritterCreator.create_mesh_from_hash(evilRabbitHash, evilRabbitScale, function(mesh){
	// Tell Noa to create an instance of the mesh
	evilRabbitMesh = mesh;
	mesh.rotation = evilRabbitRotation;
	// Usage: entities.add( pos, w, h, mesh, meshOffset, doPhysics, shadow
	evilRabbitEid = noa.entities.add([-3, 2, -1], 1, 0.5, evilRabbitMesh, [0,0,0], false, false);
});

///////////////////////////////////////////////
////////// The rest of the world
///////////////////////////////////////////////


// register some block materials (just colors here)
let textureURL = null // replace that to use a texture
let brownish = [0.45, 0.36, 0.22]
let greenish = [0.1, 0.8, 0.2]
noa.registry.registerMaterial('dirt', brownish, textureURL)
noa.registry.registerMaterial('grass', greenish, textureURL)


// register block types and their material name
let dirtID = noa.registry.registerBlock(1, { material: 'dirt' })
let grassID = noa.registry.registerBlock(2, { material: 'grass' })

// add a listener for when the engine requests a new world chunk
// `data` is an ndarray - see https://github.com/scijs/ndarray
noa.world.on('worldDataNeeded', function (id, data, x, y, z) {
	// populate ndarray with world data (block IDs or 0 for air)
	for (let i = 0; i < data.shape[0]; ++i) {
		for (let k = 0; k < data.shape[2]; ++k) {
			let height = getHeightMap(x + i, z + k)
			for (let j = 0; j < data.shape[1]; ++j) {
				if (y + j < height) {
					if (y + j < 0) data.set(i, j, k, dirtID)
					else data.set(i, j, k, grassID);
				}
			}
		}
	}
	// pass the finished data back to the game engine
	noa.world.setChunkData(id, data)
})

// worldgen - return a heightmap for a given [x,z]
function getHeightMap(x, z) {
	let xs = 0.8 + Math.sin(x / 10)
	let zs = 0.4 + Math.sin(z / 15 + x / 30)
	return xs + zs
}

// get the player entity's ID and other info (aabb, size)
let eid = noa.playerEntity
let dat = noa.entities.getPositionData(eid)
let w = dat.width
let h = dat.height

// make a Babylon.js mesh and scale it, etc.
let mesh = BABYLON.Mesh.CreateBox('player', 1, scene)
mesh.scaling.x = mesh.scaling.z = w
mesh.scaling.y = h

// offset of mesh relative to the entity's "position" (center of its feet)
let offset = [0, h / 2, 0]

// a "mesh" component to the player entity
noa.entities.addComponent(eid, noa.entities.names.mesh, {
	mesh: mesh,
	offset: offset
})


// on left mouse, set targeted block to be air
noa.inputs.down.on('fire', function () {
	if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
})

// on right mouse, place some grass
noa.inputs.down.on('alt-fire', function () {
	if (noa.targetedBlock) noa.addBlock(grassID, noa.targetedBlock.adjacent)
})

// add a key binding for "E" to do the same as alt-fire
noa.inputs.bind('alt-fire', 'E')

// each tick, consume any scroll events and use them to zoom camera
let zoom = 0
noa.on('tick', function (dt) {
	let scroll = noa.inputs.state.scrolly
	if (scroll === 0) return

	// handle zoom controls
	zoom += (scroll > 0) ? 1 : -1
	if (zoom < 0) zoom = 0
	if (zoom > 10) zoom = 10
	noa.rendering.zoomDistance = zoom
})


