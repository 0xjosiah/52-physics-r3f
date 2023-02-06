import { OrbitControls, PivotControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { BallCollider, CapsuleCollider, ConeCollider, CuboidCollider, Debug, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Experience()
{
    const cube = useRef(null)
    const cubeClick = (event) => {
        const mass = cube.current.mass()

        cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 }) // similar to addForce but force is sustained like wind, impluse is more of a jump
        cube.current.applyTorqueImpulse({
            x: Math.random() - .5,
            y: Math.random() - .5,
            z: Math.random() - .5,
        })
    }

    const twister = useRef(null)
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const eulerRotation = new THREE.Euler(0, time, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)
        // this method only takes quaternion, thus the above conversion
        twister.current.setNextKinematicRotation(quaternionRotation)

        const angle = time * .5
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        twister.current.setNextKinematicTranslation({
            x,
            y: -.8, // this is result of matching pos for body init below
            z
        })
    })

    const collisionEnter = () => {
        console.log('collision!');
    }

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <Physics
            gravity={[ 0, -9.81, 0 ]} // y value (or down depending) of -9.81 is 'realistic'
        >
            <Debug />

            <RigidBody
                colliders='ball'
                gravityScale={ 1 }
                restitution={ .5 } // this refers to bounciness, default is 0, when obj collide - rest is calc'd by taking avg rest of two colliding bodies, i.e. both bodies having a score of 1 is not realistic
                friction={ 0.7 } // as with restitution, avg of values among all bodies involved
                // mass auto calc'd based on shape and volume, if multiple bodies - calc'd as sum of bodies, i.e. bigger obj - bigger mass
                // mass does not effect fall speed
                // to adjust mass, need to create custom colliders
            >
                <mesh castShadow position={ [ -1, 5, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            {/* <RigidBody
                // default rigid body is a cuboid
                // cuboid and ball are more performant than hull and trimesh, trimesh least perf
                // avoid using trimesh with dynamic bodies (movable bodies), they are hollow by default and makes collision detection prone to bugs
                // other option is hull ('convex hull' full name), creates encasing wrap around object, doesn't account for holes
                // setting colliders to false allows for custom collider
                colliders={ false }
                position={ [ 0, 0, 0 ] }
                rotation-x={ Math.PI * .5 }
                // scale not supported on rigid body
            >
                <ConeCollider
                    args={[ 1.5, 1.5, .5 ]} // units are half extends, measure from center to edge
                />
                <ConeCollider
                    args={[ .25, 1, .25 ]}
                    rotation={ [ - Math.PI * .5, 0, 0 ]}
                    position={[ 2, 1, - 1 ]}
                />
                <mesh castShadow>
                    <torusGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody> */}

            <RigidBody
                position={[ 2, 0, 0 ]}
                // do not apply position or rotation to body at run time - creates bugs, if needs moving - apply forces or impulses
                // if movement is required, some resetting will be required or use a kinematic type (instead of fixed or dynamic)
                // kinematic often used for player controlled obj
                ref={ cube }
                // restitution={ .6 }
                friction={ 0.7 }
                colliders={ false }
                onCollisionEnter={ collisionEnter }
            >
                <CuboidCollider
                    args={[ .5, .5, .5 ]}
                    mass={ 3 }
                />
                <mesh
                    castShadow
                    onClick={ cubeClick } // pointer events must be on mesh not rigidbody
                >
                    <boxGeometry />
                    <meshStandardMaterial color='mediumpurple' />
                </mesh>
            </RigidBody>

            <RigidBody // can only be added as child in physics tag
                type='fixed' // default is dynamic
                // restitution={ 1 }
                friction={ 0.7 }
            >
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <RigidBody
                position={[ 0, -0.8, 0 ]}
                friction={ 0 }
                type='kinematicPosition' 
                // kinematic types can only be moved manually, not by other bodies
                ref={ twister }
            >
                <mesh castShadow scale={[ .4, .4, 3 ]} >
                    <boxGeometry />
                    <meshStandardMaterial color='salmon' />
                </mesh>
            </RigidBody>


        </Physics>


    </>
}