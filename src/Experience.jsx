import { OrbitControls, PivotControls } from '@react-three/drei'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

export default function Experience()
{
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <Physics>
            <Debug />

            <RigidBody
                colliders='ball'
            >
                <mesh castShadow position={ [ 0, 5, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody
                // default rigid body is a cuboid
                // cuboid and ball are more performant than hull and trimesh, trimesh least perf
                // avoid using trimesh with dynamic bodies (movable bodies), they are hollow by default and makes collision detection prone to bugs
                colliders='trimesh' // other option is hull ('convex hull' full name), creates encasing wrap around object, doesn't account for holes
            >
                <mesh castShadow position={ [ 0, 0, 0 ] } rotation-x={ Math.PI * .5 }>
                    <torusGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>

            <RigidBody // can only be added as child in physics tag
                type='fixed' // default is dynamic
            >
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>


        </Physics>


    </>
}