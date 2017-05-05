# Babylon Voxel Critter
Voxel critter for Babylon.js

> Critter for [Babylon.js](https://github.com/BabylonJS/Babylon.js).

> Best when used with [Noa-Engine](https://github.com/andyhall/noa).

## Example

```js
// Create from image
let scale = 0.2;
let rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
let imported_mesh;
let eid;

CritterCreator.create_mesh_from_image('./rabbit.png', scale, function(mesh){
	imported_mesh = mesh;
	mesh.rotation = rotation;
	// Add mesh to the world
	eid = noa.entities.add([-1, 1.8, 7], 1, 0.5, imported_mesh, [0,0,0], false, false);
});

////////////////////////////////////
////////////////////////////////////

// Create from hash
let hash = "C/2ecc713498db34495ee67e22ecf0f1000000de8787ff0000:A/bfhkSfdihfShaefShahfShahhYfYfYfSfSfSfYhYhYhahjSdechjYhYhYhadfQUhchfYhYhSfYdQYhYhaefQYhYhYhYhSjcchQYhYhYhYhSfSfWehSfUhShecheQYhYhYhYhachYhYhafhYhahfShXdfhShcihYaVhfYmfbihhQYhYhYhaddQShahfYhYhYhShYfYfYfafhQUhchfYhYhYhShechdUhUhcheUhUhcheUhUhcheUhUhcheUhUhWehUhUhcfeUhUhcfeUhUhcfeUhUhcfeUhUhehehUhUhcheUhUhcheUhUhcheUhUhWehUhUhcfeUhUhcfeUhUhcfeUhUhcfeUiWffUhWheQYhYhYhYhachQYiYhYhShYfYfYfYfShYhYhYhYhadeakiQSfSfSfUfShShShUfSfSfSfUfShShShUfSfSfSfcakQShShWfeQShShWeeQUhWfhUhShUfWjhQUfUfUfWfdQShShShWkhQUfUfUfchjQYhYhYhYhUfYfYdYhUfYhYhcifQYfYfYfYeQcffQYhYlYfcdhckjUfUfeejeYhYcYhcfhYhcfhYhcifYhcfhYhcfhYhYcYhfjaijacfShcjeYfYfUfYifblfeUfcfhUhcpeUhYhUhebeh";
let scale = 0.2;
let rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
let imported_mesh;
let eid;

CritterCreator.create_mesh_from_hash(hash, scale, function(mesh){
	imported_mesh = mesh;
	mesh.rotation = rotation;
	// Add mesh to the world
	eid = noa.entities.add([-3, 2, -1], 1, 0.5, imported_mesh, [0,0,0], false, false);
});

```

## Run the Example

1. `git clone git://github.com/Nesh108/babylon-voxel-critter && cd babylon-voxel-critter`
1. `npm install`
1. `npm start`

## Install

With [npm](https://npmjs.org) do:

```
npm install --save babylon-voxel-critter
```

## Release History

* 1.0.0 - initial release

## License

Copyright (c) 2017 Nesh108<br/>

Licensed under the MIT license.